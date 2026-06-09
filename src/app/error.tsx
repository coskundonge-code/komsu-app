'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { reportClientError } from '@/lib/utils/report-client-error';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportClientError(error, { boundary: 'app-error' });
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f5] to-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Error Illustration */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Background circle with animation */}
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>

            {/* Icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle size={80} className="text-primary opacity-80 animate-bounce" />
            </div>

            {/* Decorative accent */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full opacity-60 animate-ping"></div>
          </div>
        </div>

        {/* Error Title */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Bir Hata Oluştu</h1>
          <p className="text-primary font-semibold text-lg">Beklenmeyen Bir Sorun</p>
        </div>

        {/* Error Description */}
        <div className="mb-8">
          <p className="text-gray-600 text-base mb-3">
            Üzgünüz, bir şeyler yanlış gitti. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
          </p>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && error?.message && (
            <details className="text-left mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                Hata Detayları (Geliştirme Modu)
              </summary>
              <pre className="mt-3 text-xs text-gray-600 overflow-auto max-h-48 bg-surface p-3 rounded border border-gray-200">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <RefreshCw size={20} />
            <span>Tekrar Dene</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-background transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <Home size={20} />
            <span>Ana Sayfaya Git</span>
          </Link>
        </div>

        {/* Support message */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Bu sorun devam ederse, lütfen{' '}
            <a
              href="mailto:support@mahallem.com"
              className="text-primary font-semibold hover:text-primary-hover underline transition-colors"
            >
              destek
            </a>
            {' '}ile iletişime geçin.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-3 opacity-40">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
