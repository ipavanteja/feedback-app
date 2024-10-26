import express from "express";
import { auth } from "../middleware/authMiddleware";
import {
  registerController,
  loginController,
  requestPasswordResetController,
  resetPasswordController,
  userAuthController,
} from "../controllers/authController";

const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Request password reset
router.post("/forgot-password", requestPasswordResetController);

// Reset password
router.post("/reset-password", resetPasswordController);

// User authentication
router.get("/user", auth, userAuthController);

export default router;
