'use client';
import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    currency: 'USD',
    stripePublishableKey: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/admin/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          storeName: data.storeName || 'AirVela',
          storeEmail: data.storeEmail || 'support@airvelar.com',
          currency: data.currency || 'USD',
          stripePublishableKey: data.stripePublishableKey || '',
          metaTitle: data.metaTitle || 'AirVela Portable AC — Stay Cool Anywhere',
          metaDescription: data.metaDescription || 'The AirVela Portable AC delivers instant cooling...',
        });
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    await fetch('/admin/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setMessage('✅ Settings saved!');
    setTimeout(() => setMessage(''), 2000);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store configuration</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
          <Save size={16} /> Save
        </button>
      </div>

      {message && <div className="mb-4 text-sm font-medium text-green-600">{message}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">General</h2>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Store Name</label>
          <input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Support Email</label>
          <input value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Currency</label>
          <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>

        <h2 className="font-semibold text-gray-900 pt-4">Payment</h2>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Stripe Publishable Key</label>
          <input value={settings.stripePublishableKey} onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm" />
        </div>

        <h2 className="font-semibold text-gray-900 pt-4">SEO</h2>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Meta Title</label>
          <input value={settings.metaTitle} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Meta Description</label>
          <textarea value={settings.metaDescription} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
      </div>
    </div>
  );
}
