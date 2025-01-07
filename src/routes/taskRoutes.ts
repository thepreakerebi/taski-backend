// src/routes/taskRoutes.ts
import { Router } from 'express';
import { createTask, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { authorizeRole } from '../middlewares/roleMiddleware';
import { Roles } from '../constants/roleConstants';
import { authenticateUser } from '../middlewares/authMiddleware'; // Import the auth middleware

const router = Router();

// Apply authenticateUser middleware
router.post('/create', authenticateUser, authorizeRole(Roles.ADMIN), async (req, res, next) => {
  await createTask(req, res, next);
});
router.patch('/update', authenticateUser, authorizeRole(Roles.MANAGER), async (req, res, next) => {
  await updateTaskStatus(req, res, next);
});
router.delete('/delete/:id', authenticateUser, authorizeRole(Roles.ADMIN), async (req, res, next) => {
  await deleteTask(req, res, next);
});

export default router;
