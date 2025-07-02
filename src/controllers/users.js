import User from '../models/User.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import createError from 'http-errors';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs/promises';

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw createError(401, 'User not authorized');
  }

  res.status(200).json({
    status: 200,
    message: 'Authorized user data returned successfully!',
    data: {
      id: user._id,
      email: user.email,
    },
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw createError(400, 'Avatar file is required.');
  }

  const { path: tempPath } = req.file;
  const userId = req.user.id;

  let uploaded;
  try {
    uploaded = await cloudinary.uploader.upload(tempPath, {
      folder: 'avatars',
      public_id: `user-${userId}`,
      overwrite: true,
    });
  } finally {
    await fs.unlink(tempPath);
  }

  if (!uploaded?.secure_url) {
    throw createError(500, 'Failed to upload avatar to Cloudinary');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { avatarURL: uploaded.secure_url },
    { new: true },
  );

  console.log('🔍 Cloudinary URL:', uploaded.secure_url);
  console.log('🧾 Mongo-збережений користувач:', user);

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully.',
    data: {
      avatarURL: user.avatarURL,
    },
  });
};

export default {
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
