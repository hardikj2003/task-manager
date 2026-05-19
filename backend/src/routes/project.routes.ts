import { Router } from 'express';
import { createProject, getProjects } from '../controllers/project.controller';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProjectSchema } from '../validations/project.validation';

const router = Router();

router.use(protect);

router.post('/', restrictTo('ADMIN'), validate(createProjectSchema), createProject);
router.get('/', getProjects);

export default router;