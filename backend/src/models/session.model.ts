import mongoose, { Schema, Document, model } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId; 
  deviceInfo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  valid:boolean;
  challenge :string | null;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    valid:{type :Boolean,default:true},
    challenge : {type : String,default:null},
    deviceInfo: { type: String, default: null }
  },
  { timestamps: true }
);

export const session = model<ISession>("session", sessionSchema);