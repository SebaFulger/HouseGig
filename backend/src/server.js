import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Import upload middleware for multipart handling
import upload from './utils/fileUpload.js';
import * as listingController from './controllers/listingController.js';
import * as userController from './controllers/userController.js';
import { authenticate } from './middleware/authMiddleware.js';

// File upload routes MUST come before body parsers
app.post('/api/listings/upload-image', authenticate, upload.single('image'), listingController.uploadImage);
app.post('/api/users/upload-profile-picture', authenticate, upload.single('image'), userController.uploadProfilePicture);

// Body parsers - applied after file upload route
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
