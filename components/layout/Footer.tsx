import React from 'react';
import Link from 'next/link';
import { Shield, CreditCard, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-8 mb-12 pb-12 border-b border-gray-800">
          {[
            { icon: Shield, title: '60-Day Guarantee', desc: 'Full refund if not satisfied' },
            { icon: Lock, title: 'Secure Checkout', desc: 'SSL encrypted · Your data is safe' },
            { icon: CreditCard, title: 'Secure Payment', desc: 'Powered by Stripe · All major cards' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <item.icon className="mx-auto mb-3 text-indigo-400" size={28} />
              <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h5 className="font-semibold mb-3">Product</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Support</h5>
            <ul className="space-y-2 text-gray-400">
              <li><span>Contact Us</span></li>
              <li><span>Shipping Policy</span></li>
              <li><span>Return Policy</span></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Legal</h5>
            <ul className="space-y-2 text-gray-400">
              <li><span>Privacy Policy</span></li>
              <li><span>Terms of Service</span></li>
              <li><span>Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-800">
          <span className="text-gray-400 text-xs">We accept:</span>
          <span className="text-lg">💳</span>
          <span className="text-gray-500 text-xs">Visa · Mastercard · Amex · UnionPay</span>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">
          © {new Date().getFullYear()} AirVela. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
