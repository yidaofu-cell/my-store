'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  Percent, Truck, Settings, BarChart3, LogOut,
  ChevronLeft, Menu, Store,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/discounts', label: 'Discounts', icon: Percent },
  { href: '/admin/shipping', label: 'Shipping', icon: Truck },
  { href: '/admin/ozon', label: 'Ozon Profit', icon: BarChart3 },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await fetch('/admin/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-gray-900 text-white flex flex-col transition-all duration-200 flex-shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <Store size={22} className="text-indigo-400" />
              <span className="font-bold text-sm">Store Admin</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white transition-colors">
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
          <Link href="/article" target="_blank" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <Store size={14} /> View Store ↗
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
