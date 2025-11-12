import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.FROM_EMAIL || `no-reply@${process.env.APP_DOMAIN || 'example.com'}`;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: user ? { user, pass } : undefined,
});

export const sendOrderConfirmation = async (to, { orderId, items, total, name }) => {
  console.log("sendOrderConfirmation called for order", orderId, "to", to);
  const html = `
    <h2>Obrigado pela sua compra, ${name}!</h2>
    <p>Pedido <strong>#${orderId}</strong> confirmado.</p>
    <h3>Itens:</h3>
    <ul>
      ${items.map(i => `<li>${i.quantity}x - ${i.product || i.name} — R$${i.price}</li>`).join('')}
    </ul>
    <p>Total: R$${total}</p>
  `;

  const info = await transporter.sendMail({
    from,
    to,
    subject: `Confirmação do pedido #${orderId}`,
    html,
  });

  console.log("sendOrderConfirmation sent for order", orderId, "messageId", info.messageId || info.response);
  return info;
};

export default { sendOrderConfirmation };
