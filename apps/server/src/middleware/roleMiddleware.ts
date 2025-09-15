import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js"; // where your AuthRequest is defined
import dotenv from 'dotenv';
dotenv.config();

// role-based guard
export function authorize(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }

    next();
  };
}
