import { Router } from "express";
import { generateDescription, regenerateDescription } from "../controllers/aiController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

router.post('/generate-description', authenticateToken, requireAdmin, generateDescription);
router.post('/regenerate-description/:id', authenticateToken, requireAdmin, regenerateDescription);

export default router;