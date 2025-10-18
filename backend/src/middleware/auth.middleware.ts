import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

// ✅ Verify Token Middleware
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Authorization header missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token missing" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // attach decoded token data to request

    console.log("req.user", decoded);
    next(); // ✅ continue to next middleware
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Verify Doctor Middleware
export const verifyDoctor = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // First verify token properly
  verifyToken(req, res, () => {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (req.user.role !== "doctor") {
      res.status(403).json({ message: "Access denied: Doctors only" });
      return;
    }

    next(); // ✅ proceed to route if doctor
  });
};
