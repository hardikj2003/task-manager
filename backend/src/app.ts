import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8080;

// 🔒 CLEAN PRODUCTION CORS IMPLEMENTATION
const allowedOrigins = [
  "http://localhost:3000", 
  "https://mindful-joy-production-de1f.up.railway.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests, or postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(
          new Error(
            "Blocked by security core configuration layer: CORS policy violation.",
          ),
        );
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Express built-in parser middleware MUST come after CORS
app.use(express.json());

// Main Domain Feature Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "OK", message: "System is healthy and operational" });
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 API backend running smoothly on port ${PORT}`);
});

export default app;
