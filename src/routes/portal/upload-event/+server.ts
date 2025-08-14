import { json, error } from '@sveltejs/kit';
import { EventSchema } from '@/server/mongo/schemas/event';
import { ImageSchema, uploadImage } from '@/server/mongo/schemas/image';
import mongoose from 'mongoose';
import { z } from 'zod';

const UploadEventRequestSchema = z.object({
  eventTitle: z.string().min(1, 'Event title is required'),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  location: z.string().optional(),
  participants: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  imageAliases: z.record(z.string(), z.string()).default({}) // Maps alias names to base64 data URLs
});

type UploadEventRequest = z.infer<typeof UploadEventRequestSchema>;

export async function POST({ request, locals }) {
  const session = await locals.auth();
  
  if (!session || !session.user) {
    throw error(401, 'Authentication required');
  }

  // Check if user has admin role (extensible for other roles in the future)
  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.');
  }

  try {
    // Parse and validate request body with Zod
    const rawData = await request.json();
    const data = UploadEventRequestSchema.parse(rawData);
    
    // Convert validated date string to Date object
    const eventDate = new Date(data.eventDate);

    const uploadedImageMap = new Map<string, string>(); // Maps alias to S3 URL

    let imageIds = []
    
    if (Object.keys(data.imageAliases).length > 0) {
      for (const [alias, dataUrl] of Object.entries(data.imageAliases)) {
        let imageId = await uploadImage(dataUrl, "event");
        uploadedImageMap.set(alias, "/images/" + imageId);
        imageIds.push(imageId);
      }
    }

    // Create event document
    const eventData = {
      title: data.eventTitle,
      date: eventDate,
      body: data.description,
      location: data.location || undefined,
      imageAliases: uploadedImageMap, // Store the mapping for potential future use
      createdBy: new mongoose.Types.ObjectId(session.user.id)
    };

    const newEvent = new EventSchema(eventData);
    const savedEvent = await newEvent.save();

    await ImageSchema.updateMany({
      _id: { $in: imageIds }
    }, {
      $set: { associatedResourceTag: "event:" + savedEvent._id.toString() }
    })

    return json({
      success: true,
      message: 'Event uploaded successfully',
      eventId: savedEvent._id.toString(),
      uploadedImages: uploadedImageMap.size
    });

  } catch (err) {
    console.error('Error uploading event:', err);
    
    // Handle Zod validation errors
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw error(400, `Validation error: ${errorMessages}`);
    }
    
    // Return appropriate error response for other errors
    if (err instanceof Error && err.message.includes('S3')) {
      throw error(500, `Image upload failed: ${err.message}`);
    }
    
    throw error(500, 'Failed to upload event');
  }
}
