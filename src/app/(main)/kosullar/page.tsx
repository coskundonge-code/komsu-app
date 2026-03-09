'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-4">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] p-8">
          <h1 className="text-3xl font-bold text-[#333] mb-2">Kullanım Koşulları</h1>
          <p className="text-sm text-[#8f8f8f] mb-8">Son güncelleme: 1 Mart 2026</p>

          <div className="prose prose-sm max-w-none text-[#404040] space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#333]">1. Hizmet Tanımı</h2>
              <p>KomşuApp, komşuların birbirleriyle bağlantı kurmasını, bilgi paylaşmasını ve yerel toplulukları güçlendirmesini sağlayan bir sosyal platformdur.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">2. Hesap Oluşturma</h2>
              <p>Hizmetlerimizi kullanmak için gerçek kimliğinizle bir hesap oluşturmanız gerekmektedir. Adres doğrulaması zorunludur ve yalnızca doğrulanmış kullanıcılar mahalleleriyle etkileşime girebilir.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">3. Kullanım Kuralları</h2>
              <p>Platform üzerinde saygılı ve yapıcı bir şekilde iletişim kurmanız beklenmektedir. Nefret söylemi, taciz, spam ve yanıltıcı bilgi paylaşımı yasaktır.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">4. İçerik Politikası</h2>
              <p>Paylaştığınız içeriklerden siz sorumlusunuz. Telif hakkı ihlali içeren, yasadışı veya zararlı içerikler kaldırılacaktır.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">5. Fikri Mülkiyet</h2>
              <p>KomşuApp platformu, tasarımları ve markası Trendex Lojistik&apos;e aittir. Platformda paylaştığınız içeriklerin fikri mülkiyeti size ait olmaya devam eder.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">6. Hesap Feshi</h2>
              <p>Kullanım koşullarını ihlal eden hesaplar uyarılabilir, askıya alınabilir veya kalıcı olarak kapatılabilir.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
