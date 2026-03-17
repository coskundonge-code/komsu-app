'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const promptDismissed = localStorage.getItem('pwa-install-dismissed');

    // Check if device is mobile
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    };

    setIsMobile(checkMobile());

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (!promptDismissed) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-dismissed', 'true');
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  // Only show on mobile devices and if app can be installed
  if (!isVisible || !isMobile || !deferredPrompt) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e0e0] shadow-md animate-in slide-in-from-top-2 duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Icon and Text */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#00833e] rounded-lg">
              <Download size={18} className="text-white" />
            </div>
            <p className="text-sm font-medium text-[#333]">
              KomşuApp'ı ana ekranına ekle!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] font-medium transition-colors text-sm whitespace-nowrap"
            >
              Yükle
            </button>
            <button
              onClick={handleDismiss}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f0f2f5] transition-colors text-[#8f8f8f]"
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
