import { Router } from "express";
import { RecordController } from "./record.controller.js";
import { createRecordSchema, updateRecordSchema, findAllRecordsQuerySchema } from "./record.validation.js";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware.js";
import { validate } from "../auth/auth.routes.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  requireRoles(["ADMIN", "ANALYST"]),
  validate(createRecordSchema),
  RecordController.create
);

router.get(
  "/",
  requireRoles(["VIEWER", "ANALYST", "ADMIN"]),
  validate(findAllRecordsQuerySchema),
  RecordController.findAll
);

router.get(
  "/:id",
  requireRoles(["VIEWER", "ANALYST", "ADMIN"]),
  RecordController.findById
);

router.patch(
  "/:id",
  requireRoles(["ADMIN"]),
  validate(updateRecordSchema),
  RecordController.update
);

router.delete(
  "/:id",
  requireRoles(["ADMIN"]),
  RecordController.delete
);

export default router;
