import * as userRepo from "./repositories/user.repository.js";
import * as tokenRepo from "./repositories/token.repository.js";
import { createAuthService } from "./services/auth.service.factory.js";
import * as productRepo from "./repositories/product.repository.js";
import * as cloudinaryClient from "./lib/cloudinary.client.js";
import { createProductService } from "./services/product.service.factory.js";
import * as orderRepo from "./repositories/order.repository.js";
import { createPaymentService } from "./services/payment.service.factory.js";
import { stripe } from "./lib/stripe.js";
import { createCartService } from "./services/cart.service.factory.js";

export const authService = createAuthService({ userRepo, tokenRepo });

export const productService = createProductService({ productRepo, storageClient: cloudinaryClient });

export const paymentService = createPaymentService({ stripeClient: stripe, orderRepo });

export const cartService = createCartService({});

// future: export other services constructed here
