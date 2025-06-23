import express from 'express';
import usersController from '../controllers/users.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/current', authenticate, usersController.getCurrentUser);

export default router;
