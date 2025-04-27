import HttpError from '../helpers/HttpError.js';
import * as authServices from '../services/authServices.js';

const register = async (req, res) => {
  const existingUser = await authServices.findUser({ email: req.body.email });

  if (existingUser) {
    return res.status(409).json({
      message: 'Email in use',
    });
  }

  const { email, subscription } = await authServices.registerUser(req.body);

  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

const login = async (req, res) => {
  try {
    const { token, user } = await authServices.loginUser(req.body);
    return res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  const { id } = req.user;
  try {
    await authServices.logoutUser(id);
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }
  res.status(204).send();
};

const getCurrentController = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

export default {
  register,
  login,
  logout,
  current: getCurrentController,
};