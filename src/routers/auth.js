import express from 'express';
import authController from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPwdSchema,
} from '../schemas/authSchema.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  authController.registerUser,
);

router.post('/login', validateBody(loginSchema), authController.loginUser);
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logoutUser);

router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  authController.sendResetEmail,
);

router.post(
  '/reset-pwd',
  validateBody(resetPwdSchema),
  authController.resetPwd,
);

export default router;
