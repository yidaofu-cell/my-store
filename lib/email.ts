import { Resend } from 'resend';
import { Order } from './order-service';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'support@yourdomain.com';

export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  if (!resend) {
    console.log('[EMAIL] Resend not configured. Order confirmation email not sent.');
    console.log('[EMAIL] Order details:', JSON.stringify(order, null, 2));
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html: buildOrderEmail(order),
    });
    console.log(`[EMAIL] Order confirmation sent to ${order.email}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send confirmation:', error);
  }
}

export async function sendMerchantNotification(order: Order): Promise<void> {
  if (!resend) {
    console.log('[EMAIL] New order received:', order.orderNumber);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: FROM_EMAIL, // Send to yourself
      subject: `🛒 New Order — ${order.orderNumber} — $${order.totalAmount.toFixed(2)}`,
      html: buildOrderEmail(order),
    });
    console.log(`[EMAIL] Merchant notification sent for ${order.orderNumber}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send notification:', error);
  }
}

function buildOrderEmail(order: Order): string {
  return `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#1a1a2e;">
      <div style="background:#4F46E5;color:#fff;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;font-size:24px;">Order Confirmed!</h1>
        <p style="margin:8px 0 0;opacity:0.9;">Thank you for your purchase</p>
      </div>
      <div style="padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;">
        <p style="font-size:16px;margin:0 0 16px;"><strong>Order #:</strong> ${order.orderNumber}</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr><td style="padding:8px 0;color:#6b7280;">Product</td><td style="text-align:right;">${order.productName} × ${order.quantity}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Subtotal</td><td style="text-align:right;">$${order.subtotal.toFixed(2)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Shipping</td><td style="text-align:right;">$${order.shippingFee.toFixed(2)}</td></tr>
          ${order.discountAmount > 0 ? `<tr><td style="padding:8px 0;color:#059669;">Discount</td><td style="text-align:right;color:#059669;">-$${order.discountAmount.toFixed(2)}</td></tr>` : ''}
          <tr style="border-top:2px solid #e5e7eb;"><td style="padding:12px 0;font-weight:700;">Total</td><td style="text-align:right;font-weight:700;font-size:18px;">$${order.totalAmount.toFixed(2)}</td></tr>
        </table>
        <h3 style="margin:16px 0 8px;">Shipping Address</h3>
        <p style="margin:0;line-height:1.6;">${order.customerName}<br>${order.address}<br>${order.city}, ${order.state} ${order.zipCode}<br>${order.country}</p>
        <p style="margin-top:20px;color:#6b7280;font-size:13px;">If you have any questions, reply to this email or contact our support team.</p>
      </div>
    </div>
  `;
}
