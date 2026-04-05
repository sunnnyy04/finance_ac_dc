import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.login(req.body);
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
