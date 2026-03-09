'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Megaphone,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface BusinessLayoutProps {
  children: React.ReactNode;
}

const BUSINESS_MENU = [
  { label: 'Dashboard', href: '/isletme-paneli', icon: LayoutDashboard },
  { label: 'İstatistikler', href: '/isletme-paneli/istatistikler', icon: BarChart3 },
  { label: 'Reklamlar', href: '/isletme-paneli/reklamlar', icon: Megaphone },
];

export default function BusinessLayout({ children }: BusinessLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#e6f4ec]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-[#004d24] to-green-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#005a2b]">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-[#34d399]">KomşuApp</h1>
                <p className="text-xs text-[#00a24d] mt-1">İşletme Paneli</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-[#005a2b] rounded transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Business Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-[#005a2b] bg-[#005a2b]/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#00a24d] rounded-full flex items-center justify-center text-[#004d24] font-bold text-lg">
                K
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">Kahvehane Keyif</p>
                <p className="text-xs text-[#34d399]">Aktif</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {BUSINESS_MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#00833e] text-white'
                    : 'text-[#d1fae5] hover:bg-[#005a2b]'
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
        <div className="p-4 border-t border-[#005a2b] space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#d1fae5] hover:bg-[#005a2b] rounded-lg transition-colors">
            <Settings size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Ayarlar</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#d1fae5] hover:bg-red-900 rounded-lg transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Çıkış</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#a7dbb8] px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">İşletme Paneli</h2>
            <p className="text-sm text-gray-600 mt-1">
              İşletmenizi yönetin ve istatistiklerini izleyin
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-[#d1fae5] hover:bg-[#a7dbb8] text-[#006b32] rounded-lg font-medium text-sm transition-colors">
              İşletmemi Görüntüle
            </button>
            <div className="w-10 h-10 bg-[#a7dbb8] rounded-full flex items-center justify-center text-[#006b32] font-bold">
              K
            </div>
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
