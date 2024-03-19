import User from "../models/User.js";
import bcrypt from "bcrypt";

const signup = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 8);
  return User.create({ ...data, password: hashPassword });
};

const setToken = (id, token = "") => {
  return User.findByIdAndUpdate(id, { token });
};

export default { signup, setToken };
