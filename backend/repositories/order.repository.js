import Order from "../models/order.model.js";

export const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return order.save();
};

export const findById = async (id) => {
  return Order.findById(id);
};

export const findByStripeSessionId = async (sessionId) => {
  return Order.findOne({ stripeSessionId: sessionId });
};

export const markEmailSent = async (orderId) => {
  return Order.findByIdAndUpdate(orderId, { emailSent: true }, { new: true });
};
