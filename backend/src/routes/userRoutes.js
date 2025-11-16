import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', verifyToken, userController.getMe);
router.get('/:username', userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.delete('/account', verifyToken, userController.deleteAccount);

export default router;
