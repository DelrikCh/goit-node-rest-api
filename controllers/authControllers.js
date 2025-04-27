import HttpError from '../helpers/HttpError.js';
import * as authServices from '../services/authServices.js';
import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from 'uuid';
import sendEmail from "../services/mailer.js";

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

  await sendEmail(
    email,
    "Verify your email",
    `Please verify your email by following this link: ${verificationLink}`
  );
}

const register = async (req, res) => {
  const existingUser = await authServices.findUser({ email: req.body.email });

  if (existingUser) {
    return res.status(409).json({
      message: 'Email in use',
    });
  }
  // Create verification token with uuid
  const verificationToken = uuid();

  const { email, subscription } = await authServices.registerUser({
    ...req.body,
    verificationToken,
    verify: false,
  });
  // Send verification email
  sendVerificationEmail(email, verificationToken);

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

const updateAvatar = async (req, res) => {
  const { path: tempPath, originalname } = req.file;
  const { id } = req.user;
  const filename = `${id}-${originalname}`;
  const avatarsDir = path.resolve("public", "avatars");
  const newPath = path.join(avatarsDir, filename);
  await fs.rename(tempPath, newPath);

  const avatarURL = `/avatars/${filename}`;
  req.user.avatarURL = avatarURL;
  await req.user.save();

  res.status(200).json({ avatarURL });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.update({ verify: true, verificationToken: null });
  res.status(200).json({ message: 'Verification successful' });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }

  sendVerificationEmail(email, user.verificationToken);

  res.status(200).json({ message: 'Verification email sent' });
};

export default {
  register,
  login,
  logout,
  current: getCurrentController,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};