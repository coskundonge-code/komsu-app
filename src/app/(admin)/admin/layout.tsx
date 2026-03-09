'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  MapPin,
  Flag,
  Megaphone,
  FileText,
  LogOut,
  Settings,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const ADMIN_MENU = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Kullanıcılar', href: '/admin/kullanicilar', icon: Users },
  { label: 'Mahalleler', href: '/admin/mahalleler', icon: MapPin },
  { label: 'Moderasyon', href: '/admin/moderasyon', icon: Flag },
  { label: 'Reklamlar', href: '/admin/reklamlar', icon: Megaphone },
  { label: 'Raporlar', href: '/admin/raporlar', icon: FileText },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-emerald-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-emerald-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-emerald-300">KomşuApp</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-emerald-800 rounded transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {sidebarOpen && (
            <p className="text-xs text-emerald-400 mt-2">Yönetici Paneli</p>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {ADMIN_MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-100 hover:bg-emerald-800'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-emerald-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-emerald-100 hover:bg-emerald-800 rounded-lg transition-colors">
            <Settings size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Ayarlar</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-emerald-100 hover:bg-red-900 rounded-lg transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Çıkış</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Yönetim Paneli</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
