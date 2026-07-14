'use client';
import React from 'react';
import { product, discount } from '@/data/product';
import { Badge } from '../ui/Badge';

interface OrderSummaryProps {
  quantity: number;
  shippingFee: number;
  shippingName: string;
  discountCode: string | null;
}

export function OrderSummary({ quantity, shippingFee, shippingName, discountCode }: OrderSummaryProps) {
  const subtotal = product.price * quantity;
  const discountAmount = discountCode === discount.code ? subtotal * (discount.percentage / 100) : 0;
  const total = subtotal - discountAmount + shippingFee;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      {/* Product */}
      <div className="flex gap-4 pb-4 mb-4 border-b border-gray-100">
        <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">❄️</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">Qty: {quantity}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
          <p className="text-xs text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span className="flex items-center gap-1">
              Discount <Badge variant="success">{discount.code}</Badge>
            </span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Shipping ({shippingName})</span>
          <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between font-bold text-gray-900 text-lg pt-3 mt-3 border-t border-gray-200">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Savings */}
      {discountAmount > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-xl text-sm text-green-700 font-semibold text-center">
          🎉 You saved ${discountAmount.toFixed(2)} ({discount.percentage}% OFF)
        </div>
      )}
    </div>
  );
}
