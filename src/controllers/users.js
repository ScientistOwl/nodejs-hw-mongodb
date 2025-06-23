import User from '../models/User.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 200,
    message: 'Authorized user data returned successfully!',
    data: {
      id: user._id,
      email: user.email,
    },
  });
};

export default {
  getCurrentUser: ctrlWrapper(getCurrentUser),
};
