import * as paymentService from "../services/payment.service.factory.js";

export const createCheckoutSession = async (req, res) => {
  try {
	const { products } = req.body;
	const result = await paymentService.createCheckoutSession(req.user._id, products, process.env.CLIENT_URL);
	res.status(200).json(result);
  } catch (error) {
	console.error("Error processing checkout:", error);
	res.status(error.status || 500).json({ message: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
	const { sessionId } = req.body;
	const order = await paymentService.handleCheckoutSuccess(sessionId);
	res.status(200).json({ success: true, message: "Payment successful, order created.", orderId: order._id });
  } catch (error) {
	console.error("Error processing successful checkout:", error);
	res.status(error.status || 500).json({ message: error.message });
  }
};



