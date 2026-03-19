'use client';

import Link from 'next/link';
import { MapPin, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f5] to-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Background circle */}
            <div className="absolute inset-0 bg-primary bg-opacity-10 rounded-full animate-pulse"></div>

            {/* Icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Lost neighborhood icon illustration */}
                <svg
                  className="w-32 h-32 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {/* House */}
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />

                  {/* Question mark overlay */}
                  <circle cx="18" cy="8" r="3" fill="currentColor" opacity="0.6" />
                </svg>

                {/* Floating question mark */}
                <div className="absolute top-2 right-0 text-4xl font-bold text-primary opacity-70 animate-bounce">
                  ?
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-6">
          <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sayfa Bulunamadı</h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-2">
          Aradığınız sayfa maalesef bulunmamaktadır.
        </p>
        <p className="text-gray-500 text-base mb-8">
          Bir anlık kafa karışıklığı mı yaşadınız? Endişelenmeyin, başlıca sayfaya dönebilirsiniz.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Home size={20} />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-background transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} />
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-2 opacity-50">
          <MapPin size={20} className="text-primary animate-pulse" style={{ animationDelay: '0s' }} />
          <MapPin size={20} className="text-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
          <MapPin size={20} className="text-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
