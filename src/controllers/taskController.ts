// src/controllers/taskController.ts
import { Request, Response, NextFunction } from 'express';
import Task from '../models/taskModel';
import { Roles } from '../constants/roleConstants';
import { IUser } from '../models/userModel';

// Create a new task
export const createTask = async (req: Request & { user?: IUser }, res: Response, next: NextFunction): Promise<void> => {
    const { title, description, assignedTo, status, dueDate } = req.body;
  
  // Check if the user has a valid role to create a task (only Admin/Manager can create tasks)
  if (![Roles.ADMIN, Roles.MANAGER].includes(req.user?.role ?? '')) {
    res.status(403).json({ msg: 'Only Admin and Manager can create tasks' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      assignedTo,
      status,
      dueDate,
    });

    await newTask.save();

    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }

};

// Update task status
export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId, status } = req.body;

  if (![Roles.ADMIN, Roles.MANAGER].includes(req.user?.role?.toString()!)) {
    return res.status(403).json({ msg: 'Only Admin and Manager can update task status' });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: 'Task status updated', task });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.id;

  if (![Roles.ADMIN, Roles.MANAGER].includes(req.user?.role?.toString()!)) {
    return res.status(403).json({ msg: 'Only Admin and Manager can delete tasks' });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    await Task.findOneAndDelete({ _id: taskId });

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
