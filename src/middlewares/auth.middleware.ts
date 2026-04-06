import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../configs/env.js";
import { ApiError } from "../utils/ApiError.js";
import "../types/express.d.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number; role: "VIEWER" | "ANALYST" | "ADMIN" };
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export const requireRoles = (roles: Array<"VIEWER" | "ANALYST" | "ADMIN">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: You do not have the required role"));
    }
    next();
  };
};
