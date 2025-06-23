import { register, login, refresh, logout } from '../services/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import createError from 'http-errors';

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
      maxAge: 30 * 24 * 60 * 60 * 1000,
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

  const { accessToken, refreshToken: newRefreshToken } = await refresh(
    refreshToken,
  );

  res
    .cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
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

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  refreshSession: ctrlWrapper(refreshSession),
  logoutUser: ctrlWrapper(logoutUser),
};
