'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  MapPin,
  Shield,
  Megaphone,
  BarChart3,
  LogOut,
  Settings,
  MessageSquare,
  Users2,
  Store,
  CreditCard,
  CheckCircle2,
  Bell,
  Star,
  ShoppingBag,
  Lock,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const ADMIN_MENU = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Kullanıcılar', href: '/admin/kullanicilar', icon: Users },
  { label: 'Mahalleler', href: '/admin/mahalleler', icon: MapPin },
  { label: 'Gönderiler', href: '/admin/gonderiler', icon: MessageSquare },
  { label: 'Gruplar', href: '/admin/gruplar', icon: Users2 },
  { label: 'İşletmeler', href: '/admin/isletmeler', icon: Store },
  { label: 'Ödemeler', href: '/admin/odemeler', icon: CreditCard },
  { label: 'Doğrulama', href: '/admin/dogrulama', icon: CheckCircle2 },
  { label: 'Bildirimler', href: '/admin/bildirimler', icon: Bell },
  { label: 'Yorumlar', href: '/admin/yorumlar', icon: Star },
  { label: 'İlanlar', href: '/admin/ilanlar', icon: ShoppingBag },
  { label: 'Moderasyon', href: '/admin/moderasyon', icon: Shield },
  { label: 'Reklamlar', href: '/admin/reklamlar', icon: Megaphone },
  { label: 'Raporlar', href: '/admin/raporlar', icon: BarChart3 },
  { label: 'Güvenlik', href: '/admin/guvenlik', icon: Lock },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/giris');
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } fixed lg:relative h-screen bg-[#004d24] text-white transition-all duration-300 flex flex-col overflow-hidden z-50 lg:z-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#006b32]">
          <div className="flex items-center justify-between gap-2">
            {sidebarOpen && (
              <div className="flex-1">
                <h1 className="text-lg font-bold text-[#00833e]">KomşuApp</h1>
                <p className="text-xs text-[#a7dbb8] mt-1">Yönetici Paneli</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#006b32] rounded-lg transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADMIN_MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#00833e] text-white shadow-md'
                    : 'text-[#d1fae5] hover:bg-[#006b32]'
                }`}
                title={!sidebarOpen ? item.label : ''}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#006b32] space-y-1">
          <Link
            href="/admin/ayarlar"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === '/admin/ayarlar'
                ? 'bg-[#00833e] text-white'
                : 'text-[#d1fae5] hover:bg-[#006b32]'
            }`}
            title={!sidebarOpen ? 'Ayarlar' : ''}
          >
            <Settings size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Ayarlar</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#d1fae5] hover:bg-red-700 rounded-lg transition-colors"
            title={!sidebarOpen ? 'Çıkış' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Çıkış</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#e0e0e0] px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} className="text-[#333]" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-[#333]">Yönetim Paneli</h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 bg-[#00833e] rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="hidden sm:inline text-sm font-medium text-[#404040]">Admin User</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
