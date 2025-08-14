import { EventSchema } from '@/server/mongo/schemas/event';
import mongo from '@/server/mongo';
import mongoose from 'mongoose';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Function to replace image aliases in markdown content
function replaceImageAliases(markdown: string, imageAliases: Map<string, string>): string {
  if (!imageAliases || imageAliases.size === 0) {
    return markdown;
  }

  let processedMarkdown = markdown;
  
  // Convert Map to object for easier iteration
  const aliasObject = Object.fromEntries(imageAliases);
  
  // Replace alias patterns with actual image URLs
  Object.entries(aliasObject).forEach(([alias, imageUrl]) => {
    // The aliases are stored with %image-N% format and used in markdown as ![alt](%image-N%)
    // We need to replace (%image-N%) with (/images/imageId)
    const aliasPattern = new RegExp(`\\(${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    processedMarkdown = processedMarkdown.replace(aliasPattern, `(${imageUrl})`);
  });

  return processedMarkdown;
}

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
      .exec();

    if (!event) {
      throw error(404, 'Event not found');
    }

    // Convert to plain object for serialization
    let sanitizedBody = event.body || '';
    try {
      // First replace image aliases with actual URLs
      sanitizedBody = replaceImageAliases(sanitizedBody, event.imageAliases);
    } catch (error) {
      console.warn('Error processing event body:', error);
      sanitizedBody = 'Content unavailable due to formatting issues.';
    }

    const eventData = {
      id: event._id.toString(),
      title: (event.title || '').trim(),
      date: event.date.toISOString(),
      location: event.location?.trim() || null,
      body: sanitizedBody,
      imageAliases: Object.fromEntries(event.imageAliases || new Map()),
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
