import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import User from '../models/User.js';
import Session from '../models/Session.js';

const accessTokenTTL = 15 * 60;
const refreshTokenTTL = 30 * 24 * 60 * 60;

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = createdUser.toObject();
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createError(401, 'Invalid email or password');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: accessTokenTTL,
  });

  const refreshToken = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: refreshTokenTTL,
  });

  const accessTokenValidUntil = new Date(Date.now() + accessTokenTTL * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenTTL * 1000);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refresh = async (refreshTokenFromCookie) => {
  const session = await Session.findOne({
    refreshToken: refreshTokenFromCookie,
  });

  if (!session) {
    throw createError(401, 'Invalid refresh token');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw createError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const userId = session.userId;

  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: accessTokenTTL,
  });

  const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: refreshTokenTTL,
  });

  const accessTokenValidUntil = new Date(Date.now() + accessTokenTTL * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenTTL * 1000);

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const logout = async (refreshToken) => {
  const result = await Session.findOneAndDelete({ refreshToken });
  if (!result) {
    throw createError(401, 'Invalid refresh token');
  }
};
