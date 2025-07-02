import express from 'express';
import usersController from '../controllers/users.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/current', authenticate, usersController.getCurrentUser);

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  usersController.updateAvatar,
);

export default router;
