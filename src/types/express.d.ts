import { Request } from 'express';
import { IUser } from '../models/userModel'; // Make sure to import the IUser interface

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user property to the Request interface
    }
  }
}
