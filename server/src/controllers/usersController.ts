import { Response } from "express";
import User from "../models/User";

// Get all users
const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export default getAllUsers;
