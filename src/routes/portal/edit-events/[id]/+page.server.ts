import type { Session } from '@auth/sveltekit';
import { redirect, error } from '@sveltejs/kit';
import { EventSchema } from '@/server/mongo/schemas/event';
import { ImageSchema } from '@/server/mongo/schemas/image';
import mongoose from 'mongoose';
import mongo from '@/server/mongo';

export const load = async ({ params, locals }) => {
  // Check if user is authenticated
  const session = await locals.auth();

  if (!session) {
    throw redirect(307, "/portal/login");
  }

  // Check if user has admin role
  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.');
  }

  const { id } = params;

  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongo();
    }

    // Validate the event ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw error(400, 'Invalid event ID format');
    }

    // Load the existing event
    const event = await EventSchema.findById(id);

    if (!event) {
      throw error(404, 'Event not found');
    }

    // Load associated images
    const images = await ImageSchema.find({
      associatedResourceTag: `event:${id}`
    }).sort({ createdAt: -1 }).lean();

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

    // Format images for the UI
    const imagesData = images.map(image => ({
      _id: image._id.toString(),
      filename: image.s3ObjectKey,
      type: image.type,
      size: image.size,
      uploadedAt: (image as any).createdAt?.toISOString() || new Date().toISOString(),
      url: `/images/${image._id.toString()}`
    }));

    return {
      event: eventData,
      images: imagesData
    };
  } catch (err) {
    console.error('Error loading event:', err);
    if (err instanceof Error && err.message.includes('Cast to ObjectId failed')) {
      throw error(400, 'Invalid event ID format');
    }
    throw err;
  }
};
