'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

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

export default function EditWbPage() {
  const router = useRouter(); const { id } = useParams();
  const [data, setData] = useState<any>(null);
  useEffect(()=>{fetch('/admin/api/wb').then(r=>r.json()).then(rs=>{const f=rs.find((r:any)=>r.id===parseInt(id as string));if(f)setData(f);});},[id]);
  if(!data) return <div className="text-gray-500 p-6">加载中...</div>;
  const c = calc(data);
  function set(k:string,v:string){setData({...data,[k]:v});}
  async function handleSave(){
    const body:any={id:data.id,month:data.month};['salesRevenue','lossesDefects','logisticsFee','storageFee','inboundFee','fines','commissionAcquiring','deductions','membershipFee','exchangeRate','purchaseCost','shippingCost','laborCost','marketingCost','otherCost'].forEach(f=>{body[f]=parseFloat(data[f])||0;});
    body.notes=data.notes||'';
    await fetch('/admin/api/wb',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    router.push('/admin/wb');
  }
  async function handleDelete(){if(!confirm('确定删除？'))return;await fetch(`/admin/api/wb?id=${data.id}`,{method:'DELETE'});router.push('/admin/wb');}
  const rI=(l:string,k:string)=><div><label className="block text-sm text-gray-500 mb-1">{l}</label><input type="number" step="0.01" value={data[k]||''} onChange={e=>set(k,e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"/></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/wb" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20}/></Link><h1 className="text-2xl font-bold text-gray-900">编辑 WB 报告 — {data.month}</h1></div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"><label className="block text-sm font-medium text-gray-700 mb-1">报告月份</label><input type="month" value={data.month||''} onChange={e=>set('month',e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"/></div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-1">📊 WB 平台数据 <span className="text-xs text-gray-400">（卢布 ₽）</span></h2>
          <p className="text-xs font-medium text-rose-600 mt-2 mb-2">💰 收入</p>
          <div className="grid grid-cols-2 gap-4 mb-4">{rI('销售','salesRevenue')}{rI('损失、替换及有缺陷的商品','lossesDefects')}</div>
          <p className="text-xs font-medium text-orange-600 mb-2">💸 支出</p>
          <div className="grid grid-cols-2 gap-4">{rI('物流费','logisticsFee')}{rI('存储费','storageFee')}{rI('入库验收操作费','inboundFee')}{rI('罚款','fines')}{rI('WB佣金和收单费用','commissionAcquiring')}{rI('扣款','deductions')}{rI('会员计划费用','membershipFee')}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"><h2 className="font-semibold mb-4">💱 汇率</h2><div className="flex items-center gap-2"><span className="text-sm text-gray-500">1 卢布 =</span><input type="number" step="0.0001" value={data.exchangeRate||''} onChange={e=>set('exchangeRate',e.target.value)} className="w-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"/><span className="text-sm text-gray-500">人民币</span></div></div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"><h2 className="font-semibold mb-1">💰 额外成本 <span className="text-xs text-gray-400">（人民币 ¥）</span></h2><div className="grid grid-cols-2 gap-4 mt-4">{rI('采购成本','purchaseCost')}{rI('国际运费','shippingCost')}{rI('人工成本','laborCost')}{rI('营销推广费用','marketingCost')}{rI('其他费用','otherCost')}</div></div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"><h2 className="font-semibold mb-4">📈 利润分析</h2><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-gray-500">WB净收入(卢布)</span><p className="text-lg font-bold">₽{c.rub.toFixed(2)}</p></div><div><span className="text-gray-500">WB净收入(人民币)</span><p className="text-lg font-bold">¥{c.rmb.toFixed(2)}</p></div><div><span className="text-gray-500">额外成本合计</span><p className="text-lg font-bold text-red-600">¥{c.cost.toFixed(2)}</p></div><div className="col-span-2 border-t pt-3 grid grid-cols-2 gap-4"><div><span className="text-gray-500">净利润</span><p className={`text-xl font-bold ${c.np>=0?'text-green-600':'text-red-600'}`}>¥{c.np.toFixed(2)}</p></div><div><span className="text-gray-500">利润率</span><p className={`text-xl font-bold ${c.pm>=0?'text-green-600':'text-red-600'}`}>{c.pm.toFixed(1)}%</p></div></div></div></div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"><h2 className="font-semibold mb-4">📝 备注</h2><textarea value={data.notes||''} onChange={e=>set('notes',e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"/></div>
        <div className="flex gap-3"><button onClick={handleSave} className="flex-1 py-3.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 flex items-center justify-center gap-2"><Save size={18}/>保存修改</button><button onClick={handleDelete} className="px-6 py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600"><Trash2 size={18}/></button></div>
      </div>
    </div>
  );
}
