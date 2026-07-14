'use client';
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';
import { Lock, AlertCircle } from 'lucide-react';

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  totalAmount: number;
  disabled: boolean;
}

export function StripePaymentForm({
  onSuccess,
  onError,
  totalAmount,
  disabled,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setPaymentError(submitError.message ?? 'Payment failed. Please check your card details.');
        onError(submitError.message ?? 'Payment failed');
        setProcessing(false);
        return;
      }

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        setPaymentError(paymentError.message ?? 'Payment failed. Please try again.');
        onError(paymentError.message ?? 'Payment failed');
      }
      // If no error and no redirect, payment succeeded
      // The webhook will handle the order confirmation
    } catch (err: any) {
      setPaymentError(err.message ?? 'An unexpected error occurred.');
      onError(err.message ?? 'An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Payment</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your payment is processed securely by Stripe. We never store your card details.
      </p>

      <form onSubmit={handleSubmit}>
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                // Will be filled from shipping data
              },
            },
          }}
        />

        {paymentError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{paymentError}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-full mt-6"
          disabled={!stripe || processing || disabled}
          icon={<Lock size={18} />}
        >
          {processing ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)}`}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
        <Lock size={12} />
        <span>Secured by Stripe · PCI DSS Compliant</span>
      </div>
      <div className="flex items-center justify-center gap-1 mt-2 text-lg">
        <span className="opacity-50">💳</span>
        <span className="text-xs text-gray-400">Visa · Mastercard · Amex · UnionPay · Discover</span>
      </div>
    </div>
  );
}
