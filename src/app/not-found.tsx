'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-full flex items-center justify-center mx-auto mb-6">
          <Search size={40} className="text-white" />
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-[#333] mb-2">404</h1>

        {/* Message */}
        <h2 className="text-xl font-bold text-[#333] mb-2">Sayfa Bulunamadı</h2>
        <p className="text-[#8f8f8f] mb-8">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors"
          >
            <Home size={18} />
            Ana Sayfaya Dön
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#e0e0e0] hover:bg-[#f0f2f5] text-[#333] font-medium rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Geri Git
          </button>
        </div>
      </div>
    </div>
  );
}
