import { json, error } from '@sveltejs/kit';
import { EventSchema } from '@/server/mongo/schemas/event';
import mongoose from 'mongoose';
import { z } from 'zod';

const CreateEventRequestSchema = z.object({
  eventTitle: z.string().min(1, 'Event title is required'),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  location: z.string().optional()
});

type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;

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
    const data = CreateEventRequestSchema.parse(rawData);
    
    // Convert validated date string to Date object
    const eventDate = new Date(data.eventDate);

    // Create preliminary event document with draft status
    const eventData = {
      title: data.eventTitle,
      date: eventDate,
      location: data.location || undefined,
      body: '', // Empty body for draft
      isDraft: true,
      imageAliases: new Map(), // Empty image aliases for draft
      createdBy: new mongoose.Types.ObjectId(session.user.id)
    };

    const newEvent = new EventSchema(eventData);
    const savedEvent = await newEvent.save();

    return json({
      success: true,
      message: 'Event draft created successfully',
      eventId: savedEvent._id.toString()
    });

  } catch (err) {
    console.error('Error creating event draft:', err);
    
    // Handle Zod validation errors
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw error(400, `Validation error: ${errorMessages}`);
    }
    
    throw error(500, 'Failed to create event draft');
  }
}