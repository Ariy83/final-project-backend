import User from "../models/User.js";

const findUser = (filter) => User.findOne(filter);

const findUserById = (id) => User.findById(id);

const updateUser = (id, data) => User.findByIdAndUpdate(id, data);

const updateWater = (id, data) => User.findByIdAndUpdate(id, data);

export default { findUser, findUserById, updateUser, updateWater };
