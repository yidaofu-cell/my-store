'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, Pencil, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = {
  sales: '#E11D48', wbNet: '#06B6D4', profit: '#10B981',
  logistics: '#F97316', storage: '#8B5CF6', inbound: '#EC4899',
  fines: '#EF4444', commission: '#F59E0B', deductions: '#14B8A6', membership: '#6B7280',
};

export default function WbListPage() {
  const [reports, setReports] = useState<any[]>([]);

  function loadReports() {
    fetch('/admin/api/wb').then(r=>r.json()).then(d=>setReports(Array.isArray(d)?d:[])).catch(()=>{});
  }
  useEffect(()=>{loadReports();},[]);

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    await fetch(`/admin/api/wb?id=${id}`,{method:'DELETE'});
    loadReports();
  }

  const totalSalesRub = reports.reduce((s,r)=>s+(r.salesRevenue||0),0);
  const totalSalesRmb = reports.reduce((s,r)=>s+((r.salesRevenue||0)*(r.exchangeRate||0.08)),0);
  const totalWbNetRmb = reports.reduce((s,r)=>s+(r.wbNetRmb||0),0);
  const totalProfit = reports.reduce((s,r)=>s+(r.netProfit||0),0);
  const totalCost = reports.reduce((s,r)=>s+(r.totalAdditionalCost||0),0);

  const sorted = [...reports].sort((a,b)=>a.month.localeCompare(b.month));
  const barData = sorted.map(r=>({month:r.month?.slice(5),'销售额':Math.round((r.salesRevenue||0)*(r.exchangeRate||0.08)),'WB净收入':Math.round(r.wbNetRmb||0),'净利润':Math.round(r.netProfit||0)}));
  const ratioData = sorted.map(r=>{const rate=r.exchangeRate||0.08;const sRmb=(r.salesRevenue||0)*rate;const mk=(v:number)=>sRmb>0?+((v||0)/sRmb*100).toFixed(1):0;return{month:r.month?.slice(5),'物流费':mk(r.logisticsFee*rate),'存储费':mk(r.storageFee*rate),'入库费':mk(r.inboundFee*rate),'罚款':mk(r.fines*rate),'佣金收单':mk(r.commissionAcquiring*rate),'扣款':mk(r.deductions*rate),'会员费':mk(r.membershipFee*rate),};});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">WB 利润测算</h1><p className="text-gray-500 text-sm mt-1">Wildberries 月度利润分析</p></div>
        <Link href="/admin/wb/new" className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700"><Plus size={18}/>新增报告</Link>
      </div>

      {reports.length>0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500">累计销售额</p><p className="text-sm text-gray-400">₽{totalSalesRub.toLocaleString()}</p><p className="text-2xl font-bold">¥{Math.round(totalSalesRmb).toLocaleString()}</p></div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500">累计WB净收入</p><p className={`text-2xl font-bold ${totalWbNetRmb>=0?'text-blue-600':'text-red-600'}`}>¥{Math.round(totalWbNetRmb).toLocaleString()}</p></div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500">累计额外成本</p><p className="text-2xl font-bold text-orange-600">¥{Math.round(totalCost).toLocaleString()}</p></div>
          <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${totalProfit>=0?'border-green-200':'border-red-200'}`}><p className="text-sm text-gray-500">累计净利润</p><p className={`text-2xl font-bold ${totalProfit>=0?'text-green-600':'text-red-600'}`}>¥{Math.round(totalProfit).toLocaleString()}</p><p className="text-xs text-gray-500">利润率 {totalSalesRmb>0?((totalProfit/totalSalesRmb)*100).toFixed(1):'0.0'}%</p></div>
        </div>
      )}

      {reports.length>0 && (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">📊 月度收入/利润对比 (RMB)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={2}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" stroke="#9ca3af" fontSize={12}/><YAxis stroke="#9ca3af" fontSize={12}/><Tooltip formatter={(v:any)=>`¥${Number(v).toLocaleString()}`}/><Legend/><Bar dataKey="销售额" fill={COLORS.sales} radius={[6,6,0,0]}/><Bar dataKey="WB净收入" fill={COLORS.wbNet} radius={[6,6,0,0]}/><Bar dataKey="净利润" fill={COLORS.profit} radius={[6,6,0,0]}/></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">📈 WB平台费用占比走势 (%)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ratioData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" stroke="#9ca3af" fontSize={12}/><YAxis stroke="#9ca3af" fontSize={12} tickFormatter={v=>`${v}%`}/><Tooltip formatter={(v:any)=>`${Number(v).toFixed(1)}%`}/><Legend/><Line type="monotone" dataKey="物流费" stroke={COLORS.logistics} strokeWidth={2} dot={{r:2}}/><Line type="monotone" dataKey="存储费" stroke={COLORS.storage} strokeWidth={2} dot={{r:2}}/><Line type="monotone" dataKey="入库费" stroke={COLORS.inbound} strokeWidth={2} dot={{r:2}}/><Line type="monotone" dataKey="罚款" stroke={COLORS.fines} strokeWidth={2} dot={{r:2}}/><Line type="monotone" dataKey="佣金收单" stroke={COLORS.commission} strokeWidth={2} dot={{r:2}}/><Line type="monotone" dataKey="扣款" stroke={COLORS.deductions} strokeWidth={2} dot={{r:2}}/><Line type="monotone" dataKey="会员费" stroke={COLORS.membership} strokeWidth={2} dot={{r:2}}/></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full">
          <thead><tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50"><th className="px-3 py-3">月份</th><th className="px-3 py-3">销售额(₽)</th><th className="px-3 py-3">销售额(¥)</th><th className="px-3 py-3">WB净收入</th><th className="px-3 py-3">额外成本</th><th className="px-3 py-3">净利润</th><th className="px-3 py-3">利润率</th><th className="px-3 py-3 text-right">操作</th></tr></thead>
          <tbody>
            {reports.length===0?<tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">暂无报告</td></tr>:reports.map(r=>{const sr=(r.salesRevenue||0)*(r.exchangeRate||0.08);return(<tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-3 py-4 font-semibold">{r.month}</td><td className="px-3 py-4 text-sm">₽{(r.salesRevenue||0).toLocaleString()}</td><td className="px-3 py-4 text-sm">¥{Math.round(sr).toLocaleString()}</td><td className="px-3 py-4"><span className={`font-semibold ${(r.wbNetRmb||0)>=0?'text-blue-600':'text-red-600'}`}>¥{Math.round(r.wbNetRmb||0).toLocaleString()}</span></td><td className="px-3 py-4 text-sm">¥{Math.round(r.totalAdditionalCost||0).toLocaleString()}</td><td className="px-3 py-4"><span className={`inline-flex items-center gap-1 font-bold text-sm ${(r.netProfit||0)>=0?'text-green-600':'text-red-600'}`}>{(r.netProfit||0)>=0?<TrendingUp size={14}/>:<TrendingDown size={14}/>}¥{Math.round(r.netProfit||0).toLocaleString()}</span></td><td className="px-3 py-4"><span className={`text-sm font-semibold ${(r.profitMargin||0)>=0?'text-green-600':'text-red-600'}`}>{(r.profitMargin||0).toFixed(1)}%</span></td><td className="px-3 py-4 text-right"><div className="flex items-center justify-end gap-1"><Link href={`/admin/wb/${r.id}`} title="查看"><Eye size={14}/></Link><Link href={`/admin/wb/${r.id}`} title="编辑"><Pencil size={13}/></Link><button onClick={()=>handleDelete(r.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button></div></td></tr>)})}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
