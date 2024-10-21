import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

interface Feedback {
  _id: string;
  content: string;
  createdAt: string;
}

interface FeedbackState {
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  loading: false,
  error: null,
};

export const getFeedbacks = createAsyncThunk(
  "feedback/getFeedbacks",
  async (_, { getState }) => {
    const { auth } = getState() as RootState;
    const config = {
      headers: {
        "x-auth-token": auth.token,
      },
    };
    const res = await axios.get(
      "http://localhost:5000/api/feedback/received",
      config
    );
    return res.data;
  }
);

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async (formData: { receiverId: string; content: string }, { getState }) => {
    const { auth } = getState() as RootState;
    const config = {
      headers: {
        "x-auth-token": auth.token,
      },
    };
    const res = await axios.post(
      "http://localhost:5000/api/feedback",
      formData,
      config
    );
    return res.data;
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
        state.loading = false;
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default feedbackSlice.reducer;
