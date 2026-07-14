'use client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Plus } from 'lucide-react';

export default function ShippingPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [minDays, setMinDays] = useState('7');
  const [maxDays, setMaxDays] = useState('12');
  const [minFree, setMinFree] = useState('');

  useEffect(() => {
    fetch('/admin/api/shipping').then((r) => r.json()).then((d) => setRates(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  async function handleAdd() {
    await fetch('/admin/api/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: parseFloat(price), minDays: parseInt(minDays), maxDays: parseInt(maxDays), minOrderForFree: minFree ? parseFloat(minFree) : null }),
    });
    const res = await fetch('/admin/api/shipping');
    setRates(await res.json());
    setShowAdd(false); setName(''); setPrice(''); setMinFree('');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Rates</h1>
          <p className="text-gray-500 text-sm mt-1">Configure delivery options and pricing</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
          <Plus size={18} /> Add Rate
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="font-semibold mb-4">New Shipping Rate</h2>
          <div className="grid grid-cols-5 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rate name" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price $" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <input type="number" value={minDays} onChange={(e) => setMinDays(e.target.value)} placeholder="Min days" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <input type="number" value={maxDays} onChange={(e) => setMaxDays(e.target.value)} placeholder="Max days" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <div className="flex gap-2">
              <input type="number" step="0.01" value={minFree} onChange={(e) => setMinFree(e.target.value)} placeholder="Free over $" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              <button onClick={handleAdd} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 whitespace-nowrap">Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Delivery Time</th>
              <th className="px-6 py-3">Free Shipping Over</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => (
              <tr key={r.id} className="border-t border-gray-100">
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4">${r.price?.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.minDays}-{r.maxDays} days</td>
                <td className="px-6 py-4">{r.minOrderForFree ? `$${r.minOrderForFree.toFixed(2)}` : '—'}</td>
                <td className="px-6 py-4"><Badge variant={r.isActive ? 'success' : 'default'}>{r.isActive ? 'Active' : 'Inactive'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
