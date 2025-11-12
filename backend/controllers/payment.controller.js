import { paymentService } from "../bootstrap.js";

export const createCheckoutSession = async (req, res) => {
  try {
	const { products } = req.body;

	console.log("createCheckoutSession called for user", req.user && req.user._id);
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
		console.log("checkoutSuccess called with sessionId", sessionId);
		// respond immediately to avoid blocking the frontend (fire-and-forget)
		res.status(202).json({ success: true, message: "Processing checkout; confirmation will be sent shortly." });

		// process in background, log any errors
		(async () => {
			try {
				const order = await paymentService.handleCheckoutSuccess(sessionId);
				console.log("checkoutSuccess background processed order", order && order._id);
			} catch (err) {
				console.error("Error in background processing of checkoutSuccess:", err && err.message ? err.message : err);
			}
		})();
  } catch (error) {
	console.error("Error processing successful checkout:", error);
	res.status(error.status || 500).json({ message: error.message });
  }
};



