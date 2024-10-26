import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User, { IUser } from "../models/User";

// Register
const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, username, password } = req.body;

  try {
    if (!username || !password) {
      res.status(400).json({ msg: "Please enter all fields" });
      return;
    }

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ msg: "User already exists" });
      return;
    }

    user = await User.findOne({ username });
    if (user) {
      res.status(400).json({ msg: "User already exists" });
      return;
    }

    user = new User({ email, username, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 3600,
    });

    res.json({ token });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    return;
  }
};

// Login
const loginController = async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    return;
  }
};

// Request password reset
const requestPasswordResetController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return the token
    res.json({ msg: "Password reset token generated", resetToken });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    return;
  }
};

// Reset password
const resetPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { resetToken, newPassword } = req.body;

  try {
    const user: IUser | null = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ msg: "Invalid or expired reset token" });
      return;
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password has been reset" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    return;
  }
};

// User authentication
const userAuthController = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    return;
  }
};

export {
  registerController,
  loginController,
  requestPasswordResetController,
  resetPasswordController,
  userAuthController,
};
