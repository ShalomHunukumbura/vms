import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadImages,
} from '../controllers/vehicleController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { upload } from '../services/fileService';

const router = Router();

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, upload.array('images', 5), createVehicle);
router.put('/:id', authenticateToken, requireAdmin, upload.array('images', 5), updateVehicle);
router.delete('/:id', authenticateToken, requireAdmin, deleteVehicle);
router.post('/upload', authenticateToken, requireAdmin, upload.array('images', 5), uploadImages);

export default router;