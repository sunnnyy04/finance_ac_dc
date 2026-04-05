import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service.js";

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await DashboardService.getSummary(req.user!.id, req.user!.role);
      res.status(200).json({ status: "success", data: summary });
    } catch (error) {
      next(error);
    }
  }
}
