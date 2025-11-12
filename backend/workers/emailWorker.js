import dotenv from "dotenv";
dotenv.config();

import { emailQueue } from "../lib/queue.js";
import { sendOrderConfirmation } from "../lib/mailer.js";
import * as orderRepo from "../repositories/order.repository.js";

console.log("Email worker started, waiting for jobs...");

emailQueue.process("order-confirmation", async (job) => {
  const { orderId, email, name, items, total } = job.data;
  console.log("Worker picked job", job.id, "for order", orderId, "to", email);
  try {
    await sendOrderConfirmation(email, { orderId, items, total, name });
    await orderRepo.markEmailSent(orderId);
    console.log(`Email sent for order ${orderId} to ${email}`);
    return Promise.resolve();
  } catch (err) {
    console.error("Failed to process email job", err.message || err);
    throw err; // allow bull to handle retries
  }
});
