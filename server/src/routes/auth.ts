import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ username, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 3600,
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 3600,
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/user", auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
