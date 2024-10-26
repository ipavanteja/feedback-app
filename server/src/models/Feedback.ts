import mongoose, { Document, Schema } from "mongoose";

export interface IFeedbackContent {
  message: string;
  timestamp: Date;
}

export interface IFeedback extends Document {
  user: mongoose.Types.ObjectId;
  content: IFeedbackContent[];
}

const FeedbackSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: [
    {
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<IFeedback>(
  "Feedback",
  FeedbackSchema,
  "feedbacks"
);
