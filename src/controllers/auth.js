import { register, login, refresh, logout } from '../services/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendEmail from '../utils/emailSender.js';

const registerUser = async (req, res) => {
  const newUser = await register(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
};

const loginUser = async (req, res) => {
  const { accessToken, refreshToken } = await login(req.body);
  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2592000000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
};

const refreshSession = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Missing refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refresh(refreshToken);

  res
    .cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2592000000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
};

const logoutUser = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Missing refresh token');
  }

  await logout(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.status(204).send();
};

const sendResetEmail = async (req, res) => {
  let { email } = req.body;
  email = email.trim().toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
  const html = `<p>To reset your password, click the link below:</p><a href="${resetLink}">${resetLink}</a>`;

  try {
    await sendEmail(email, 'Reset your password', html);
  } catch {
    throw createError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

const resetPwd = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Token and password are required.',
      data: {},
    });
  }

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.token = null;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      return res.status(401).json({
        status: 401,
        message: 'Token is expired or invalid.',
        data: {},
      });
    }

    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
      data: {},
    });
  }
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  refreshSession: ctrlWrapper(refreshSession),
  logoutUser: ctrlWrapper(logoutUser),
  sendResetEmail: ctrlWrapper(sendResetEmail),
  resetPwd: ctrlWrapper(resetPwd),
};
