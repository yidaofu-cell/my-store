'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

function calc(o: any) {
  const rate = parseFloat(o.exchangeRate) || 0.08;
  const rub = (parseFloat(o.salesRevenue)||0) - (parseFloat(o.returns)||0) - (parseFloat(o.ozonCommission)||0) - (parseFloat(o.deliveryService)||0) - (parseFloat(o.partnerServices)||0) - (parseFloat(o.fboService)||0) - (parseFloat(o.promotionAdvertising)||0) - (parseFloat(o.otherFines)||0) + (parseFloat(o.compensation)||0) + (parseFloat(o.otherAccruals)||0);
  const rmb = rub * rate;
  const cost = (parseFloat(o.purchaseCost)||0)+(parseFloat(o.shippingCost)||0)+(parseFloat(o.laborCost)||0)+(parseFloat(o.marketingCost)||0)+(parseFloat(o.otherCost)||0);
  const np = rmb - cost;
  const revRmb = (parseFloat(o.salesRevenue)||0) * rate;
  const pm = revRmb > 0 ? (np / revRmb) * 100 : 0;
  return { rub, rmb, cost, np, pm };
}

export default function EditOzonPage() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/admin/api/ozon').then((r) => r.json()).then((reports) => {
      const found = reports.find((r: any) => r.id === parseInt(id as string));
      if (found) setData(found);
    });
  }, [id]);

  if (!data) return <div className="text-gray-500 p-6">加载中...</div>;

  const c = calc(data);
  function set(k: string, v: string) { setData({ ...data, [k]: v }); }

  async function handleSave() {
    const body: any = { id: data.id, month: data.month };
    const fields = ['salesRevenue','returns','ozonCommission','deliveryService','partnerServices','fboService','promotionAdvertising','otherFines','compensation','otherAccruals','exchangeRate','purchaseCost','shippingCost','laborCost','marketingCost','otherCost'];
    fields.forEach((f) => { body[f] = parseFloat(data[f]) || 0; });
    body.notes = data.notes || '';
    await fetch('/admin/api/ozon', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    router.push('/admin/ozon');
  }

  async function handleDelete() {
    if (!confirm('确定删除？')) return;
    await fetch(`/admin/api/ozon?id=${data.id}`, { method:'DELETE' });
    router.push('/admin/ozon');
  }

  const rInput = (label: string, key: string) => (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <input type="number" step="0.01" value={data[key] || ''} onChange={(e) => set(key, e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/ozon" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-900">编辑报告 — {data.month}</h1>
      </div>

      <div className="space-y-6">
        {/* 月份选择 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">报告月份</label>
          <input type="month" value={data.month || ''} onChange={(e) => set('month', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-1">📊 Ozon 平台数据 <span className="text-xs text-gray-400 font-normal">（卢布 ₽）</span></h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {rInput('销售', 'salesRevenue')}
            {rInput('退货', 'returns')}
            {rInput('Ozon代理佣金', 'ozonCommission')}
            {rInput('配送服务', 'deliveryService')}
            {rInput('合作伙伴服务', 'partnerServices')}
            {rInput('FBO服务', 'fboService')}
            {rInput('推广和广告', 'promotionAdvertising')}
            {rInput('其他服务与罚款', 'otherFines')}
            {rInput('赔偿和赔偿返还', 'compensation')}
            {rInput('其他应计项目', 'otherAccruals')}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">💱 汇率</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">1 卢布 =</span>
            <input type="number" step="0.0001" value={data.exchangeRate || ''} onChange={(e) => set('exchangeRate', e.target.value)}
              className="w-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <span className="text-sm text-gray-500">人民币</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-1">💰 额外成本 <span className="text-xs text-gray-400 font-normal">（人民币 ¥）</span></h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {rInput('采购成本', 'purchaseCost')}
            {rInput('国际运费', 'shippingCost')}
            {rInput('人工成本', 'laborCost')}
            {rInput('营销推广费用', 'marketingCost')}
            {rInput('其他费用', 'otherCost')}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">📈 利润分析</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Ozon净收入 (卢布)</span><p className="text-lg font-bold">₽{c.rub.toFixed(2)}</p></div>
            <div><span className="text-gray-500">Ozon净收入 (人民币)</span><p className="text-lg font-bold">¥{c.rmb.toFixed(2)}</p></div>
            <div><span className="text-gray-500">额外成本合计</span><p className="text-lg font-bold text-red-600">¥{c.cost.toFixed(2)}</p></div>
            <div className="col-span-2 border-t pt-3 grid grid-cols-2 gap-4">
              <div><span className="text-gray-500">净利润</span><p className={`text-xl font-bold ${c.np>=0?'text-green-600':'text-red-600'}`}>¥{c.np.toFixed(2)}</p></div>
              <div><span className="text-gray-500">利润率</span><p className={`text-xl font-bold ${c.pm>=0?'text-green-600':'text-red-600'}`}>{c.pm.toFixed(1)}%</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">📝 备注</h2>
          <textarea value={data.notes || ''} onChange={(e) => set('notes', e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2">
            <Save size={18} /> 保存修改
          </button>
          <button onClick={handleDelete} className="px-6 py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
