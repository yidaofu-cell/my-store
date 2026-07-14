import React from 'react';
import { Shield, RefreshCw, Lock, Truck } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    { icon: Shield, title: '60-Day Guarantee', desc: 'Full refund if not satisfied' },
    { icon: RefreshCw, title: 'Easy Returns', desc: 'Hassle-free 30-day returns' },
    { icon: Lock, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div key={badge.title} className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <badge.icon size={24} className="mx-auto mb-2 text-indigo-500" />
          <p className="font-semibold text-sm text-gray-900">{badge.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
}
