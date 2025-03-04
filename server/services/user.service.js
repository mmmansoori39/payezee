// Service code
import User from "../models/user.model.js";

export const createUser = async (body) => {
  return User.create(body);
};

export const updateUser = async (user, updateBody) => {
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const getUser = (filter = {}) => {
  return User.findOne(filter);
};

export const getUsers = async () => {
  return User.find();
};
