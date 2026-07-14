'use client';
import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Star, ShieldCheck, Truck, Zap } from 'lucide-react';
import { heroContent } from '@/data/content';
import { product, discount } from '@/data/product';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Column */}
          <div>
            <Badge variant="warning" className="mb-4 text-sm px-3 py-1.5">
              {heroContent.badge}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {heroContent.headline}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {heroContent.subheadline}
            </p>
            {/* Price Display */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-extrabold text-indigo-600">
                ${product.price}
              </span>
              <div className="flex flex-col">
                <span className="text-xl text-gray-400 line-through">
                  ${product.compareAtPrice}
                </span>
                <Badge variant="danger">{discount.label}</Badge>
              </div>
            </div>
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button href="/checkout" variant="secondary" size="lg">
                🔥 Get Yours Now — {discount.label}
              </Button>
              <Button href="#features" variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            {/* Trust banner */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> 4.8/5 Stars</span>
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500" /> 60-Day Guarantee</span>
              <span className="flex items-center gap-1"><Truck size={14} /> Free Shipping $50+</span>
            </div>
          </div>
          {/* Image Column */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-9xl">❄️</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <Zap className="text-yellow-500" size={20} />
              <div>
                <p className="font-bold text-sm">Cools in 3 min</p>
                <p className="text-xs text-gray-500">Up to 15°F drop</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full px-4 py-2 shadow-lg text-sm font-bold animate-pulse">
              🔥 {discount.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
