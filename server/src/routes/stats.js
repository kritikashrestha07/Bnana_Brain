import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, gameController.getMyStats);

export default router;

