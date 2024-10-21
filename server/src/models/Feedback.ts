import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFeedback>(
  "Feedback",
  FeedbackSchema,
  "feedbacks"
);
