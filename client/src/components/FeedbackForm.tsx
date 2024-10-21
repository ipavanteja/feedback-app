import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { submitFeedback } from "../store/slices/feedbackSlice";
import { AppDispatch } from "../store";

interface FeedbackFormProps {
  receiverId: string;
  onSubmitSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  receiverId,
  onSubmitSuccess,
}) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(submitFeedback({ receiverId, content })).unwrap();
      setContent("");
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your feedback"
        required
      />
      <button type="submit">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;
