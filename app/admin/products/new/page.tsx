'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [features, setFeatures] = useState<string[]>(['']);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([{ label: '', value: '' }]);
  const [saving, setSaving] = useState(false);

  function addFeature() { setFeatures([...features, '']); }
  function removeFeature(i: number) { setFeatures(features.filter((_, idx) => idx !== i)); }

  function addSpec() { setSpecs([...specs, { label: '', value: '' }]); }
  function removeSpec(i: number) { setSpecs(specs.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/admin/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, subtitle, description,
        price: parseFloat(price) || 0,
        compareAtPrice: parseFloat(compareAtPrice) || null,
        isActive,
        features: features.filter((f) => f.trim()),
        specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      }),
    });
    if (res.ok) {
      router.push('/admin/products');
    } else {
      alert('Failed to save product');
    }
    setSaving(false);
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. AirVela Portable AC" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Short tagline" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Product description" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="49.99" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price ($)</label>
              <input type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="99.99" />
            </div>
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
            <span className="text-sm text-gray-700">Active (visible on store)</span>
          </label>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Features</h2>
            <button onClick={addFeature} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus size={14} /> Add</button>
          </div>
          {features.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={f} onChange={(e) => { const arr = [...features]; arr[i] = e.target.value; setFeatures(arr); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Feature bullet point" />
              {features.length > 1 && <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>}
            </div>
          ))}
        </div>

        {/* Specs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Specifications</h2>
            <button onClick={addSpec} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus size={14} /> Add</button>
          </div>
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={s.label} onChange={(e) => { const arr = [...specs]; arr[i].label = e.target.value; setSpecs(arr); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Label" />
              <input value={s.value} onChange={(e) => { const arr = [...specs]; arr[i].value = e.target.value; setSpecs(arr); }} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Value" />
              {specs.length > 1 && <button onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>}
            </div>
          ))}
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving || !name.trim()} className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
          <Save size={18} /> {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </div>
  );
}
