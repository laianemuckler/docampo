import { cartService } from "../bootstrap.js";

export const getCartProducts = async (req, res) => {
	try {
		const cartItems = await cartService.getCartProducts(req.user._id);
		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const cart = await cartService.addToCart(req.user._id, productId);
		res.json(cart);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const cart = await cartService.removeAllFromCart(req.user._id, productId);
		res.json(cart);
	} catch (error) {
		console.log("Error in removeAllFromCart controller", error.message);
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const cart = await cartService.updateQuantity(req.user._id, productId, quantity);
		res.json(cart);
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(error.status || 500).json({ message: error.message });
	}
};
