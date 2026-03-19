'use client';

import { useState } from 'react';
import { Shield, CheckCircle2, AlertCircle, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UseReferralPage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.trim().length < 6) {
      setErrorMsg('Lütfen geçerli bir referans kodu girin.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo: KOMSU ile başlayan kodları kabul et
    if (code.toUpperCase().startsWith('KOMSU')) {
      setStatus('success');
    } else {
      setErrorMsg('Bu referans kodu geçersiz veya süresi dolmuş. Lütfen kontrol edip tekrar deneyin.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-surface rounded-2xl border border-border p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-3">Tebrikler! Doğrulandınız</h1>
            <p className="text-[#666] mb-2">
              Referans kodu başarıyla kullanıldı. Hesabınız artık doğrulanmış olarak işaretlendi.
            </p>
            <p className="text-sm text-text-muted mb-6">
              Adres doğrulaması yapmanıza gerek kalmadı. Tüm Mahallem özelliklerini kullanabilirsiniz.
            </p>
            <div className="bg-primary-light border border-primary rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-primary text-sm">Referansla Doğrulanmış Komşu</p>
                  <p className="text-xs text-[#666]">Hesabınız güvenilir bir komşu tarafından onaylanmıştır.</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors text-center"
              >
                Ana Sayfaya Git
              </Link>
              <Link
                href="/davet"
                className="flex-1 px-6 py-3 bg-surface border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-light transition-colors text-center"
              >
                Sen de Davet Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back Link */}
        <Link href="/" className="text-primary hover:text-primary-hover font-medium mb-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>

        {/* Header */}
        <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm mb-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Referans Kodu Kullan</h1>
            <p className="text-[#666]">
              Komşunuzdan aldığınız referans kodunu girin ve adres doğrulama adımını atlayarak hemen Mahallem&apos;ı kullanmaya başlayın.
            </p>
          </div>

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="referral-code" className="block text-sm font-semibold text-text-primary mb-2">
                Referans Kodu
              </label>
              <input
                id="referral-code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Örn: KOMSU8K4F2A"
                className={`w-full px-4 py-3.5 border-2 rounded-xl text-lg font-mono tracking-widest text-center focus:outline-none transition-colors ${
                  status === 'error'
                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                    : 'border-border focus:border-primary bg-[#f9f9f9] focus:bg-surface'
                }`}
                maxLength={15}
                autoComplete="off"
              />
              {status === 'error' && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{errorMsg}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || code.trim().length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Kodu Kullan ve Doğrulan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-primary mb-2">Referans kodu nedir?</h3>
            <p className="text-sm text-[#666]">
              Mahallem&apos;taki mevcut bir komşunuzun size verdiği özel koddur. Bu kod ile adres doğrulama adımını atlar, hemen sisteme dahil olursunuz.
            </p>
          </div>

          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-primary mb-2">Referans kodum yok, ne yapmalıyım?</h3>
            <p className="text-sm text-[#666] mb-3">
              Referans kodunuz yoksa e-Devlet aracılığıyla adresinizi doğrulayabilirsiniz. Bu işlem tamamen ücretsizdir.
            </p>
            <Link
              href="/adres-dogrulama"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
            >
              <Shield className="w-4 h-4" />
              e-Devlet ile Doğrula →
            </Link>
          </div>

          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-primary mb-2">Doğrulandıktan sonra ne olur?</h3>
            <p className="text-sm text-[#666]">
              Hesabınız &quot;Referansla Doğrulanmış&quot; olarak işaretlenir. Tüm özellikleri kullanabilir, paylaşım yapabilir ve komşularınızla iletişime geçebilirsiniz. Siz de 3 kişiye kadar davet gönderebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
