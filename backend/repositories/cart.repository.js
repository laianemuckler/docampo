import User from "../models/user.model.js";

export const getCartByUserId = async (userId) => {
  return User.findById(userId).populate("cartItems.product");
};

export const saveUser = async (user) => {
  return user.save();
};

export const findUserById = async (userId) => {
  return User.findById(userId);
};
