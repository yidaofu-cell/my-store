'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingForm, ShippingData } from '@/components/checkout/ShippingForm';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import { TrustBadges } from '@/components/checkout/TrustBadges';
import { product, discount } from '@/data/product';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quantity = Math.max(1, parseInt(searchParams.get('qty') || '1', 10));

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  const [shippingData, setShippingData] = useState<ShippingData>({
    name: '', email: '', phone: '', country: '', address: '', city: '', state: '', zipCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const shipping = product.shipping[shippingMethod];
  const subtotal = product.price * quantity;
  const discountAmount = appliedDiscount === discount.code ? subtotal * (discount.percentage / 100) : 0;
  const shippingFee = subtotal - discountAmount >= 50 ? 0 : shipping.price;
  const total = subtotal - discountAmount + shippingFee;

  function validateShipping(): boolean {
    const newErrors: Partial<Record<keyof ShippingData, string>> = {};
    if (!shippingData.name.trim()) newErrors.name = 'Name is required';
    if (!shippingData.email.trim() || !shippingData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!shippingData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingData.country) newErrors.country = 'Country is required';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setFormValid(valid);
    return valid;
  }

  useEffect(() => {
    if (Object.values(shippingData).some((v) => v)) {
      validateShipping();
    }
  }, [shippingData]);

  // Create PaymentIntent
  const fetchPaymentIntent = useCallback(async () => {
    if (!formValid) return;
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          orderData: {
            customerName: shippingData.name,
            email: shippingData.email,
            phone: shippingData.phone,
            country: shippingData.country,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            zipCode: shippingData.zipCode,
            productName: product.name,
            quantity,
            unitPrice: product.price,
            subtotal,
            shippingMethod: shipping.name,
            shippingFee,
            discountCode: appliedDiscount,
            discountAmount,
            totalAmount: total,
            currency: 'USD',
          },
        }),
      });

      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        console.error('No client secret returned:', data);
      }
    } catch (err) {
      console.error('Failed to create payment intent:', err);
    }
  }, [formValid, total, shippingData, quantity, subtotal, shipping.name, shippingFee, appliedDiscount, discountAmount]);

  useEffect(() => {
    if (formValid) {
      fetchPaymentIntent();
    }
  }, [formValid, fetchPaymentIntent]);

  function applyDiscount() {
    if (discountInput.toUpperCase() === discount.code) {
      setAppliedDiscount(discount.code);
      setDiscountError('');
    } else {
      setAppliedDiscount(null);
      setDiscountError('Invalid discount code');
    }
  }

  function handlePaymentSuccess(paymentIntentId: string) {
    router.push(`/thank-you?pi=${paymentIntentId}`);
  }

  function handlePaymentError(error: string) {
    console.error('Payment error:', error);
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5',
      borderRadius: '12px',
      colorBackground: '#ffffff',
      colorText: '#1a1a2e',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your order securely</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Forms */}
          <div className="lg:col-span-3 space-y-6">
            <ShippingForm data={shippingData} onChange={setShippingData} errors={errors} />

            {/* Shipping Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Method</h2>
              <div className="space-y-3">
                {(['standard', 'express'] as const).map((method) => {
                  const s = product.shipping[method];
                  const isFree = subtotal - discountAmount >= 50 && method === 'standard';
                  return (
                    <label
                      key={method}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        shippingMethod === method
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={method}
                          checked={shippingMethod === method}
                          onChange={() => setShippingMethod(method)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{s.name}</p>
                          <p className="text-sm text-gray-500">{s.days}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {isFree ? 'FREE' : `$${s.price.toFixed(2)}`}
                      </span>
                    </label>
                  );
                })}
              </div>
              {subtotal - discountAmount >= 50 && (
                <p className="text-green-600 text-sm mt-3">
                  🎉 Your order qualifies for free standard shipping!
                </p>
              )}
            </div>

            {/* Discount Code */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Discount Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter discount code"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  onClick={applyDiscount}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
              {appliedDiscount && (
                <p className="text-green-600 text-sm mt-2">
                  ✅ Code &quot;{appliedDiscount}&quot; applied — {discount.percentage}% OFF!
                </p>
              )}
            </div>

            {/* Payment (only shown when shipping is valid) */}
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <StripePaymentForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  totalAmount={total}
                  disabled={!formValid}
                />
              </Elements>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="lg:sticky lg:top-32 space-y-6">
              <OrderSummary
                quantity={quantity}
                shippingFee={shippingFee}
                shippingName={shipping.name}
                discountCode={appliedDiscount}
              />
              <TrustBadges />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
