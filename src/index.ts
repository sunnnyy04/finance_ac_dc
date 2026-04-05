import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./configs/env.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import recordRoutes from "./modules/record/record.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Finance API Working2" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler as any);

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});
