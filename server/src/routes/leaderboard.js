import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';

const router = Router();

// Public leaderboard (user rank highlighted if logged in)
router.get('/', gameController.getLeaderboard);

export default router;

