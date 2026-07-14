import React from 'react';
import { painPoints } from '@/data/content';

export function PainPoints() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4">
          {painPoints.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {painPoints.points.map((point, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300"
            >
              <span className="text-4xl mb-4 block">{point.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                {point.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
