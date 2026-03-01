import mongoose , {Document,model,Schema} from "mongoose";
import bcrypt from "bcrypt"



export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  publicKey: string;
  pfpUrl?: string | null;
  lastLoginAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
  

}

const userSchema = new Schema<IUser>(
  {
    
    username: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },


    publicKey: { type: String, required: true },

    pfpUrl: { type: String, default: null },
    lastLoginAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true 
  }
);
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (userPassword:string) {
  return await bcrypt.compare(userPassword, this.password);
};
export const user = model<IUser>("user", userSchema);

