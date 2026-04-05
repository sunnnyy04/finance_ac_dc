import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { z } from "zod";

const router = Router();

export const validate = (schema: z.ZodTypeAny) => (req: any, res: any, next: any) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    next(error);
  }
};

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

export default router;
