'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, Pencil, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = {
  sales: '#4F46E5',
  ozonNet: '#06B6D4',
  profit: '#10B981',
  loss: '#EF4444',
  platform: '#F97316',
  purchase: '#8B5CF6',
  shipping: '#EC4899',
  labor: '#14B8A6',
  marketing: '#F59E0B',
  other: '#6B7280',
};

export default function OzonListPage() {
  const [reports, setReports] = useState<any[]>([]);

  function loadReports() {
    fetch('/admin/api/ozon')
      .then((r) => r.json())
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => {});
  }

  useEffect(() => { loadReports(); }, []);

  async function handleDelete(id: number) {
    if (!confirm('确定删除这个月度报告？')) return;
    await fetch(`/admin/api/ozon?id=${id}`, { method: 'DELETE' });
    loadReports();
  }

  // 汇总
  const totalSalesRub = reports.reduce((s, r) => s + (r.salesRevenue || 0), 0);
  const totalSalesRmb = reports.reduce((s, r) => s + ((r.salesRevenue || 0) * (r.exchangeRate || 0.08)), 0);
  const totalOzonNetRmb = reports.reduce((s, r) => s + (r.ozonNetRmb || 0), 0);
  const totalProfit = reports.reduce((s, r) => s + (r.netProfit || 0), 0);
  const totalCost = reports.reduce((s, r) => s + (r.totalAdditionalCost || 0), 0);

  // 图表数据：按月份排序
  const sorted = [...reports].sort((a, b) => a.month.localeCompare(b.month));

  const barData = sorted.map((r) => {
    const rate = r.exchangeRate || 0.08;
    return {
      month: r.month?.slice(5) || r.month,
      '销售额': Math.round((r.salesRevenue || 0) * rate),
      'Ozon净收入': Math.round(r.ozonNetRmb || 0),
      '净利润': Math.round(r.netProfit || 0),
    };
  });

  const ratioData = sorted.map((r) => {
    const rate = r.exchangeRate || 0.08;
    const sRmb = (r.salesRevenue || 0) * rate;
    const pfRmb = Math.max(0, ((r.salesRevenue || 0) - (r.ozonNetRub || 0)) * rate);
    return {
      month: r.month?.slice(5) || r.month,
      '平台费用': sRmb > 0 ? +(pfRmb / sRmb * 100).toFixed(1) : 0,
      '采购成本': sRmb > 0 ? +((r.purchaseCost || 0) / sRmb * 100).toFixed(1) : 0,
      '运费': sRmb > 0 ? +((r.shippingCost || 0) / sRmb * 100).toFixed(1) : 0,
      '人工': sRmb > 0 ? +((r.laborCost || 0) / sRmb * 100).toFixed(1) : 0,
      '营销': sRmb > 0 ? +((r.marketingCost || 0) / sRmb * 100).toFixed(1) : 0,
      '其他': sRmb > 0 ? +((r.otherCost || 0) / sRmb * 100).toFixed(1) : 0,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ozon 利润测算</h1>
          <p className="text-gray-500 text-sm mt-1">月度利润分析与成本核算</p>
        </div>
        <Link
          href="/admin/ozon/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
        >
          <Plus size={18} /> 新增月度报告
        </Link>
      </div>

      {/* 汇总卡片 */}
      {reports.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">累计销售额</p>
            <p className="text-sm text-gray-400">₽{totalSalesRub.toLocaleString()}</p>
            <p className="text-2xl font-bold text-gray-900">¥{Math.round(totalSalesRmb).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">累计Ozon净收入</p>
            <p className={`text-2xl font-bold ${totalOzonNetRmb >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ¥{Math.round(totalOzonNetRmb).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">累计额外成本</p>
            <p className="text-2xl font-bold text-orange-600">¥{Math.round(totalCost).toLocaleString()}</p>
          </div>
          <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${totalProfit >= 0 ? 'border-green-200' : 'border-red-200'}`}>
            <p className="text-sm text-gray-500">累计净利润</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{Math.round(totalProfit).toLocaleString()}
            </p>
            <p className={`text-xs ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              利润率 {totalSalesRmb > 0 ? ((totalProfit / totalSalesRmb) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
        </div>
      )}

      {/* 图表区 */}
      {reports.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* 月度对比柱状图 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">📊 月度收入/利润对比 (RMB)</h3>
            <p className="text-xs text-gray-400 mb-4">直观对比各月销售额、Ozon净收入和净利润</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip formatter={(v: any) => `¥${Number(v).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="销售额" fill={COLORS.sales} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Ozon净收入" fill={COLORS.ozonNet} radius={[6, 6, 0, 0]} />
                <Bar dataKey="净利润" fill={COLORS.profit} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 成本费比走势 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">📈 各项成本费比走势 (%)</h3>
            <p className="text-xs text-gray-400 mb-4">各成本项占销售额百分比，发现哪项侵蚀利润</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ratioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
                <Legend />
                <Line type="monotone" dataKey="平台费用" stroke={COLORS.platform} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="采购成本" stroke={COLORS.purchase} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="运费" stroke={COLORS.shipping} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="人工" stroke={COLORS.labor} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="营销" stroke={COLORS.marketing} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="其他" stroke={COLORS.other} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 报告列表 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
                <th className="px-4 py-3">月份</th>
                <th className="px-4 py-3">销售额 (卢布)</th>
                <th className="px-4 py-3">销售额 (RMB)</th>
                <th className="px-4 py-3">Ozon净收入</th>
                <th className="px-4 py-3">额外成本</th>
                <th className="px-4 py-3">净利润</th>
                <th className="px-4 py-3">利润率</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                  暂无报告。点击「新增月度报告」开始记录。
                </td></tr>
              ) : (
                reports.map((r) => {
                  const salesRmb = (r.salesRevenue || 0) * (r.exchangeRate || 0.08);
                  return (
                    <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4 font-semibold text-gray-900">{r.month}</td>
                      <td className="px-4 py-4 text-sm">₽{(r.salesRevenue || 0).toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm">¥{Math.round(salesRmb).toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`font-semibold ${(r.ozonNetRmb || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          ¥{Math.round(r.ozonNetRmb || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">¥{Math.round(r.totalAdditionalCost || 0).toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-sm ${(r.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(r.netProfit || 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          ¥{Math.round(r.netProfit || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-semibold ${(r.profitMargin || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(r.profitMargin || 0).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/ozon/${r.id}`} className="text-indigo-600 hover:text-indigo-700 text-sm" title="查看详情">
                            <Eye size={15} />
                          </Link>
                          <Link href={`/admin/ozon/${r.id}`} className="text-blue-600 hover:text-blue-700 text-sm" title="编辑">
                            <Pencil size={14} />
                          </Link>
                          <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 text-sm" title="删除">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
