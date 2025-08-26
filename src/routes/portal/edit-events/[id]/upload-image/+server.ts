import { json, error } from '@sveltejs/kit';
import { uploadEventImage } from '@/server/mongo/schemas/image';
import mongoose from 'mongoose';
import { z } from 'zod';

const UploadImageRequestSchema = z.object({
  dataUrl: z.string().min(1, 'Image data is required'),
  filename: z.string().optional()
});

type UploadImageRequest = z.infer<typeof UploadImageRequestSchema>;

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
    const data = UploadImageRequestSchema.parse(rawData);

    // Upload the image with the event ID
    const imageId = await uploadEventImage(data.dataUrl, id);

    return json({
      success: true,
      message: 'Image uploaded successfully',
      imageId,
      filename: data.filename || 'uploaded-image'
    });

  } catch (err) {
    console.error('Error uploading image:', err);

    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw error(400, `Validation error: ${errorMessages}`);
    }

    if (err instanceof Error && err.message.includes('S3')) {
      throw error(500, `Image upload failed: ${err.message}`);
    }

    throw error(500, 'Failed to upload image');
  }
}
