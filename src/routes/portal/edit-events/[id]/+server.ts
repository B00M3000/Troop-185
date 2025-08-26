import { json, error } from '@sveltejs/kit';
import { EventSchema } from '@/server/mongo/schemas/event';
import { ImageSchema, uploadImage, deleteEventImages } from '@/server/mongo/schemas/image';
import mongoose from 'mongoose';
import { z } from 'zod';

const UpdateEventRequestSchema = z.object({
  eventTitle: z.string().min(1, 'Event title is required'),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  location: z.string().optional(),
  description: z.string().default('')
});

const UploadImageRequestSchema = z.object({
  dataUrl: z.string().min(1, 'Image data is required'),
  filename: z.string().optional()
});

const DeleteImageRequestSchema = z.object({
  imageId: z.string().min(1, 'Image ID is required')
});

type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;
type UploadImageRequest = z.infer<typeof UploadImageRequestSchema>;
type DeleteImageRequest = z.infer<typeof DeleteImageRequestSchema>;

// Update event
export async function POST({ request, locals, params }) {
  const session = await locals.auth();

  if (!session || !session.user) {
    throw error(401, 'Authentication required');
  }

  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.');
  }

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw error(400, 'Invalid event ID format');
  }

  try {
    const rawData = await request.json();
    const data = UpdateEventRequestSchema.parse(rawData);

    const eventDate = new Date(data.eventDate);

    // Find and update the event
    const existingEvent = await EventSchema.findById(id);
    if (!existingEvent) {
      throw error(404, 'Event not found');
    }

    const updateData = {
      title: data.eventTitle,
      date: eventDate,
      body: data.description,
      location: data.location || undefined,
      isDraft: false, // Mark as published when updating
    };

    const savedEvent = await EventSchema.findByIdAndUpdate(id, updateData, { new: true });
    if (!savedEvent) {
      throw error(500, 'Failed to update event');
    }

    return json({
      success: true,
      message: 'Event updated successfully',
      eventId: savedEvent._id.toString()
    });

  } catch (err) {
    console.error('Error updating event:', err);

    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw error(400, `Validation error: ${errorMessages}`);
    }

    throw error(500, 'Failed to update event');
  }
}

// Delete event and all associated images
export async function DELETE({ locals, params }) {
  const session = await locals.auth();

  if (!session || !session.user) {
    throw error(401, 'Authentication required');
  }

  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.');
  }

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw error(400, 'Invalid event ID format');
  }

  try {
    // Find the event
    const existingEvent = await EventSchema.findById(id);
    if (!existingEvent) {
      throw error(404, 'Event not found');
    }

    // Delete all associated images first
    const deletedImagesCount = await deleteEventImages(id);

    // Delete the event
    await EventSchema.findByIdAndDelete(id);

    return json({
      success: true,
      message: 'Event and associated images deleted successfully',
      deletedImages: deletedImagesCount
    });

  } catch (err) {
    console.error('Error deleting event:', err);
    throw error(500, 'Failed to delete event');
  }
}
