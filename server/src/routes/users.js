import { Router } from 'express';
import { profileController } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate, updateProfileSchema } from '../validators/index.js';

const router = Router();

router.get('/me', requireAuth, profileController.getMe);
router.patch('/me', requireAuth, validate(updateProfileSchema), profileController.updateMe);

export default router;

