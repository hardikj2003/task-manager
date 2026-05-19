import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';

// Create a new project (Admin Only)
export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description, memberIds } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          connect: memberIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        members: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    res.status(201).json({ status: 'success', data: project });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project.' });
  }
};

// Get all projects (Admins see everything, Members see only assigned projects)
export const getProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    let projects;

    if (userRole === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: {
          members: { select: { id: true, name: true, email: true, role: true } },
          _count: { select: { tasks: true } },
        },
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: { some: { id: userId } },
        },
        include: {
          members: { select: { id: true, name: true, email: true, role: true } },
          _count: { select: { tasks: true } },
        },
      });
    }

    res.status(200).json({ status: 'success', data: projects });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve projects.' });
  }
};