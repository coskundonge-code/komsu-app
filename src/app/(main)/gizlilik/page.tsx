'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-4">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] p-8">
          <h1 className="text-3xl font-bold text-[#333] mb-2">Gizlilik Politikası</h1>
          <p className="text-sm text-[#8f8f8f] mb-8">Son güncelleme: 1 Mart 2026</p>

          <div className="prose prose-sm max-w-none text-[#404040] space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#333]">1. Toplanan Bilgiler</h2>
              <p>KomşuApp, hizmetlerimizi sunmak ve iyileştirmek amacıyla belirli kişisel bilgilerinizi toplar. Bunlar arasında adınız, e-posta adresiniz, telefon numaranız ve adres bilgileriniz yer alır.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">2. Bilgi Kullanımı</h2>
              <p>Topladığımız bilgileri hesabınızı oluşturmak, sizi doğru mahalleye atamak, kişiselleştirilmiş içerik sunmak ve güvenliğinizi sağlamak için kullanırız.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">3. Bilgi Paylaşımı</h2>
              <p>Kişisel bilgilerinizi üçüncü taraflarla paylaşmayız. Mahalle sakinleri yalnızca profilinizde herkese açık olarak belirlediğiniz bilgileri görebilir.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">4. Veri Güvenliği</h2>
              <p>Verilerinizi korumak için endüstri standartlarında güvenlik önlemleri kullanıyoruz. Tüm veriler şifrelenerek saklanır ve iletilir.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">5. Haklarınız</h2>
              <p>Kişisel verilerinize erişme, düzeltme veya silme hakkına sahipsiniz. Bu haklarınızı kullanmak için ayarlar sayfasından veya destek ekibimize başvurarak talepte bulunabilirsiniz.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#333]">6. İletişim</h2>
              <p>Gizlilik politikamız hakkında sorularınız varsa, destek ekibimize mesaj gönderebilirsiniz.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
