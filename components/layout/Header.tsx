import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ShieldCheck, Truck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-center py-1.5 px-4 text-sm font-medium">
        🔥 Summer Sale — 30% OFF Today Only + Free Shipping Over $50
      </div>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/article" className="flex items-center gap-2">
          <span className="text-2xl">❄️</span>
          <span className="text-xl font-bold text-gray-900">AirVela</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            Features
          </Link>
          <Link href="#reviews" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            Reviews
          </Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/checkout" variant="primary" size="sm">
            Buy Now — $49.99
          </Button>
        </div>
      </div>
      {/* Trust bar */}
      <div className="bg-gray-50 border-t border-gray-100 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1"><ShieldCheck size={14} /> 60-Day Guarantee</span>
          <span className="flex items-center gap-1"><Truck size={14} /> Free Shipping $50+</span>
          <span>⭐⭐⭐⭐⭐ 4.8/5 from 50,000+ reviews</span>
        </div>
      </div>
    </header>
  );
}
