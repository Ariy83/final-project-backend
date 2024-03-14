import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const findUserById = (id) => User.findById(id);

export const updateUser = (id, data) => User.findByIdAndUpdate(id, data);

export const updateWater = (id, data) => User.findByIdAndUpdate(id, data)
