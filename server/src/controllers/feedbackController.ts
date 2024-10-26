import { Response } from "express";
import Feedback from "../models/Feedback";
import User from "../models/User";

// Send feedback
const sendFeedbackController = async (req: any, res: Response) => {
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
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    return;
  }
};

// Receive feedback
const receiveFeedbackController = async (req: any, res: Response) => {
  try {
    const feedback = await Feedback.find({ receiver: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(feedback);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    return;
  }
};

export { sendFeedbackController, receiveFeedbackController };
