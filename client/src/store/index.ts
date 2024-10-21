import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import feedbackReducer from "./slices/feedbackSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
