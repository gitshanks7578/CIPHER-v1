import mongoose, { Schema, Document, model } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId; 
  refreshToken: string; 
  expiresAt: Date;
  deviceInfo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    deviceInfo: { type: String, default: null }
  },
  { timestamps: true }
);

export const Session = model<ISession>("Session", sessionSchema);