import * as userService from '../services/userService.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await userService.getUserProfileService(username);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfileService(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserByIdService(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    console.log('Received profile picture:', req.file);
    const imageUrl = await userService.uploadProfilePictureService(req.user.id, req.file);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const result = await userService.deleteUserAccountService(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
