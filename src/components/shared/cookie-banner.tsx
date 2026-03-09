'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e0e0e0] shadow-lg animate-in slide-in-from-bottom-4 duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Text Content */}
          <div className="flex-1">
            <p className="text-sm text-[#404040]">
              Bu web sitesi deneyiminizi iyileştirmek için çerezler kullanmaktadır.
              {' '}
              <Link
                href="/cerez-politikasi"
                className="text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Çerez Politikası
              </Link>
            </p>
          </div>

          {/* Button Group */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] font-medium transition-colors text-sm"
            >
              Kabul Et
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 sm:flex-none px-6 py-2 border border-[#e0e0e0] text-[#333] rounded-lg hover:bg-[#f0f2f5] font-medium transition-colors text-sm"
            >
              Ayarları Yönet
            </button>
            <button
              onClick={handleDismiss}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f0f2f5] transition-colors text-[#8f8f8f]"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
