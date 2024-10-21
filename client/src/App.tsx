import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadUser } from "./store/slices/authSlice";
import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList";
import FeedbackList from "./components/FeedbackList";
import { RootState, AppDispatch } from "./store";
import FeedbackForm from "./components/FeedbackForm";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div>
                <h1>Dashboard</h1>
                <UserList />
                <FeedbackList />
              </div>
            ) : (
              <Login />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <div>
                <h1>Dashboard</h1>
                <UserList />
                <FeedbackList />
              </div>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
