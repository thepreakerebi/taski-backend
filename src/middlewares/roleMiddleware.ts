// src/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';

// Middleware to check if the user has the required role
export const authorizeRole = (role: string) => {
  return async (req: Request & { user?: IUser }, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id; // Assuming `userId` is attached to the request by authentication middleware
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }

      if (user && user.role !== role) {
        res.status(403).json({ message: 'Access denied: You do not have permission' });
      }

      next(); // User has the required role
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
};