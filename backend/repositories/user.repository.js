import User from "../models/user.model.js";

export const findByEmail = async (email) => {
  return User.findOne({ email });
};

export const createUser = async (userData) => {
  return User.create(userData);
};

export const findById = async (id) => {
  return User.findById(id);
};
