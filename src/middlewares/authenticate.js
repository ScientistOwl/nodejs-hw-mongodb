import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(createError(401, 'Not authorized'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.sub || decoded.id || decoded._id;
    if (!userId) {
      return next(createError(401, 'Invalid token payload'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createError(401, 'Not authorized'));
    }

    req.user = { id: user._id };
    next();
  } catch {
    next(createError(401, 'Not authorized'));
  }
};

export default authenticate;
