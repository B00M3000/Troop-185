import mongoose from "mongoose";

interface EventDocumentData {
    title: string;
    date: Date;
    location?: string;
    body: string; // Markdown content with image aliases
    isDraft?: boolean; // Whether this is a draft or published event
    imageAliases: Map<string, string>; // Maps alias names to base64 data URLs
    createdBy: mongoose.Types.ObjectId; // Reference to User who created the event
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new mongoose.Schema<EventDocumentData>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: false },
    body: { type: String, required: true },
    isDraft: { type: Boolean, required: false, default: false },
    imageAliases: { 
      type: Map, 
      of: String, 
      required: false,
      default: new Map() 
    }, // Maps "image-1" -> "/images/abc123"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { timestamps: true }
);

export type EventDocument = mongoose.HydratedDocument<EventDocumentData>;

export const EventSchema: mongoose.Model<EventDocumentData> =
  mongoose.models["Events"] || mongoose.model("Events", schema);
