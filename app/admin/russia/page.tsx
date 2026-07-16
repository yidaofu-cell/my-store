'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function RussiaPage() {
  const [ozon, setOzon] = useState<any[]>([]);
  const [wb, setWb] = useState<any[]>([]);
  const [sharedShipping, setSharedShipping] = useState<Record<string, number>>({});
  const [sharedStorage, setSharedStorage] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/admin/api/ozon').then(r=>r.json()).then(d=>setOzon(Array.isArray(d)?d:[]));
    fetch('/admin/api/wb').then(r=>r.json()).then(d=>setWb(Array.isArray(d)?d:[]));
  }, []);

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
    const totalShip = sharedShipping[month] || 0;
    const totalStore = sharedStorage[month] || 0;
    const oRatio = totalRub > 0 ? oSalesRub / totalRub : 0.5;
    const wRatio = totalRub > 0 ? wSalesRub / totalRub : 0.5;

    const oExtraCost = (o.purchaseCost||0) + (o.shippingCost||0) + (o.laborCost||0) + (o.marketingCost||0) + (o.otherCost||0) + totalShip*oRatio + totalStore*oRatio;
    const wExtraCost = (w.purchaseCost||0) + (w.shippingCost||0) + (w.laborCost||0) + (w.marketingCost||0) + (w.otherCost||0) + totalShip*wRatio + totalStore*wRatio;

    const oProfit = oNetRmb - oExtraCost;
    const wProfit = wNetRmb - wExtraCost;
    const combinedProfit = oProfit + wProfit;
    const combinedRevenue = oSalesRmb + wSalesRmb;

    return {
      month: month.slice(5),
      oSalesRmb, wSalesRmb, combinedRevenue,
      oProfit, wProfit, combinedProfit,
      oRatio: (oRatio*100).toFixed(0), wRatio: (wRatio*100).toFixed(0),
      shipAlloc: { o: Math.round(totalShip*oRatio), w: Math.round(totalShip*wRatio) },
      storeAlloc: { o: Math.round(totalStore*oRatio), w: Math.round(totalStore*wRatio) },
    };
  });

  const totalOzonProfit = rows.reduce((s,r)=>s+r.oProfit,0);
  const totalWbProfit = rows.reduce((s,r)=>s+r.wProfit,0);
  const totalCombined = totalOzonProfit + totalWbProfit;
  const totalCombinedRev = rows.reduce((s,r)=>s+r.combinedRevenue,0);

  const chartData = rows.map(r=>({
    month: r.month,
    'Ozon利润': Math.round(r.oProfit),
    'WB利润': Math.round(r.wProfit),
    '合计利润': Math.round(r.combinedProfit),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🇷🇺 俄罗斯市场综合看板</h1>
        <p className="text-gray-500 text-sm mt-1">Ozon + Wildberries 合并利润分析</p>
      </div>

      {/* 汇总卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Ozon净利润</p>
          <p className={`text-2xl font-bold ${totalOzonProfit>=0?'text-green-600':'text-red-600'}`}>¥{Math.round(totalOzonProfit).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">WB 净利润</p>
          <p className={`text-2xl font-bold ${totalWbProfit>=0?'text-green-600':'text-red-600'}`}>¥{Math.round(totalWbProfit).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-sm">
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
        <h3 className="font-semibold text-gray-900 mb-1">📊 Ozon vs WB 月度利润对比 (RMB)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" stroke="#9ca3af" fontSize={12}/><YAxis stroke="#9ca3af" fontSize={12}/><Tooltip formatter={(v:any)=>`¥${Number(v).toLocaleString()}`}/><Legend/><Bar dataKey="Ozon利润" fill="#4F46E5" radius={[6,6,0,0]}/><Bar dataKey="WB利润" fill="#E11D48" radius={[6,6,0,0]}/><Bar dataKey="合计利润" fill="#10B981" radius={[6,6,0,0]}/></BarChart>
        </ResponsiveContainer>
      </div>

      {/* 共享成本均摊 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">🚚 共享成本均摊</h3>
        <p className="text-xs text-gray-400 mb-4">填入当月实际总成本，系统按销售额占比自动分摊到各渠道</p>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 uppercase bg-gray-50"><th className="px-4 py-3">月份</th><th className="px-4 py-3">Ozon占比</th><th className="px-4 py-3">WB占比</th><th className="px-4 py-3">总运费(RMB)</th><th className="px-4 py-3">Ozon分摊</th><th className="px-4 py-3">WB分摊</th><th className="px-4 py-3">总仓储(RMB)</th><th className="px-4 py-3">Ozon分摊</th><th className="px-4 py-3">WB分摊</th></tr></thead>
          <tbody>
            {rows.map(r=>(<tr key={r.month} className="border-t border-gray-100">
              <td className="px-4 py-3 font-semibold">{r.month}月</td>
              <td className="px-4 py-3">{r.oRatio}%</td><td className="px-4 py-3">{r.wRatio}%</td>
              <td className="px-4 py-3"><input type="number" step="0.01" value={sharedShipping[r.month]||''} onChange={e=>setSharedShipping({...sharedShipping,[r.month]:parseFloat(e.target.value)||0})} className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-sm" placeholder="0"/></td>
              <td className="px-4 py-3 text-indigo-600">¥{r.shipAlloc.o.toLocaleString()}</td>
              <td className="px-4 py-3 text-rose-600">¥{r.shipAlloc.w.toLocaleString()}</td>
              <td className="px-4 py-3"><input type="number" step="0.01" value={sharedStorage[r.month]||''} onChange={e=>setSharedStorage({...sharedStorage,[r.month]:parseFloat(e.target.value)||0})} className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-sm" placeholder="0"/></td>
              <td className="px-4 py-3 text-indigo-600">¥{r.storeAlloc.o.toLocaleString()}</td>
              <td className="px-4 py-3 text-rose-600">¥{r.storeAlloc.w.toLocaleString()}</td>
            </tr>))}
          </tbody>
        </table></div>
      </div>

      {/* 渠道汇总表 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <h3 className="font-semibold text-gray-900 p-6 pb-2">📋 渠道利润汇总</h3>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 uppercase bg-gray-50"><th className="px-4 py-3">月份</th><th className="px-4 py-3">Ozon收入</th><th className="px-4 py-3">WB收入</th><th className="px-4 py-3">总收入(RMB)</th><th className="px-4 py-3">Ozon利润</th><th className="px-4 py-3">WB利润</th><th className="px-4 py-3">合计利润</th></tr></thead>
          <tbody>
            {rows.map(r=>(<tr key={r.month} className="border-t border-gray-100">
              <td className="px-4 py-3 font-semibold">{r.month}月</td>
              <td className="px-4 py-3 text-indigo-600">¥{Math.round(r.oSalesRmb).toLocaleString()}</td>
              <td className="px-4 py-3 text-rose-600">¥{Math.round(r.wSalesRmb).toLocaleString()}</td>
              <td className="px-4 py-3 font-semibold">¥{Math.round(r.combinedRevenue).toLocaleString()}</td>
              <td className="px-4 py-3"><span className={`font-semibold ${r.oProfit>=0?'text-green-600':'text-red-600'}`}>{r.oProfit>=0?<TrendingUp size={14} className="inline"/>:<TrendingDown size={14} className="inline"/>} ¥{Math.round(r.oProfit).toLocaleString()}</span></td>
              <td className="px-4 py-3"><span className={`font-semibold ${r.wProfit>=0?'text-green-600':'text-red-600'}`}>{r.wProfit>=0?<TrendingUp size={14} className="inline"/>:<TrendingDown size={14} className="inline"/>} ¥{Math.round(r.wProfit).toLocaleString()}</span></td>
              <td className="px-4 py-3"><span className={`font-bold ${r.combinedProfit>=0?'text-indigo-600':'text-red-600'}`}>¥{Math.round(r.combinedProfit).toLocaleString()}</span></td>
            </tr>))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
