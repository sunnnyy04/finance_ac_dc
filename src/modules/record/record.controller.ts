import { Request, Response, NextFunction } from "express";
import { RecordService } from "./record.service.js";

export class RecordController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await RecordService.create(req.user!.id, req.body);
      res.status(201).json({ status: "success", data: record });
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const allRecords = await RecordService.findAll(req.user!.id, req.user!.role);
      res.status(200).json({ status: "success", data: allRecords });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await RecordService.findById(Number(req.params.id), req.user!.id, req.user!.role);
      res.status(200).json({ status: "success", data: record });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await RecordService.update(Number(req.params.id), req.user!.id, req.user!.role, req.body);
      res.status(200).json({ status: "success", data: record });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await RecordService.delete(Number(req.params.id), req.user!.id, req.user!.role);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
