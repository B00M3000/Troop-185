import type { Session } from '@auth/sveltekit';
import { redirect, error } from '@sveltejs/kit';
import { EventSchema } from '@/server/mongo/schemas/event';
import mongoose from 'mongoose';

export const load = async ({ url, locals }) => {
  // Check if user is authenticated
  const session = await locals.auth();
  
  if (!session) {
    throw redirect(307, "/portal/login");
  }

  // Check if user has admin role
  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.');
  }

  const eventId = url.searchParams.get('id');
  
  if (eventId) {
    try {
      // Validate the event ID format
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw error(400, 'Invalid event ID format');
      }

      // Load the existing event
      const event = await EventSchema.findById(eventId);
      
      if (!event) {
        throw error(404, 'Event not found');
      }

      // Check if the user is the creator of this event (or admin)
      if (event.createdBy.toString() !== session.user.id) {
        throw error(403, 'You can only edit events you created');
      }

      // Convert the event to a plain object and handle the Map field
      const eventData = {
        _id: event._id.toString(),
        title: event.title,
        date: event.date.toISOString().split('T')[0], // Format for HTML date input
        location: event.location || '',
        body: event.body || '',
        isDraft: event.isDraft || false,
        imageAliases: Object.fromEntries(event.imageAliases || new Map())
      };

      return {
        event: eventData,
        isEditing: true
      };
    } catch (err) {
      console.error('Error loading event:', err);
      if (err instanceof Error && err.message.includes('Cast to ObjectId failed')) {
        throw error(400, 'Invalid event ID format');
      }
      throw err;
    }
  }

  // If no event ID, this is a new event creation (original behavior)
  return {
    event: null,
    isEditing: false
  };
};