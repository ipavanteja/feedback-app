import express from "express";
import { auth } from "../middleware/auth";
import Feedback from "../models/Feedback";
import User from "../models/User";

const router = express.Router();

router.post("/", auth, async (req: any, res) => {
  const { receiverId, content } = req.body;

  try {
    if (req.user.id === receiverId) {
      res.status(400).json({ msg: "Cannot give feedback to yourself" });
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ msg: "Receiver not found" });
      return;
    }

    const newFeedback = new Feedback({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    await newFeedback.save();

    res.json(newFeedback);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/received", auth, async (req: any, res) => {
  try {
    const feedback = await Feedback.find({ receiver: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
