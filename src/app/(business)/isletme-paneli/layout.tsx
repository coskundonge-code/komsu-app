'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
  { label: 'İndirimler', href: '/isletme-paneli/indirimler', icon: Store },
  { label: 'Üyelik', href: '/isletme-paneli/uyelik', icon: Settings },
];

// NOT (2026-06-07): Bu layout eskiden her panel sayfasında SABİT "Kahvehane Keyif"
// işletme adını, "K" avatarını ve /isletmeler/kahvehane-keyif bağlantısını gösteriyordu
// (giriş yapan sahip kim olursa olsun). Artık giriş yapan kullanıcının GERÇEK işletmesine
// bağlı: ad, slug ve doğrulanma durumu canlı `businesses` kaydından gelir. Bkz. TECH_DEBT #12.

interface PanelBusiness {
  name: string;
  slug: string;
  logoUrl: string | null;
  isVerified: boolean;
}

export default function BusinessLayout({ children }: BusinessLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [business, setBusiness] = useState<PanelBusiness | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient() as any;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled || !user) return;
      const { data } = await supabase
        .from('businesses')
        .select('name, slug, logo_url, is_verified')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (cancelled || !data) return;
      setBusiness({
        name: data.name,
        slug: data.slug,
        logoUrl: data.logo_url || null,
        isVerified: !!data.is_verified,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const initial = business?.name?.charAt(0)?.toUpperCase() || 'İ';

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/giris');
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-surface text-text-primary transition-all duration-300 flex flex-col overflow-hidden border-r border-border shadow-sm`}
      >
        {/* Logo & Branding */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary to-primary-hover">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white">Mahallemiz</h1>
                <p className="text-xs text-[#d1fae5] mt-1">İşletme Paneli</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-primary-hover rounded-md transition-colors text-white"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Business Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-border bg-background">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text-primary line-clamp-1">
                  {business?.name || 'İşletmeniz'}
                </p>
                <p className="text-xs text-primary font-medium mt-0.5">
                  {business ? (business.isVerified ? 'Onaylı' : 'Onay bekliyor') : '—'}
                </p>
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
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-surface-hover'
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
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-text-secondary hover:bg-surface-hover`}
            title={!sidebarOpen ? 'Ana Sayfaya Dön' : ''}
          >
            <Home size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Ana Sayfaya Dön</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
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
        <div className="bg-surface border-b border-border px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary">İşletme Paneli</h2>
            <p className="text-sm text-text-muted mt-1">
              İşletmenizi yönetin ve istatistiklerini izleyin
            </p>
          </div>
          <div className="flex items-center gap-4 ml-8">
            {business?.slug && (
              <Link
                href={`/isletmeler/${business.slug}`}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium text-sm transition-colors duration-200 shadow-sm"
              >
                İşletme Sayfasını Gör
              </Link>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {initial}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
