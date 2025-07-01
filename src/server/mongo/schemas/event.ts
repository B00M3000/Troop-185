import mongoose from "mongoose";

interface EventDocumentData {
    title: string;
    date: Date;
    location?: string;
    body: string; // Markdown content with image aliases
    imageAliases: Map<string, string>; // Maps alias names to base64 data URLs
    createdBy: mongoose.Types.ObjectId; // Reference to User who created the event
}

const schema = new mongoose.Schema<EventDocumentData>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: false },
    body: { type: String, required: true }, // Markdown content with aliases like ![image.png](image-1)
    imageAliases: { 
      type: Map, 
      of: String, 
      required: false,
      default: new Map() 
    }, // Maps "image-1" -> "data:image/png;base64..."
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  },
  { timestamps: true }
);

// Index for better query performance
schema.index({ date: -1 }); // Most recent events first
schema.index({ createdBy: 1 });
schema.index({ title: 'text', location: 'text' }); // Text search

export type EventDocument = mongoose.HydratedDocument<EventDocumentData>;

export const EventSchema: mongoose.Model<EventDocumentData> =
  mongoose.models["Events"] || mongoose.model("Events", schema);
