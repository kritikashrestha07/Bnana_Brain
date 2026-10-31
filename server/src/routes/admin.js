import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate, adminUpdateUserSchema } from '../validators/index.js';

const router = Router();

// All admin routes enforce server-side admin check
router.use(requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', validate(adminUpdateUserSchema), adminController.updateUserStatus);
router.get('/games', adminController.getGames);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;

