import { Router } from 'express';
import { login, register, createInitialAdmin } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/create-admin', createInitialAdmin); // Remove in production

export default router;