import { Router } from 'express';
import { loginHandler, getMeHandler } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authRateLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { loginSchema } from './auth.validation.js';

const router = Router();

router.post('/login', authRateLimiter, validate(loginSchema), loginHandler);
router.get('/me', verifyToken, getMeHandler);

export default router;
