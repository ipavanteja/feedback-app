import express from "express";
import { auth } from "../middleware/authMiddleware";
import getAllUsers from "../controllers/usersController";

const router = express.Router();

// Get all users
router.get("/", auth, getAllUsers);

export default router;
