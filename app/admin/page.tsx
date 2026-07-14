'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUpRight } from 'lucide-react';

interface DashboardData {
  todaySales: number;
  monthSales: number;
  totalOrders: number;
  avgOrderValue: number;
  recentOrders: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/admin/api/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({
        todaySales: 0, monthSales: 0, totalOrders: 0, avgOrderValue: 0, recentOrders: [],
      }));
  }, []);

  const stats = [
    { label: 'Today Sales', value: `$${(data?.todaySales || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'Month Sales', value: `$${(data?.monthSales || 0).toFixed(2)}`, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-100' },
    { label: 'Total Orders', value: String(data?.totalOrders || 0), icon: ShoppingCart, color: 'text-orange-600 bg-orange-100' },
    { label: 'Avg Order', value: `$${(data?.avgOrderValue || 0).toFixed(2)}`, icon: Package, color: 'text-blue-600 bg-blue-100' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <Link href="/article" target="_blank" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
          View Store <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { href: '/admin/products', label: 'Manage Products', desc: 'Add or edit products', icon: '📦' },
          { href: '/admin/orders', label: 'View Orders', desc: 'Process & fulfill orders', icon: '📋' },
          { href: '/admin/content', label: 'Edit Content', desc: 'Update landing page', icon: '✏️' },
          { href: '/admin/discounts', label: 'Discounts', desc: 'Manage promo codes', icon: '🏷️' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <span className="text-2xl">{link.icon}</span>
            <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-indigo-600 transition-colors">
              {link.label}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No orders yet. Orders will appear here once customers start buying.
                  </td>
                </tr>
              ) : (
                (data?.recentOrders || []).map((order: any) => (
                  <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm text-indigo-600">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">{order.customerName}</td>
                    <td className="px-6 py-3 text-sm font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
