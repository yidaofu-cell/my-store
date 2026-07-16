'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

function calc(o: any) {
  const rate = parseFloat(o.exchangeRate) || 0.08;
  const rub = (parseFloat(o.salesRevenue)||0) - (parseFloat(o.lossesDefects)||0) - (parseFloat(o.logisticsFee)||0) - (parseFloat(o.storageFee)||0) - (parseFloat(o.inboundFee)||0) - (parseFloat(o.fines)||0) - (parseFloat(o.commissionAcquiring)||0) - (parseFloat(o.deductions)||0) - (parseFloat(o.membershipFee)||0);
  const rmb = rub * rate;
  const cost = (parseFloat(o.purchaseCost)||0)+(parseFloat(o.shippingCost)||0)+(parseFloat(o.laborCost)||0)+(parseFloat(o.marketingCost)||0)+(parseFloat(o.otherCost)||0);
  const np = rmb - cost;
  const revRmb = (parseFloat(o.salesRevenue)||0) * rate;
  const pm = revRmb > 0 ? (np / revRmb) * 100 : 0;
  return { rub, rmb, cost, np, pm };
}

export default function NewWbPage() {
  const router = useRouter();
  const [data, setData] = useState<any>({
    month: '2026-01', salesRevenue:'', lossesDefects:'',
    logisticsFee:'', storageFee:'', inboundFee:'', fines:'', commissionAcquiring:'', deductions:'', membershipFee:'',
    exchangeRate:'0.08', purchaseCost:'', shippingCost:'', laborCost:'', marketingCost:'', otherCost:'', notes:'',
  });
  const c = calc(data);
  function set(k: string, v: string) { setData({ ...data, [k]: v }); }

  async function handleSave() {
    const body: any = { month: data.month };
    const fields = ['salesRevenue','lossesDefects','logisticsFee','storageFee','inboundFee','fines','commissionAcquiring','deductions','membershipFee','exchangeRate','purchaseCost','shippingCost','laborCost','marketingCost','otherCost'];
    fields.forEach(f => { body[f] = parseFloat(data[f]) || 0; });
    body.notes = data.notes;
    const res = await fetch('/admin/api/wb', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if (res.ok) router.push('/admin/wb'); else alert('保存失败');
  }

  const rInput = (label: string, key: string, hint?: string) => (
    <div><label className="block text-sm text-gray-500 mb-1">{label}</label><input type="number" step="0.01" value={data[key]} onChange={e=>set(key,e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20" placeholder={hint||'0.00'}/></div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/wb" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20}/></Link><h1 className="text-2xl font-bold text-gray-900">新增 WB 月度报告</h1></div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">报告月份</label>
          <input type="month" value={data.month} onChange={e=>set('month',e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"/>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-1">📊 WB 平台数据 <span className="text-xs text-gray-400 font-normal">（卢布 ₽）</span></h2>
          <p className="text-xs font-medium text-rose-600 mb-2">💰 收入</p>
          <div className="grid grid-cols-2 gap-4 mb-4">{rInput('销售','salesRevenue')}{rInput('损失、替换及有缺陷的商品','lossesDefects')}</div>
          <p className="text-xs font-medium text-orange-600 mb-2">💸 支出</p>
          <div className="grid grid-cols-2 gap-4">{rInput('物流费','logisticsFee')}{rInput('存储费','storageFee')}{rInput('入库验收操作费','inboundFee')}{rInput('罚款','fines')}{rInput('WB佣金和收单费用','commissionAcquiring')}{rInput('扣款','deductions')}{rInput('会员计划费用','membershipFee')}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">💱 汇率</h2>
          <div className="flex items-center gap-2"><span className="text-sm text-gray-500">1 卢布 =</span><input type="number" step="0.0001" value={data.exchangeRate} onChange={e=>set('exchangeRate',e.target.value)} className="w-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"/><span className="text-sm text-gray-500">人民币</span></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-1">💰 额外成本 <span className="text-xs text-gray-400 font-normal">（人民币 ¥）</span></h2>
          <div className="grid grid-cols-2 gap-4 mt-4">{rInput('采购成本','purchaseCost')}{rInput('国际运费','shippingCost')}{rInput('人工成本','laborCost')}{rInput('营销推广费用','marketingCost')}{rInput('其他费用','otherCost')}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">📈 利润分析</h2>
          <div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-gray-500">WB净收入 (卢布)</span><p className="text-lg font-bold">₽{c.rub.toFixed(2)}</p></div><div><span className="text-gray-500">WB净收入 (人民币)</span><p className="text-lg font-bold">¥{c.rmb.toFixed(2)}</p></div><div><span className="text-gray-500">额外成本合计</span><p className="text-lg font-bold text-red-600">¥{c.cost.toFixed(2)}</p></div><div className="col-span-2 border-t pt-3 grid grid-cols-2 gap-4"><div><span className="text-gray-500">净利润</span><p className={`text-xl font-bold ${c.np>=0?'text-green-600':'text-red-600'}`}>¥{c.np.toFixed(2)}</p></div><div><span className="text-gray-500">利润率</span><p className={`text-xl font-bold ${c.pm>=0?'text-green-600':'text-red-600'}`}>{c.pm.toFixed(1)}%</p></div></div></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"><h2 className="font-semibold text-gray-900 mb-4">📝 备注</h2><textarea value={data.notes} onChange={e=>set('notes',e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"/></div>
        <button onClick={handleSave} className="w-full py-3.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 flex items-center justify-center gap-2"><Save size={18}/>保存报告</button>
      </div>
    </div>
  );
}
