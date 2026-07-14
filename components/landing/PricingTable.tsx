import React from 'react';
import { pricingContent as defaultPricing } from '@/data/content';
import { product as defaultProduct } from '@/data/product';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function PricingTable({ product: dbProduct, data }: { product?: any; data?: any }) {
  const pp = data || defaultPricing;
  const p = dbProduct || defaultProduct;
  return (
    <section id="pricing" className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10">
          {pp.title}
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-400 line-through">
                    {pp.competitorLabel}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-indigo-600 bg-indigo-50">
                    ✅ {pp.productLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pp.rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 px-6 text-gray-700 font-medium">{row.label}</td>
                    <td className="text-center py-4 px-6 text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <X size={14} className="text-red-300" />
                        {row.competitor}
                      </span>
                    </td>
                    <td className="text-center py-4 px-6 bg-indigo-50/50">
                      <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                        <Check size={14} className="text-green-500" />
                        {row.ours}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-indigo-50">
                  <td className="py-5 px-6 text-lg font-bold text-gray-900">Price</td>
                  <td className="text-center py-5 px-6 text-gray-400 line-through text-lg">
                    ${pp.competitorPrice}
                  </td>
                  <td className="text-center py-5 px-6">
                    <span className="text-3xl font-extrabold text-indigo-600">${p.price?.toFixed(2)}</span>
                    <Badge variant="danger" className="ml-2">30% OFF</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center py-6 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500">
            <Button href="/checkout" variant="secondary" size="lg">
              🔥 Claim Your 30% Discount Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
