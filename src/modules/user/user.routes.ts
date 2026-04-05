import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.use(requireRoles(["ADMIN"]));

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.findAll();
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/role", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const user = await UserService.updateRole(Number(req.params.id), role);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const user = await UserService.updateStatus(Number(req.params.id), status);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
