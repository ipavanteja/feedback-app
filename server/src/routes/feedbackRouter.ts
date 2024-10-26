import express from "express";
import { auth } from "../middleware/authMiddleware";
import {
  sendFeedbackController,
  receiveFeedbackController,
} from "../controllers/feedbackController";

const router = express.Router();

// Send feedback
router.post("/", auth, sendFeedbackController);

// Receive feedback
router.get("/received", auth, receiveFeedbackController);

export default router;
