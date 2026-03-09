'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Megaphone,
  Store,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';

interface BusinessLayoutProps {
  children: React.ReactNode;
}

const BUSINESS_MENU = [
  { label: 'Dashboard', href: '/isletme-paneli', icon: LayoutDashboard },
  { label: 'İstatistikler', href: '/isletme-paneli/istatistikler', icon: BarChart3 },
  { label: 'Yorumlar', href: '/isletme-paneli/yorumlar', icon: MessageSquare },
  { label: 'Reklamlar', href: '/isletme-paneli/reklamlar', icon: Megaphone },
  { label: 'İşletme Profili', href: '/isletme-paneli/profil', icon: Store },
  { label: 'Ayarlar', href: '/isletme-paneli/ayarlar', icon: Settings },
];

export default function BusinessLayout({ children }: BusinessLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white text-[#333] transition-all duration-300 flex flex-col overflow-hidden border-r border-[#e0e0e0] shadow-sm`}
      >
        {/* Logo & Branding */}
        <div className="p-4 border-b border-[#e0e0e0] bg-gradient-to-r from-[#00833e] to-[#006b32]">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white">KomşuApp</h1>
                <p className="text-xs text-[#d1fae5] mt-1">İşletme Paneli</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-[#006b32] rounded-md transition-colors text-white"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Business Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-[#e0e0e0] bg-[#f0f2f5]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
                K
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#333] line-clamp-1">Kahvehane Keyif</p>
                <p className="text-xs text-[#00833e] font-medium mt-0.5">Aktif</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {BUSINESS_MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00833e] text-white shadow-sm'
                    : 'text-[#404040] hover:bg-[#f0f2f5]'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="p-4 border-t border-[#e0e0e0] space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[#404040] hover:bg-[#f0f2f5]`}
            title={!sidebarOpen ? 'Ana Sayfaya Dön' : ''}
          >
            <Home size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Ana Sayfaya Dön</span>}
          </Link>
          <button
            onClick={() => {
              /* Logout handler */
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#404040] hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            title={!sidebarOpen ? 'Çıkış Yap' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Çıkış Yap</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#e0e0e0] px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#333]">İşletme Paneli</h2>
            <p className="text-sm text-[#8f8f8f] mt-1">
              İşletmenizi yönetin ve istatistiklerini izleyin
            </p>
          </div>
          <div className="flex items-center gap-4 ml-8">
            <Link
              href="/isletmeler/kahvehane-keyif"
              className="px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white rounded-lg font-medium text-sm transition-colors duration-200 shadow-sm"
            >
              İşletme Sayfasını Gör
            </Link>
            <div className="w-10 h-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              K
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#f0f2f5]">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
