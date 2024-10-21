import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../store/slices/userSlice";
import { RootState, AppDispatch } from "../store";
import FeedbackForm from "./FeedbackForm";

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => setSelectedUser(user._id)}>
              Give Feedback
            </button>
            {selectedUser === user._id && (
              <div>
                <h3>Give Feedback to {user.username}</h3>
                <FeedbackForm receiverId={user._id} />
                <button onClick={() => setSelectedUser(null)}>Cancel</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
