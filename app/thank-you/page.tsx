'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';
import { Order } from '@/lib/order-service';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paymentIntentId = searchParams.get('pi');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!paymentIntentId && !orderId) {
      setError('No order information found.');
      setLoading(false);
      return;
    }
    // Poll for order confirmation via the webhook
    // In a real app, you'd check the order status from a database
    const timer = setTimeout(() => {
      // For demo: redirect to article if no order data
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [paymentIntentId, orderId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button href="/article">Return to Store</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm text-center">
          {loading ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
                <Package size={36} className="text-indigo-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                Confirming Your Order...
              </h1>
              <p className="text-gray-500">Please wait while we process your payment.</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Status</span>
                  <Badge variant="success">Paid</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-mono text-xs text-gray-700 truncate max-w-[200px]">
                    {paymentIntentId || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Order Confirmed</p>
                    <p className="text-gray-500 text-xs">A confirmation email will be sent to your inbox shortly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Processing</p>
                    <p className="text-gray-500 text-xs">We&apos;re preparing your order for shipment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Shipping</p>
                    <p className="text-gray-500 text-xs">You&apos;ll receive tracking information via email once shipped.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button href="/article" variant="outline">
                  Continue Shopping
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Mail size={16} />
                  <span>Need help? Contact us at support@airvelar.com</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
