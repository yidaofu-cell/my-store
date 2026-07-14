import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updatePaymentStatus, getOrderByPaymentIntent } from '@/lib/order-service';
import { sendOrderConfirmationEmail, sendMerchantNotification } from '@/lib/email';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent succeeded:', paymentIntent.id);

      // Update order status
      const order = await getOrderByPaymentIntent(paymentIntent.id);
      if (order) {
        await updatePaymentStatus(order.id, 'paid');

        // Send confirmation emails
        await sendOrderConfirmationEmail({ ...order, paymentStatus: 'paid' });
        await sendMerchantNotification({ ...order, paymentStatus: 'paid' });

        console.log(`Order ${order.orderNumber} marked as paid`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent failed:', paymentIntent.id);

      const order = await getOrderByPaymentIntent(paymentIntent.id);
      if (order) {
        await updatePaymentStatus(order.id, 'failed');
        console.log(`Order ${order.orderNumber} marked as failed`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
