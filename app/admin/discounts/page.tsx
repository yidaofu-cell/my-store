'use client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Plus, Power, PowerOff } from 'lucide-react';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');

  useEffect(() => {
    fetch('/admin/api/discounts').then((r) => r.json()).then((d) => setDiscounts(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  async function handleAdd() {
    await fetch('/admin/api/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, type, value: parseFloat(value) }),
    });
    const res = await fetch('/admin/api/discounts');
    setDiscounts(await res.json());
    setShowAdd(false); setCode(''); setValue('');
  }

  async function toggle(id: number, isActive: boolean) {
    await fetch('/admin/api/discounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    const res = await fetch('/admin/api/discounts');
    setDiscounts(await res.json());
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage promotional discount codes</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
          <Plus size={18} /> Add Code
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="font-semibold mb-4">New Discount Code</h2>
          <div className="grid grid-cols-3 gap-4">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CODE" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
            <div className="flex gap-2">
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === 'percentage' ? 'e.g. 30' : 'e.g. 10'} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              <button onClick={handleAdd} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Discount</th>
              <th className="px-6 py-3">Usage</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-t border-gray-100">
                <td className="px-6 py-4 font-mono font-semibold">{d.code}</td>
                <td className="px-6 py-4">{d.type === 'percentage' ? `${d.value}% OFF` : `$${d.value} OFF`}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.usageCount} / {d.usageLimit || '∞'}</td>
                <td className="px-6 py-4"><Badge variant={d.isActive ? 'success' : 'default'}>{d.isActive ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-6 py-4">
                  <button onClick={() => toggle(d.id, d.isActive)} className={`${d.isActive ? 'text-red-500' : 'text-green-500'} hover:opacity-80`}>
                    {d.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
