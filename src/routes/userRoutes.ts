import { Router, Request, Response } from 'express';
import { registerUser, loginUser } from '../controllers/userController';

// Initialize router
const router = Router();

// User registration route
router.post('/register', async (req: Request, res: Response) => {
  try {
	const result = await registerUser(req, res);
	res.json(result);
  } catch (error) {
	res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login route
router.post('/login', async (req: Request, res: Response) => {
  try {
	const result = await loginUser(req, res);
	res.json(result);
  } catch (error) {
	res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
