import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmount } from '@/lib/stripe';
import { createOrder } from '@/lib/order-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'usd', orderData } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmount(amount),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerName: orderData?.customerName || '',
        email: orderData?.email || '',
        productName: orderData?.productName || '',
        quantity: String(orderData?.quantity || 1),
      },
    });

    // Create order in our system (pending status)
    if (orderData) {
      await createOrder({
        ...orderData,
        stripePaymentIntentId: paymentIntent.id,
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
