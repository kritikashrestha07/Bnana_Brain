import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate, registerSchema, loginSchema, changePasswordSchema } from '../validators/index.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/change-password', requireAuth, validate(changePasswordSchema), authController.changePassword);

export default router;

