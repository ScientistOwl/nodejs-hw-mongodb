import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import createHttpError from 'http-errors';

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
      throw createHttpError(404, 'User not found!');
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

export default resetPwd;
