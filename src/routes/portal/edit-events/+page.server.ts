import type { Session } from '@auth/sveltekit';
import { redirect, error } from '@sveltejs/kit';
import { EventSchema } from '@/server/mongo/schemas/event';
import mongo from '@/server/mongo';
import mongoose from 'mongoose';

export const load = async ({ locals }) => {
  // Check if user is authenticated
  const session = await locals.auth();

  if (!session) {
    throw redirect(307, "/portal/login");
  }

  // Check if user has admin role
  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.');
  }

  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongo();
    }

    // Fetch all events that the admin can edit, sorted by date (most recent first)
    const events = await EventSchema.find({})
      .populate('createdBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .lean()
      .exec();

    // Convert to plain objects for serialization
    const eventsData = events.map(event => ({
      _id: event._id.toString(),
      title: event.title,
      date: event.date.toISOString().split('T')[0], // Format for display
      location: event.location || '',
      isDraft: event.isDraft || false,
      createdBy: {
        name: (event.createdBy as any)?.name || 'Unknown',
        email: (event.createdBy as any)?.email || ''
      },
      createdAt: (event as any).createdAt?.toISOString() || event.date.toISOString(),
      updatedAt: (event as any).updatedAt?.toISOString() || event.date.toISOString()
    }));

    return {
      events: eventsData
    };
  } catch (err) {
    console.error('Error loading events:', err);
    throw error(500, 'Failed to load events');
  }
};