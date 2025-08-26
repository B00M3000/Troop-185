import { EventSchema } from '@/server/mongo/schemas/event';
import { UserSchema } from '@/server/mongo/schemas/user';
import mongo from '@/server/mongo';
import mongoose from 'mongoose';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongo();
    }

    // Fetch all published events, sorted by date (most recent first)
    const events = await EventSchema.find({ isDraft: { $ne: true } })
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .lean()
      .exec();

    // Convert MongoDB documents to plain objects for serialization
    const eventsData = events.map(event => {
      return {
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
    });

    return {
      events: eventsData
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      events: []
    };
  }
};
