'use client';

import { User, Bell, Lock, MapPin, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const settingsNavigation = [
  { name: 'Hesap', href: '/ayarlar', icon: User },
  { name: 'Bildirimler', href: '/ayarlar/bildirimler', icon: Bell },
  { name: 'Gizlilik ve Güvenlik', href: '/ayarlar/gizlilik', icon: Lock },
  { name: 'Mahalle Ayarları', href: '/ayarlar/mahalle', icon: MapPin },
];

export default function SettingsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/giris');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold mb-4">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <nav className="flex flex-col">
                {settingsNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href === '/ayarlar' && pathname === '/ayarlar');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-4 border-l-4 transition-colors ${
                        isActive
                          ? 'bg-[#e6f4ec] border-l-[#00833e] text-[#00833e]'
                          : 'border-l-transparent text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 border-l-4 border-l-transparent text-red-600 hover:bg-red-50 transition-colors text-left">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Çıkış Yap</span>
                </button>
              </nav>
            </div>

            {/* Help Section */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3">Yardım ve Destek</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sorunuz mu var? Tıklayarak cevaplar bulabilirsiniz.
              </p>
              <button className="w-full px-4 py-2 border border-[#00833e] text-[#00833e] rounded-lg font-medium hover:bg-[#e6f4ec] transition-colors">
                Yardım Merkezi
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
