import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedbacks } from "../store/slices/feedbackSlice";
import { RootState, AppDispatch } from "../store";

const FeedbackList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feedbacks, loading } = useSelector(
    (state: RootState) => state.feedback
  );

  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Received Feedback</h2>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback._id}>
            <p>{feedback.content}</p>
            <small>{new Date(feedback.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackList;
