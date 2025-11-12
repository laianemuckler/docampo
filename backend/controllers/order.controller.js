import * as orderRepo from "../repositories/order.repository.js";

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await orderRepo.findByUser(userId);
    res.json({ orders });
  } catch (err) {
    console.error("getMyOrders error", err && err.message);
    res.status(500).json({ message: "Server error", error: err && err.message });
  }
};
