import mongoose, { Schema, Document, model } from "mongoose";

export interface IRefreshToken extends Document {
  sessionId: mongoose.Types.ObjectId; 
  tokenHash: string; 
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "session", required: true, unique: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },

  },
  { timestamps: true }
);

export const refreshToken = model<IRefreshToken>("refreshToken", refreshTokenSchema);