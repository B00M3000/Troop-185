import { EventSchema } from '@/server/mongo/schemas/event';
import { UserSchema } from '@/server/mongo/schemas/user';
import mongo from '@/server/mongo';
import mongoose from 'mongoose';
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

export const load: PageServerLoad = async () => {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongo();
    }

    // Fetch all events, sorted by date (most recent first)
    const events = await EventSchema.find({})
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .exec();

    // Convert MongoDB documents to plain objects for serialization
    const eventsData = events.map(event => {
      // Sanitize and validate the body content
      let sanitizedBody = event.body || '';
      try {
        // First replace image aliases with actual URLs
        sanitizedBody = replaceImageAliases(sanitizedBody, event.imageAliases);
      } catch (error) {
        console.warn('Error processing event body:', error);
        sanitizedBody = 'Content unavailable due to formatting issues.';
      }

      return {
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
