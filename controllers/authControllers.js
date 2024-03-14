import * as authServices from "../services/authServices.js";
import { findUser, updateUser, updateWater } from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

const avatarDir = path.resolve("public", "avatars");

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  // const verificationToken = nanoid();

  // const avatarURL = gravatar.url(email, {
  //   protocol: "https",
  //   s: "250",
  //   r: "g",
  //   d: "robohash",
  // });

  const newUser = await authServices.signup({
    ...req.body,
    // avatarURL,
    // verificationToken,
  });

  // const verifyEmail = {
  //   to: email,
  //   subject: "Verify email",
  //   html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">CLick to verify email</a>`,
  // };

  // await sendEmail(verifyEmail);

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await authServices.setToken(newUser._id, token);

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      //water_rate: newUser.water_rate,
      // avatarURL: newUser.avatarURL,
    },
  });
};

// const verify = async (req, res) => {
//   const { verificationToken } = req.params;
//   const user = await findUser({ verificationToken });

//   if (!user) {
//     throw HttpError(404, "User not found");
//   }

//   await updateUser({ _id: user._id }, { verify: true, verificationToken: "" });

//   res.json({ message: "Verification successful" });
// };

// const resendVerifyEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await findUser({ email });

//   if (!user) {
//     throw HttpError(404, "User not found");
//   }
//   if (user.verify) {
//     throw HttpError(400, "Verification has already been passed");
//   }

//   const verifyEmail = {
//     to: email,
//     subject: "Verify email",
//     html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">CLick to verify email</a>`,
//   };

//   await sendEmail(verifyEmail);

//   res.json({ message: "Verification email sent" });
// };

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await authServices.setToken(user._id, token);

  res.json({
    token,
    user: { email },
  });
};

const getCurrent = (req, res) => {
  const { email } = req.user;

  res.json({ email });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id);

  res.status(204).json({
    message: "You are logged out",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  await Jimp.read(oldPath)
    .then((name) => {
      return name.resize(250, 250).write(oldPath);
    })
    .catch((err) => {
      console.error(err);
    });

  const newPath = path.join(avatarDir, filename);
  await fs.rename(oldPath, newPath);

  await authServices.setAvatar(_id, newPath);

  res.json({ avatarURL: newPath });
};

const updateWaterRate = async (req, res) => {
  const { _id } = req.user;
  const result = await updateWater(_id, req.body);
  res.json(result)
}

export default {
  register: ctrlWrapper(register),
  // verify: ctrlWrapper(verify),
  // resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateWaterRate: ctrlWrapper(updateWaterRate)
};
