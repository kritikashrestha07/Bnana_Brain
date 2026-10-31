import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate, startGameSchema, submitAnswerSchema, paginationSchema } from '../validators/index.js';

const router = Router();

// All game routes require authentication
router.use(requireAuth);

router.post('/', validate(startGameSchema), gameController.startGame);
router.get('/history', validate(paginationSchema, 'query'), gameController.getHistory);
router.get('/:id', gameController.getGame);
router.get('/:id/current-question', gameController.getCurrentQuestion);
router.post('/:id/next', gameController.nextQuestion);
router.post('/:id/answers', validate(submitAnswerSchema), gameController.submitAnswer);
router.post('/:id/hints', gameController.useHint);
router.post('/:id/finish', gameController.finishGame);

export default router;

