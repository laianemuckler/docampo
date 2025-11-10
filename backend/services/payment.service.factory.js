export function createPaymentService({ stripeClient, orderRepo }) {
  const createCheckoutSession = async (userId, products, clientUrl) => {
    if (!Array.isArray(products) || products.length === 0) {
      const err = new Error("Invalid or empty products array");
      err.status = 400;
      throw err;
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${clientUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/purchase-cancel`,
      metadata: {
        userId: userId.toString(),
        products: JSON.stringify(products.map((p) => ({ id: p._id, quantity: p.quantity, price: p.price }))),
      },
    });

    return { id: session.id, totalAmount: totalAmount / 100 };
  };

  const handleCheckoutSuccess = async (sessionId) => {
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const products = JSON.parse(session.metadata.products);
      const newOrder = await orderRepo.createOrder({
        user: session.metadata.userId,
        products: products.map((product) => ({ product: product.id, quantity: product.quantity, price: product.price })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      return newOrder;
    }

    const err = new Error("Payment not completed");
    err.status = 400;
    throw err;
  };

  return { createCheckoutSession, handleCheckoutSuccess };
}
