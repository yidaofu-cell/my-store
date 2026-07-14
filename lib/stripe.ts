import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.acacia' as any,
  typescript: true,
});

export function formatAmount(amount: number): number {
  return Math.round(amount * 100); // Convert dollars to cents
}
