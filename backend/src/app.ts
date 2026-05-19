import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes Mounting Layer
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// App global health monitor
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "OK", message: "System is healthy and operational" });
});

const PORT = process.env.PORT || 8080;
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Production API server successfully listening on port ${PORT}`);
});

export default app;
