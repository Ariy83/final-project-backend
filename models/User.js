import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../constants/regexp.js";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    match: emailRegexp,
    required: [true, "Email is required"],
    unique: true,
  },
  waterrate: {
    type: Number,
    default: 2000,
    min: 1,
    max: 15000,
  },
  verify: {
    type: Boolean,
    default: true,
    required: false,
  },
  verificationToken: {
    type: String,
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: String,
});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
