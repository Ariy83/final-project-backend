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

 
  if(resetToken.token !== token){
    throw HttpError(404, "Reset token in invalid!");
  }
//   const tokenToComp = resetToken.token;
//   console.log(token)
//  const isValidToken = await tokenToComp.compareToken(token)
// console.log(isValidToken)
//  if(!isValidToken){
//   throw HttpError(404, "Token is invalid!");
// }

  req.user = user;
  next()

};

export default isResetTokenValid;