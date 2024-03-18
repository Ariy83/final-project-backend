import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";
import {
  findUser,
  findUserById,
  updateWater,
} from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Jimp from "jimp";
import cloudinary from "../helpers/claudinary.js";
import { unlink } from "fs/promises";
// import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const {
  JWT_SECRET,
  BASE_URL,
  TEMPLATE_ID,
  SENDGRID_FROM,
  TEMPLATE_ID_PASSWORD,
} = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  // const avatarURL = gravatar.url(email, {
  //   protocol: "https",
  //   s: "250",
  //   r: "g",
  //   d: "robohash",
  // });

  const newUser = await authServices.signup({
    ...req.body,
    // avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    from: {
      email: SENDGRID_FROM,
      name: "Water tracker",
    },
    personalizations: [
      {
        to: [{ email: email }],

        dynamic_template_data: {
          email: email,
          BASE_URL: BASE_URL,
          verificationToken: verificationToken,
        },
      },
    ],
    template_id: TEMPLATE_ID,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      // avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await userServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await userServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );

  res.redirect(
    "http://localhost:5173/capybara-components-frontend/signin?message=Verification%20successful"
  );
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    from: {
      email: SENDGRID_FROM,
      name: "Water tracker",
    },
    personalizations: [
      {
        to: [{ email: email }],

        dynamic_template_data: {
          email: email,
          BASE_URL: BASE_URL,
          verificationToken: verificationToken,
        },
      },
    ],
    template_id: TEMPLATE_ID,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong!");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified!");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password is wrong! Try again!");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await authServices.setToken(user._id, token);

  res.json({
    token,
    user: {
      email,
      username: user.username,
      gender: user.gender,
      avatarURL: user.avatarURL,
      waterRate: user.waterRate,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, username, gender, avatarURL, waterRate } = req.user;

  res.json({
    user: {
      email,
      username,
      gender,
      avatarURL,
      waterRate,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id);

  res.status(204).json({
    message: "You are logged out",
  });
};

const updateUser = async (req, res) => {
  const { _id: owner, password, avatarURL } = req.user;
  const { new_password, password: old_password, email } = req.body;
  const changedData = { ...req.body };

  if (old_password && new_password) {
    const user = await findUserById(owner);
    if (!user) {
      throw HttpError(404, "User not found!");
    }

    const passwordCompare = await bcrypt.compare(old_password, password);
    if (!passwordCompare) {
      throw HttpError(401, "Incorrect password!");
    }

    changedData.password = await bcrypt.hash(new_password, 8);
  }

  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email is already used");
  }

  if (req.file) {
    const { path: filePath } = req.file;
    Jimp.read(filePath)
      .then((image) => {
        return image.cover(250, 250).quality(60).write(filePath);
      })
      .catch((err) => {
        console.error(err);
      });

    const { url: photo } = await cloudinary.uploader.upload(filePath, {
      folder: "avatars",
    });

    changedData.avatarURL = photo;
    await unlink(filePath);
  }

  const newUser = await userServices.updateUser(owner, changedData);

  if (req.file && newUser) {
    await cloudinary.uploader.destroy(avatarURL);
  }

  res.status(201).json({
    user: {
      email: newUser.email,
      username: newUser.username,
      gender: newUser.gender,
      avatarURL: newUser.avatarURL,
    },
  });
};

const updateWaterRate = async (req, res) => {
  const { _id } = req.user;
  const result = await updateWater(_id, req.body);
  res.json(result);
};

const forgot_password = async (req, res) => {
  const { email } = req.body;

  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found!");
  } else {
    const verifyEmail = {
      from: {
        email: SENDGRID_FROM,
        name: "Forgot password",
      },
      personalizations: [
        {
          to: [{ email: email }],

          dynamic_template_data: {
            email: email,
            id: user._id.toString(),
            BASE_URL: BASE_URL,
          },
        },
      ],
      template_id: TEMPLATE_ID_PASSWORD,
    };

    await sendEmail(verifyEmail);

    res.json({
      success: true,
      message: "Password reset link is sent to your email!",
    });
  }
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
  updateWaterRate: ctrlWrapper(updateWaterRate),
  forgot_password: ctrlWrapper(forgot_password),
};
