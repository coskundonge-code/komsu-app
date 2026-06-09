'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { reportClientError } from '@/lib/utils/report-client-error';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportClientError(error, { boundary: 'admin-error' });
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={48} className="text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Yönetici Paneli Hatası</h1>
        <p className="text-gray-600 mb-6">
          Bu sayfada beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
        </p>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <summary className="cursor-pointer font-semibold text-gray-700">Hata Detayları</summary>
            <pre className="mt-3 text-xs text-gray-600 overflow-auto max-h-48 bg-white p-3 rounded border">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            <RefreshCw size={20} />
            <span>Tekrar Dene</span>
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            <Home size={20} />
            <span>Admin Paneline Dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
