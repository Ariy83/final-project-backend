import Joi from "joi";
import { emailRegexp } from "../constants/regexp.js";

const signupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const waterRateChangeSchema = Joi.object({
  waterRate: Joi.number().required(),
});

const verifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export default {
  signupSchema,
  waterRateChangeSchema,
  verifySchema,
  forgotPassword,
};
