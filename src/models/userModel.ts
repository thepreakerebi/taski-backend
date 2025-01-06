import mongoose, { Document, Schema } from 'mongoose';

// Define User interface to use with TypeScript
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; // We’ll define the role field later
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
    default: 'User', // Default role
  },
},
{
  timestamps: true,
}
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
