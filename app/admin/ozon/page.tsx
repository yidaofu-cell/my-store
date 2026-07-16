'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, Pencil, TrendingUp, TrendingDown } from 'lucide-react';

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

  // 汇总计算
  const totalSalesRub = reports.reduce((s, r) => s + (r.salesRevenue || 0), 0);
  const totalSalesRmb = reports.reduce((s, r) => s + ((r.salesRevenue || 0) * (r.exchangeRate || 0.08)), 0);
  const totalOzonNetRmb = reports.reduce((s, r) => s + (r.ozonNetRmb || 0), 0);
  const totalProfit = reports.reduce((s, r) => s + (r.netProfit || 0), 0);
  const totalCost = reports.reduce((s, r) => s + (r.totalAdditionalCost || 0), 0);

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
