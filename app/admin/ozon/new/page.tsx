'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

function calc(o: any) {
  const tp = (o.ozonCommission||0)+(o.logisticsFee||0)+(o.returnLoss||0)+(o.finesPenalties||0)+(o.otherPlatformFees||0);
  const tc = (o.purchaseCost||0)+(o.shippingCost||0)+(o.laborCost||0)+(o.marketingCost||0)+(o.otherCost||0);
  const gp = (o.netPayout||0)-(o.purchaseCost||0)-(o.shippingCost||0);
  const np = (o.netPayout||0)-tc;
  const pm = (o.totalRevenue||0)>0 ? (np/o.totalRevenue)*100 : 0;
  return { tp, tc, gp, np, pm };
}

export default function NewOzonPage() {
  const router = useRouter();
  const [data, setData] = useState<any>({
    month: '2026-01', totalRevenue: '', ozonCommission: '', logisticsFee: '',
    returnLoss: '', finesPenalties: '', otherPlatformFees: '', netPayout: '',
    purchaseCost: '', shippingCost: '', laborCost: '', marketingCost: '', otherCost: '',
    notes: '',
  });

  const c = calc(data);

  function set(k: string, v: string) { setData({ ...data, [k]: v }); }

  async function handleSave() {
    const body: any = { month: data.month };
    const fields = ['totalRevenue','ozonCommission','logisticsFee','returnLoss','finesPenalties','otherPlatformFees','netPayout','purchaseCost','shippingCost','laborCost','marketingCost','otherCost'];
    fields.forEach((f) => { body[f] = parseFloat(data[f]) || 0; });
    body.notes = data.notes;

    const res = await fetch('/admin/api/ozon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) router.push('/admin/ozon');
    else alert('保存失败');
  }

  const input = (label: string, key: string, hint?: string) => (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <input type="number" step="0.01" value={data[key]} onChange={(e) => set(key, e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        placeholder={hint || '0.00'} />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/ozon" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-900">新增月度报告</h1>
      </div>

      <div className="space-y-6">
        {/* 月份选择 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">报告月份</label>
          <input type="month" value={data.month} onChange={(e) => set('month', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>

        {/* Ozon 平台数据 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">📊 Ozon 平台数据</h2>
          <div className="grid grid-cols-2 gap-4">
            {input('总销售额 (₽)', 'totalRevenue', 'Ozon后台总计销售额')}
            {input('平台佣金', 'ozonCommission')}
            {input('物流费用', 'logisticsFee')}
            {input('退货损失', 'returnLoss')}
            {input('罚款', 'finesPenalties')}
            {input('其他平台费用', 'otherPlatformFees')}
            {input('实际打款金额', 'netPayout', 'Ozon实际汇入金额')}
          </div>
        </div>

        {/* 额外成本 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">💰 额外成本</h2>
          <div className="grid grid-cols-2 gap-4">
            {input('采购成本', 'purchaseCost')}
            {input('国际运费', 'shippingCost')}
            {input('人工成本', 'laborCost')}
            {input('营销推广费用', 'marketingCost')}
            {input('其他费用', 'otherCost')}
          </div>
        </div>

        {/* 自动计算 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">📈 利润分析</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">平台费用合计</span><p className="text-lg font-bold">¥{c.tp.toFixed(2)}</p></div>
            <div><span className="text-gray-500">额外成本合计</span><p className="text-lg font-bold">¥{c.tc.toFixed(2)}</p></div>
            <div className="col-span-2 border-t pt-3 grid grid-cols-3 gap-4">
              <div><span className="text-gray-500">毛利润</span><p className={`text-lg font-bold ${c.gp>=0?'text-green-600':'text-red-600'}`}>¥{c.gp.toFixed(2)}</p></div>
              <div><span className="text-gray-500">净利润</span><p className={`text-lg font-bold ${c.np>=0?'text-green-600':'text-red-600'}`}>¥{c.np.toFixed(2)}</p></div>
              <div><span className="text-gray-500">利润率</span><p className={`text-lg font-bold ${c.pm>=0?'text-green-600':'text-red-600'}`}>{c.pm.toFixed(1)}%</p></div>
            </div>
          </div>
        </div>

        {/* 备注 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">📝 备注</h2>
          <textarea value={data.notes} onChange={(e) => set('notes', e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="记录当月特殊情况..." />
        </div>

        {/* 保存 */}
        <button onClick={handleSave} className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2">
          <Save size={18} /> 保存报告
        </button>
      </div>
    </div>
  );
}
