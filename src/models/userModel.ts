import mongoose, { Document, Schema } from 'mongoose';
import { Roles } from '../constants/roleConstants'; // Import roles

// Define User interface to use with TypeScript
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; // Role field can be 'Admin', 'Manager', 'User'
}

// Define User Schema
const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [Roles.ADMIN, Roles.MANAGER, Roles.USER], // Restrict roles
    default: Roles.USER, // Default role
  },
},
{
  timestamps: true,
}
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;