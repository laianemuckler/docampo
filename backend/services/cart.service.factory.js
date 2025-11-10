import * as cartRepo from "../repositories/cart.repository.js";
import * as productRepo from "../repositories/product.repository.js";

export function createCartService({ cartRepository = cartRepo, productRepository = productRepo } = {}) {
  const getCartProducts = async (userId) => {
    const user = await cartRepository.getCartByUserId(userId);
    if (!user) return [];

    const cartItems = user.cartItems.map((item) => ({
      ...item.product.toJSON(),
      quantity: item.quantity,
    }));

    return cartItems;
  };

  const addToCart = async (userId, productId) => {
    const user = await cartRepository.findUserById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }

    const existingItem = user.cartItems.find((item) => item.product.toString() === productId.toString());
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    await cartRepository.saveUser(user);
    return user.cartItems;
  };

  const removeAllFromCart = async (userId, productId) => {
    const user = await cartRepository.findUserById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId.toString());
    }

    await cartRepository.saveUser(user);
    return user.cartItems;
  };

  const updateQuantity = async (userId, productId, quantity) => {
    const user = await cartRepository.findUserById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const existingItem = user.cartItems.find((item) => item.product.toString() === productId.toString());
    if (!existingItem) {
      const err = new Error("Product not in cart");
      err.status = 404;
      throw err;
    }

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId.toString());
    } else {
      existingItem.quantity = quantity;
    }

    await cartRepository.saveUser(user);
    return user.cartItems;
  };

  return { getCartProducts, addToCart, removeAllFromCart, updateQuantity };
}
