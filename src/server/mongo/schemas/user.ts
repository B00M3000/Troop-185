import mongoose from "mongoose";

interface UserDocumentData {
    name: string;
    email: string;
    image?: string; // Profile picture URL from Google
    role: "UNASSIGNED" | "SCOUT" | "ADULT" | "ADMIN";
    lastActive: Date;
    annotation?: string; // Admin annotation/notes about the user
}

const schema = new mongoose.Schema<UserDocumentData>(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: false }, // Google profile picture URL
    role: { type: String, enum: ["UNASSIGNED", "SCOUT", "ADULT", "ADMIN"], required: true },
    lastActive: { type: Date },
    annotation: { type: String, required: false } // Admin notes about the user
  },
  { timestamps: true }
);

export type UserDocument = mongoose.HydratedDocument<UserDocumentData>;

export const UserSchema: mongoose.Model<UserDocumentData> =
  mongoose.models["Users"] || mongoose.model("Users", schema);
