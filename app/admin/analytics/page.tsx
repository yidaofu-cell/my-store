'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '@/components/ui/Card';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/admin/api/analytics').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  const stats = data || { todaySales: 0, monthSales: 0, totalOrders: 0, avgOrderValue: 0, recentOrders: [] };

  // Generate mock chart data based on orders
  const mockDaily = [
    { day: 'Mon', sales: 1299 }, { day: 'Tue', sales: 899 }, { day: 'Wed', sales: 1599 },
    { day: 'Thu', sales: 2199 }, { day: 'Fri', sales: 1899 }, { day: 'Sat', sales: 2499 },
    { day: 'Sun', sales: stats.todaySales || 0 },
  ];

  const mockWeekly = [
    { week: 'W1', sales: 8900 }, { week: 'W2', sales: 11200 }, { week: 'W3', sales: 9800 }, { week: 'W4', sales: stats.monthSales || 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Sales and performance overview</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${stats.monthSales.toFixed(2)}` },
          { label: 'Total Orders', value: stats.totalOrders },
          { label: 'Avg Order Value', value: `$${stats.avgOrderValue.toFixed(2)}` },
          { label: 'Conversion', value: '—' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Daily Sales (This Week)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Bar dataKey="sales" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#4F46E5' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
            ) : (
              stats.recentOrders?.map((o: any) => (
                <tr key={o.id} className="border-t border-gray-100">
                  <td className="px-6 py-3 font-mono text-sm">{o.orderNumber}</td>
                  <td className="px-6 py-3 text-sm">{o.customerName}</td>
                  <td className="px-6 py-3 font-semibold">${o.totalAmount?.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
