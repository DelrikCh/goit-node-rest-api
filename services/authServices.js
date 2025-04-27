import bcrypt from 'bcrypt';

import User from '../db/models/users.js';
import HttpError from '../helpers/HttpError.js';
import { generateToken } from "../helpers/jwt.js";
import gravatar from "gravatar";

export const findUser = (query) => User.findOne({ where: query });

export const registerUser = async (data) => {
  const { email, password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: '250', r: 'x', d: 'retro' }, true);
  return User.create({ ...data, password: hashPassword, avatarURL });
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, 'Email or password is wrong');
  }

  console.log("Generating token for user:", user.email);
  const token = generateToken({ id: user.id });
  console.log("Generated token:", token);
  await user.update({ token });
  console.log("User token updated in database");

  return { token, user };
};

export const logoutUser = async (id) => {
  const user = await findUser({ id });
  if (!user) {
    throw HttpError(401, 'Not authorized');
  }

  await user.update({ token: null });
};
