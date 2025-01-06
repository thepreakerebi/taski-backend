import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { validationResult } from 'express-validator'; // Optional: Use validation middleware if needed

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: 'Please provide all required fields: firstName, lastName, email, password, and confirmPassword' });
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  // Password validation regex: at least one special character, letter, number, and capital letter
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  
  // Validate password format
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ msg: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.' });
  }

  // Validate request data (you can also use express-validator for input validation)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();

    // Return response
    res.status(201).json({
      message: 'Account created',
      user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Login user and get JWT token
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong email or password' });
    }

    // Create and sign JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '12h' });

    // Return token
    res.json({ token, message: "You've are in, welcome back" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

