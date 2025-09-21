import { Router } from 'express';
import { login, createInitialAdmin } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/create-admin', createInitialAdmin); // Remove in production

export default router;