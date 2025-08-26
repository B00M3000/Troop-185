import { EventSchema } from '@/server/mongo/schemas/event';
import mongo from '@/server/mongo';
import mongoose from 'mongoose';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongo();
    }

    const { id } = params;

    // Validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw error(404, 'Event not found');
    }

    // Fetch the specific event
    const event = await EventSchema.findById(id)
      .populate('createdBy', 'name email')
      .lean()
      .exec();

    if (!event) {
      throw error(404, 'Event not found');
    }

    // Don't show draft events on public pages
    if (event.isDraft) {
      throw error(404, 'Event not found');
    }

    // Convert to plain object for serialization
    const eventData = {
      id: event._id.toString(),
      title: (event.title || '').trim(),
      date: event.date.toISOString(),
      location: event.location?.trim() || null,
      body: event.body || '', // Images are now referenced directly by /images/[id] URLs
      createdBy: {
        name: (event.createdBy as any)?.name?.trim() || 'Unknown',
        email: (event.createdBy as any)?.email?.trim() || ''
      },
      createdAt: (event as any).createdAt?.toISOString() || event.date.toISOString(),
      updatedAt: (event as any).updatedAt?.toISOString() || event.date.toISOString()
    };

    return {
      event: eventData
    };
  } catch (err) {
    console.error('Error fetching event:', err);
    throw error(404, 'Event not found');
  }
};
