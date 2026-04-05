const nodemailer = require('nodemailer');

function getTransporter() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Email not configured: set EMAIL_USER and EMAIL_PASS in .env');
    return { sent: false, reason: 'Email not configured' };
  }

  const from = process.env.FROM_EMAIL || process.env.EMAIL_USER;
  const fromName = process.env.FROM_NAME || 'EaseCart';

  try {
    await transporter.sendMail({
      from: fromName ? `"${fromName}" <${from}>` : from,
      to,
      subject,
      html: html || text,
      text: text || html?.replace(/<[^>]*>/g, '') || ''
    });
    return { sent: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { sent: false, reason: err.message };
  }
}

async function sendOrderConfirmation(order, userEmail, userName) {
  const itemsList = order.items
    .map((i) => `  - ${i.name} x${i.quantity} @ $${i.price.toFixed(2)} = $${(i.price * i.quantity).toFixed(2)}`)
    .join('\n');

  const html = `
    <h2>Order Confirmed</h2>
    <p>Hi ${userName || 'Customer'},</p>
    <p>Thank you for your order! Here are the details:</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Items:</strong></p>
    <pre>${itemsList}</pre>
    <p><strong>Subtotal:</strong> $${(order.totalPrice - (order.taxPrice || 0) - (order.shippingPrice || 0)).toFixed(2)}</p>
    <p><strong>Tax:</strong> $${(order.taxPrice || 0).toFixed(2)}</p>
    <p><strong>Shipping:</strong> $${(order.shippingPrice || 0).toFixed(2)}</p>
    <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Shipping to:</strong> ${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}, ${order.shippingAddress?.country}</p>
    <p>We'll notify you when your order ships.</p>
    <p>— EaseCart</p>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Order Confirmed #${order._id.toString().slice(-8)}`,
    html
  });
}

async function sendContactNotification(contact) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return { sent: false, reason: 'No admin email' };

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${contact.name} &lt;${contact.email}&gt;</p>
    <p><strong>Subject:</strong> ${contact.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${(contact.message || '').replace(/\n/g, '<br>')}</p>
    <p><em>Submitted at ${new Date(contact.createdAt).toISOString()}</em></p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Contact: ${contact.subject}`,
    html
  });
}

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendContactNotification
};
