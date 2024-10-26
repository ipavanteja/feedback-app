import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (typeof decoded === "object" && decoded.id) {
      req.user = { id: decoded.id as string };
      next();
    } else {
      res.status(401).json({ msg: "Token is not valid" });
      return;
    }
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
    return;
  }
};
