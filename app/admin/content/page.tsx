'use client';
import React, { useEffect, useState } from 'react';
import { Save, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ContentPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('hero');
  const [json, setJson] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/admin/api/content')
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setSections(arr);
        const hero = arr.find((s: any) => s.sectionKey === 'hero');
        if (hero) setJson(JSON.stringify(hero.contentJson, null, 2));
      });
  }, []);

  function selectSection(key: string) {
    setSelected(key);
    const section = sections.find((s: any) => s.sectionKey === key);
    if (section) setJson(JSON.stringify(section.contentJson, null, 2));
  }

  async function handleSave() {
    try {
      const parsed = JSON.parse(json);
      await fetch('/admin/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey: selected, contentJson: parsed }),
      });
      setMessage('✅ Saved successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('❌ Invalid JSON');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landing Page Content</h1>
          <p className="text-gray-500 text-sm mt-1">Edit the content for each section</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/article" target="_blank" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
            <Eye size={14} /> Preview Store
          </Link>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {message && <div className="mb-4 text-sm font-medium">{message}</div>}

      <div className="grid md:grid-cols-4 gap-6">
        {/* Section Tabs */}
        <div className="space-y-1">
          {sections.map((s: any) => (
            <button
              key={s.sectionKey}
              onClick={() => selectSection(s.sectionKey)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                selected === s.sectionKey
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s.sectionKey.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* JSON Editor */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3 capitalize">{selected.replace('_', ' ')} Section</h2>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="w-full h-96 font-mono text-sm p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
