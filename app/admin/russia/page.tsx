'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Save } from 'lucide-react';

export default function RussiaPage() {
  const [ozon, setOzon] = useState<any[]>([]);
  const [wb, setWb] = useState<any[]>([]);
  const [sharedCosts, setSharedCosts] = useState<any[]>([]);
  const [localShipping, setLocalShipping] = useState<Record<string, number>>({});
  const [localStorage, setLocalStorage] = useState<Record<string, number>>({});
  const [localOtherLabor, setLocalOtherLabor] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/admin/api/ozon').then(r=>r.json()).then(d=>setOzon(Array.isArray(d)?d:[]));
    fetch('/admin/api/wb').then(r=>r.json()).then(d=>setWb(Array.isArray(d)?d:[]));
    fetch('/admin/api/shared-costs').then(r=>r.json()).then(d=>{
      const arr = Array.isArray(d)?d:[];
      setSharedCosts(arr);
      const ship: Record<string,number>={}, stor: Record<string,number>={}, labor: Record<string,number>={};
      arr.forEach((c:any)=>{ ship[c.month]=c.totalShipping||0; stor[c.month]=c.totalStorage||0; labor[c.month]=c.totalOtherLabor||0; });
      setLocalShipping(ship); setLocalStorage(stor); setLocalOtherLabor(labor);
    });
  }, []);

  const saveShared = useCallback(async (month: string, totalShipping: number, totalStorage: number, totalOtherLabor: number) => {
    await fetch('/admin/api/shared-costs', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ month, totalShipping, totalStorage, totalOtherLabor }),
    });
    setSaved(prev=>({...prev,[month]:true}));
    setTimeout(()=>setSaved(prev=>({...prev,[month]:false})), 1500);
  }, []);

  function updateShip(month:string, v:number) {
    setLocalShipping(prev=>({...prev,[month]:v}));
  }
  function updateStor(month:string, v:number) {
    setLocalStorage(prev=>({...prev,[month]:v}));
  }
  function updateOtherLabor(month:string, v:number) {
    setLocalOtherLabor(prev=>({...prev,[month]:v}));
  }

  // 合并所有月份
  const allMonths = [...new Set([...ozon.map(r=>r.month), ...wb.map(r=>r.month)])].sort();
  const months = allMonths.slice(-12);

  const rows = months.map(month => {
    const o = ozon.find(r=>r.month===month) || {};
    const w = wb.find(r=>r.month===month) || {};
    const oRate = o.exchangeRate || 0.08;
    const wRate = w.exchangeRate || 0.08;
    const oSalesRub = o.salesRevenue || 0;
    const wSalesRub = w.salesRevenue || 0;
    const totalRub = oSalesRub + wSalesRub;
    const oSalesRmb = oSalesRub * oRate;
    const wSalesRmb = wSalesRub * wRate;
    const oNetRmb = o.ozonNetRmb || 0;
    const wNetRmb = w.wbNetRmb || 0;

    // 共享成本分摊
    const totalShip = localShipping[month] || 0;
    const totalStore = localStorage[month] || 0;
    const totalLabor = localOtherLabor[month] || 0;
    const oRatio = totalRub > 0 ? oSalesRub / totalRub : 0.5;
    const wRatio = totalRub > 0 ? wSalesRub / totalRub : 0.5;
    const oShipAlloc = Math.round(totalShip * oRatio);
    const wShipAlloc = Math.round(totalShip * wRatio);
    const oStoreAlloc = Math.round(totalStore * oRatio);
    const wStoreAlloc = Math.round(totalStore * wRatio);
    const oLaborAlloc = Math.round(totalLabor * oRatio);
    const wLaborAlloc = Math.round(totalLabor * wRatio);

    // 各自额外成本 + 分摊的共享成本
    const oOwnCost = (o.purchaseCost||0) + (o.shippingCost||0) + (o.laborCost||0) + (o.marketingCost||0) + (o.otherCost||0);
    const wOwnCost = (w.purchaseCost||0) + (w.shippingCost||0) + (w.laborCost||0) + (w.marketingCost||0) + (w.otherCost||0);
    const oTotalCost = oOwnCost + oShipAlloc + oStoreAlloc + oLaborAlloc;
    const wTotalCost = wOwnCost + wShipAlloc + wStoreAlloc + wLaborAlloc;

    // 真实利润 = 渠道净收入 - 自有成本 - 分摊成本
    const oProfit = oNetRmb - oTotalCost;
    const wProfit = wNetRmb - wTotalCost;
    const combinedProfit = oProfit + wProfit;
    const combinedRevenue = oSalesRmb + wSalesRmb;

    return {
      month, monthLabel: month.slice(5),
      oSalesRmb, wSalesRmb, combinedRevenue,
      oOwnCost, wOwnCost, oTotalCost, wTotalCost,
      oShipAlloc, wShipAlloc, oStoreAlloc, wStoreAlloc,
      oLaborAlloc, wLaborAlloc,
      oProfit, wProfit, combinedProfit,
      oRatio: (oRatio*100).toFixed(0), wRatio: (wRatio*100).toFixed(0),
      totalShip, totalStore, totalLabor,
    };
  });

  const totalOzonProfit = rows.reduce((s,r)=>s+r.oProfit,0);
  const totalWbProfit = rows.reduce((s,r)=>s+r.wProfit,0);
  const totalCombined = totalOzonProfit + totalWbProfit;
  const totalCombinedRev = rows.reduce((s,r)=>s+r.combinedRevenue,0);

  const chartData = rows.map(r=>({
    month: r.monthLabel,
    'Ozon利润': Math.round(r.oProfit),
    'WB利润': Math.round(r.wProfit),
    '合计利润': Math.round(r.combinedProfit),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🇷🇺 俄罗斯市场综合看板</h1>
        <p className="text-gray-500 text-sm mt-1">Ozon + Wildberries 合并利润（含共享成本分摊）</p>
      </div>

      {/* 汇总卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Ozon净利润（含分摊）</p>
          <p className={`text-2xl font-bold ${totalOzonProfit>=0?'text-green-600':'text-red-600'}`}>¥{Math.round(totalOzonProfit).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">WB净利润（含分摊）</p>
          <p className={`text-2xl font-bold ${totalWbProfit>=0?'text-green-600':'text-red-600'}`}>¥{Math.round(totalWbProfit).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-indigo-300 p-5 shadow-sm">
          <p className="text-sm text-gray-500">俄罗斯总利润</p>
          <p className={`text-2xl font-bold ${totalCombined>=0?'text-indigo-600':'text-red-600'}`}>¥{Math.round(totalCombined).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">总利润率</p>
          <p className="text-2xl font-bold">{totalCombinedRev>0?((totalCombined/totalCombinedRev)*100).toFixed(1):'0.0'}%</p>
        </div>
      </div>

      {/* Ozon vs WB 利润对比图 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">📊 Ozon vs WB 月度利润对比（含分摊）</h3>
        <p className="text-xs text-gray-400 mb-4">已计入分摊后的真实渠道利润</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" stroke="#9ca3af" fontSize={12}/><YAxis stroke="#9ca3af" fontSize={12}/><Tooltip formatter={(v:any)=>`¥${Number(v).toLocaleString()}`}/><Legend/><Bar dataKey="Ozon利润" fill="#4F46E5" radius={[6,6,0,0]}/><Bar dataKey="WB利润" fill="#E11D48" radius={[6,6,0,0]}/><Bar dataKey="合计利润" fill="#10B981" radius={[6,6,0,0]}/></BarChart>
        </ResponsiveContainer>
      </div>

      {/* 共享成本均摊 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">🚚 共享成本均摊（保存到数据库）</h3>
        <p className="text-xs text-gray-400 mb-4">输入当月实际发生的总费用，系统按销售额占比自动分摊。修改后点 💾 保存。</p>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
            <th className="px-3 py-3">月份</th><th className="px-3 py-3">销售占比</th>
            <th className="px-3 py-3">总运费(RMB)</th><th className="px-3 py-3">Ozon分摊</th><th className="px-3 py-3">WB分摊</th>
            <th className="px-3 py-3">总仓储(RMB)</th><th className="px-3 py-3">Ozon分摊</th><th className="px-3 py-3">WB分摊</th>
            <th className="px-3 py-3">其他人力(RMB)</th><th className="px-3 py-3">Ozon分摊</th><th className="px-3 py-3">WB分摊</th>
            <th className="px-3 py-3">保存</th>
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.month} className="border-t border-gray-100">
                <td className="px-3 py-3 font-semibold">{r.monthLabel}月</td>
                <td className="px-3 py-3 text-xs">Ozon {r.oRatio}% / WB {r.wRatio}%</td>
                <td className="px-3 py-3"><input type="number" step="0.01" value={r.totalShip||''} onChange={e=>updateShip(r.month,parseFloat(e.target.value)||0)} className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-sm" placeholder="0"/></td>
                <td className="px-3 py-3 text-indigo-600 font-medium">¥{r.oShipAlloc.toLocaleString()}</td>
                <td className="px-3 py-3 text-rose-600 font-medium">¥{r.wShipAlloc.toLocaleString()}</td>
                <td className="px-3 py-3"><input type="number" step="0.01" value={r.totalStore||''} onChange={e=>updateStor(r.month,parseFloat(e.target.value)||0)} className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-sm" placeholder="0"/></td>
                <td className="px-3 py-3 text-indigo-600 font-medium">¥{r.oStoreAlloc.toLocaleString()}</td>
                <td className="px-3 py-3 text-rose-600 font-medium">¥{r.wStoreAlloc.toLocaleString()}</td>
                <td className="px-3 py-3"><input type="number" step="0.01" value={r.totalLabor||''} onChange={e=>updateOtherLabor(r.month,parseFloat(e.target.value)||0)} className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-sm" placeholder="0"/></td>
                <td className="px-3 py-3 text-indigo-600 font-medium">¥{r.oLaborAlloc.toLocaleString()}</td>
                <td className="px-3 py-3 text-rose-600 font-medium">¥{r.wLaborAlloc.toLocaleString()}</td>
                <td className="px-3 py-3">
                  <button onClick={()=>saveShared(r.month,r.totalShip,r.totalStore,r.totalLabor)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${saved[r.month]?'bg-green-100 text-green-700':'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    {saved[r.month]?'✅ 已保存':'💾 保存'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      {/* 渠道利润汇总 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <h3 className="font-semibold text-gray-900 p-6 pb-2">📋 分摊后渠道利润汇总（含共享成本）</h3>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
            <th className="px-4 py-3">月份</th>
            <th className="px-4 py-3">Ozon净收入</th><th className="px-4 py-3">Ozon自成本</th><th className="px-4 py-3">Ozon总分摊</th><th className="px-4 py-3">Ozon利润</th>
            <th className="px-4 py-3">WB净收入</th><th className="px-4 py-3">WB自成本</th><th className="px-4 py-3">WB总分摊</th><th className="px-4 py-3">WB利润</th>
            <th className="px-4 py-3 font-bold text-indigo-600">合计利润</th>
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.month} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{r.monthLabel}月</td>
                <td className="px-4 py-3">¥{Math.round(r.oSalesRmb).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">¥{Math.round(r.oOwnCost).toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-500">¥{Math.round(r.oShipAlloc+r.oStoreAlloc+r.oLaborAlloc).toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`font-semibold ${r.oProfit>=0?'text-green-600':'text-red-600'}`}>¥{Math.round(r.oProfit).toLocaleString()}</span></td>
                <td className="px-4 py-3">¥{Math.round(r.wSalesRmb).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">¥{Math.round(r.wOwnCost).toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-500">¥{Math.round(r.wShipAlloc+r.wStoreAlloc+r.wLaborAlloc).toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`font-semibold ${r.wProfit>=0?'text-green-600':'text-red-600'}`}>¥{Math.round(r.wProfit).toLocaleString()}</span></td>
                <td className="px-4 py-3"><span className={`font-bold ${r.combinedProfit>=0?'text-indigo-600':'text-red-600'}`}>¥{Math.round(r.combinedProfit).toLocaleString()}</span></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
