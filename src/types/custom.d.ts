// src/types/custom.d.ts
import { Request } from 'express';
import { IUser } from '../models/userModel'; // Import your IUser type

export interface CustomRequest extends Request {
  user?: IUser;
}
