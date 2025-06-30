import mongoose from "mongoose";

interface UserDocumentData {
    name: string;
    role: "SCOUT" | "ADMIN";
    lastActive: Date;
    email: string;
    password_hash: string;
    session_token?: string;
}

const schema = new mongoose.Schema<UserDocumentData>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["SCOUT", "ADMIN"], required: true },
    lastActive: { type: Date },
    session_token: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
);

export type UserDocument = mongoose.HydratedDocument<UserDocumentData>;

export const UserSchema: mongoose.Model<UserDocumentData> =
  mongoose.models["Users"] || mongoose.model("Users", schema);
