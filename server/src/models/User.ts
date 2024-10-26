import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
});

export default mongoose.model<IUser>("User", UserSchema, "users");
