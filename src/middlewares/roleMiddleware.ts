// src/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

// Middleware to check if the user has the required role
export const authorizeRole = (role: string) => {
  return async (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id; // Assuming `userId` is attached to the request by authentication middleware
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role !== role) {
        return res.status(403).json({ message: 'Access denied: You do not have permission' });
      }

      next(); // User has the required role
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
};