import { json, error } from '@sveltejs/kit';
import { ImageSchema } from '@/server/mongo/schemas/image';
import mongoose from 'mongoose';
import { z } from 'zod';

const DeleteImageRequestSchema = z.object({
  imageId: z.string().min(1, 'Image ID is required')
});

type DeleteImageRequest = z.infer<typeof DeleteImageRequestSchema>;

export async function DELETE({ request, locals, params }) {
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
    const data = DeleteImageRequestSchema.parse(rawData);

    // Verify the image belongs to this event
    const image = await ImageSchema.findById(data.imageId);
    if (!image) {
      throw error(404, 'Image not found');
    }

    if (image.associatedResourceTag !== `event:${id}`) {
      throw error(403, 'Image does not belong to this event');
    }

    // Delete the image
    // Note: In production, you'd also want to delete from S3
    await ImageSchema.findByIdAndDelete(data.imageId);

    return json({
      success: true,
      message: 'Image deleted successfully',
      imageId: data.imageId
    });

  } catch (err) {
    console.error('Error deleting image:', err);

    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw error(400, `Validation error: ${errorMessages}`);
    }

    throw error(500, 'Failed to delete image');
  }
}
