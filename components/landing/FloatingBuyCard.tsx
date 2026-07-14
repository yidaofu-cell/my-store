'use client';
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { product as defaultProduct, discount as defaultDiscount } from '@/data/product';
import { ShieldCheck, Truck, Minus, Plus } from 'lucide-react';

export function FloatingBuyCard({ product: dbProduct }: { product?: any }) {
  const p = dbProduct || defaultProduct;
  const d = defaultDiscount;
  const [quantity, setQuantity] = useState(1);
  const subtotal = p.price * quantity;
  const discounted = subtotal * (1 - d.percentage / 100);

  return (
    <div className="hidden lg:block fixed right-4 top-32 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 z-40">
      {/* Product Image */}
      <div className="bg-gradient-to-br from-indigo-100 to-blue-200 rounded-xl aspect-video flex items-center justify-center mb-4">
        <span className="text-5xl">❄️</span>
      </div>

      <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl font-extrabold text-indigo-600">
          ${p.price?.toFixed(2)}
        </span>
        <span className="text-sm text-gray-400 line-through">
          ${p.compareAtPrice?.toFixed(2)}
        </span>
        <Badge variant="danger">{d.label}</Badge>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between mb-3 py-2 px-3 bg-gray-50 rounded-xl">
        <span className="text-sm text-gray-600">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="font-bold text-gray-900 w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="text-sm text-gray-500 space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Subtotal ({quantity}x)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600 font-semibold">
          <span>Discount ({d.percentage}%)</span>
          <span>-${(subtotal - discounted).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-1 mt-1">
          <span>You Pay</span>
          <span className="text-lg">${discounted.toFixed(2)}</span>
        </div>
      </div>

      {/* CTA */}
      <Button href={`/checkout?qty=${quantity}`} variant="secondary" size="md" className="w-full mb-3">
        🔥 Buy Now — Save {d.percentage}%
      </Button>

      {/* Trust */}
      <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1"><ShieldCheck size={12} /> Guarantee</span>
        <span className="flex items-center gap-1"><Truck size={12} /> Free Ship $50+</span>
      </div>
      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
        <span>🔒 Secured by</span>
        <span className="font-semibold text-gray-500">Stripe</span>
        <span>· 💳 Visa MC Amex</span>
      </div>
    </div>
  );
}
