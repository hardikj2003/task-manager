import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../config/db";

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, dueDate, projectId, assigneeId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        projectId,
        assigneeId: assigneeId || null,
      },
    });

    res.status(201).json({ status: "success", data: task });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task." });
  }
};

export const updateTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    // Authorization Check: Must be Admin OR the assigned worker
    if (userRole !== "ADMIN" && task.assigneeId !== userId) {
      res
        .status(403)
        .json({ message: "You are not permitted to alter this task status." });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ status: "success", data: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task status." });
  }
};


export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Base filter depending on roles
    const baseWhere = userRole === "ADMIN" ? {} : { assigneeId: userId };

    const tasks = await prisma.task.findMany({ where: baseWhere });

    const totalTasks = tasks.length;
    const todoCount = tasks.filter((t) => t.status === "TODO").length;
    const inProgressCount = tasks.filter(
      (t) => t.status === "IN_PROGRESS",
    ).length;
    const doneCount = tasks.filter((t) => t.status === "DONE").length;

    const now = new Date();
    const overdueCount = tasks.filter(
      (t) => t.status !== "DONE" && new Date(t.dueDate) < now,
    ).length;

    res.status(200).json({
      status: "success",
      metrics: {
        totalTasks,
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
        overdue: overdueCount,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to aggregate dashboard analytics." });
  }
};


export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    let tasks;

    if (userRole === 'ADMIN') {
      tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: { assigneeId: userId },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve task matrix.' });
  }
};
