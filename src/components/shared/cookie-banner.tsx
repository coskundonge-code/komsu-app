'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    setIsLoaded(true);
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleManageSettings = () => {
    localStorage.setItem('cookie-consent', 'custom');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isLoaded || !isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t-2 border-primary shadow-2xl transition-transform duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Çerez Kullanımı
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bu web sitesi deneyiminizi iyileştirmek için çerezler kullanmaktadır.
              {' '}
              <Link
                href="/cerez-politikasi"
                className="text-primary hover:text-primary-hover font-medium transition-colors underline"
              >
                Çerez Politikası
              </Link>
              {' '}
              hakkında daha fazla bilgi edinin.
            </p>
          </div>

          {/* Button Group */}
          <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium transition-colors text-sm shadow-md hover:shadow-lg"
            >
              Kabul Et
            </button>
            <button
              onClick={handleManageSettings}
              className="flex-1 sm:flex-none px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 font-medium transition-colors text-sm"
            >
              Ayarları Yönet
            </button>
            <button
              onClick={handleClose}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
