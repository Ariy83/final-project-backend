import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import ResetToken from "../models/ResetToken.js";

const isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;

  if (!token || !id) {
    throw HttpError(404, "Invalid request!");
  }

  if (!isValidObjectId(id)) {
    throw HttpError(404, "Invalid user!");
  }

  const user = await User.findById(id);
  if (!user) {
    throw HttpError(404, "User not found!");
  }

  const resetToken = await ResetToken.findOne({owner: user._id});
  if(!resetToken){
    throw HttpError(404, "Reset token not found!");
  }

  const isValidToken = await resetToken.compare(token)
  if(!isValidToken){
    throw HttpError(404, "Reset token in invalid!");
  }
  
  req.user = user;
};

export default isResetTokenValid;