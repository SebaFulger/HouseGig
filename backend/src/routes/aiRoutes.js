import express from 'express';
import rateLimit from 'express-rate-limit';
import * as aiController from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiter for AI endpoints - 30 requests per hour per user
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 requests per hour
  message: {
    error: 'Too many AI requests. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // Use user ID as key if authenticated, otherwise IP
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  // Skip rate limiting if RATE_LIMIT_SKIP is set (for development)
  skip: (req) => {
    return process.env.RATE_LIMIT_SKIP === 'true';
  }
});

// AI chat endpoint - requires authentication and rate limiting
router.post('/chat', authenticate, aiRateLimiter, aiController.chat);

// Health check endpoint - no auth required
router.get('/health', aiController.healthCheck);

export default router;
