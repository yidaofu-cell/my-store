'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Save } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [fulfillment, setFulfillment] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('/admin/api/orders')
      .then((r) => r.json())
      .then((data) => {
        const found = (Array.isArray(data) ? data : []).find((o: any) => o.id === parseInt(id as string));
        if (found) {
          setOrder(found);
          setFulfillment(found.fulfillmentStatus || 'pending');
          setNotes(found.notes || '');
        }
      });
  }, [id]);

  async function handleUpdate() {
    await fetch('/admin/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: parseInt(id as string), fulfillmentStatus: fulfillment, notes }),
    });
    router.refresh();
    alert('Order updated!');
  }

  if (!order) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Order Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Order Status</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Payment</label>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Fulfillment</label>
                <select value={fulfillment} onChange={(e) => setFulfillment(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Internal Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" placeholder="Add notes..." />
            </div>
            <button onClick={handleUpdate} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 text-sm">
              <Save size={16} /> Update Order
            </button>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">📦</span>
              <div className="flex-1">
                <p className="font-medium">{order.productName}</p>
                <p className="text-sm text-gray-500">Qty: {order.quantity} × ${order.unitPrice?.toFixed(2)}</p>
              </div>
              <p className="font-semibold">${order.subtotal?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
            <p className="text-sm text-gray-500">{order.phone}</p>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.country}<br />
              {order.address}<br />
              {order.city}, {order.state} {order.zipCode}
            </p>
            <p className="text-sm text-gray-500 mt-2">Method: {order.shippingMethod}</p>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Total</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>${order.shippingFee?.toFixed(2)}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discountAmount?.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-1"><span>Total</span><span className="text-lg">${order.totalAmount?.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
