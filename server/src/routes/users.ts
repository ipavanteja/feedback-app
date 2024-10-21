import express from "express";
import { auth } from "../middleware/auth";
import User from "../models/User";

const router = express.Router();

router.get("/", auth, async (req: any, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
