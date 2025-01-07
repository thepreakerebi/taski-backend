// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
    return next(); // Continue the middleware chain
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as { userId: string }; // Type the decoded token
    const user = await User.findById(decoded.userId); // Find user based on decoded token

    if (!user) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
