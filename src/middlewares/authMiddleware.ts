import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom property 'user' on the Request type
interface CustomRequest extends Request {
  user: any;
}

// Auth middleware to check if the user is authenticated
export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
