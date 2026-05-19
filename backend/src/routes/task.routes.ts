import { Router } from "express";
import {
  createTask,
  updateTaskStatus,
  getDashboardStats,
  getTasks,
} from "../controllers/task.controller";
import { protect, restrictTo } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createTaskSchema,
  updateTaskStatusSchema,
} from "../validations/task.validation";

const router = Router();

router.use(protect);

router.get("/dashboard/stats", getDashboardStats);
router.post("/", restrictTo("ADMIN"), validate(createTaskSchema), createTask);
router.patch("/:id/status", validate(updateTaskStatusSchema), updateTaskStatus);
router.get('/', getTasks);

export default router;
