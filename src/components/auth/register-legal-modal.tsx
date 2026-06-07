'use client'

import { X } from 'lucide-react'

export type LegalModalType = 'terms' | 'privacy'

interface RegisterLegalModalProps {
  open: boolean
  type: LegalModalType
  onClose: () => void
}

/**
 * Kayıt formundaki "Kullanım Koşulları / Gizlilik Politikası" açılır penceresi.
 *
 * Yalnız sunum: açık/kapalı durumu ve hangi metnin gösterileceği kayıt sayfası
 * (kayit/page.tsx) tarafından yönetilir; burada yan etki yoktur. God-file'dan
 * ayrıldı (TECH_DEBT #6) — sayfa inceldi, içerik tek yerde.
 *
 * Not: Buradaki özet metin yalnız onay kutusu içindir; tam/yasal sürümler
 * /kosullar ve /gizlilik sayfalarındadır (avukat onayı bekleyen kaynak metin).
 */
export function RegisterLegalModal({ open, type, onClose }: RegisterLegalModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">
            {type === 'terms' ? 'Kullanım Koşulları' : 'Gizlilik Politikası'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-full transition">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        {/* Modal body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm text-text-secondary leading-relaxed space-y-4">
          {type === 'terms' ? (
            <>
              <p><strong>1. Genel</strong></p>
              <p>Bu kullanım koşulları, Mahallemiz uygulamasının kullanımına ilişkin kuralları belirler. Uygulamayı kullanarak bu koşulları kabul etmiş sayılırsınız.</p>
              <p><strong>2. Hesap Oluşturma</strong></p>
              <p>Hesap oluşturmak için gerçek kimlik bilgilerinizi kullanmanız gerekmektedir. Yanlış veya yanıltıcı bilgi veren hesaplar askıya alınabilir.</p>
              <p><strong>3. Kullanım Kuralları</strong></p>
              <p>Uygulama yalnızca yasal amaçlarla kullanılabilir. Diğer kullanıcılara zarar verecek, taciz edici veya kötü niyetli içerik paylaşımı yasaktır.</p>
              <p><strong>4. İçerik Sorumluluğu</strong></p>
              <p>Paylaştığınız tüm içeriklerden siz sorumlusunuz. Mahallemiz, kullanıcı içeriklerini denetleme hakkını saklı tutar.</p>
              <p><strong>5. Hesap Sonlandırma</strong></p>
              <p>Kullanım koşullarını ihlal eden hesaplar uyarı yapılmaksızın sonlandırılabilir.</p>
              <p><strong>6. Değişiklikler</strong></p>
              <p>Bu koşullar önceden haber verilmeksizin güncellenebilir. Güncellemeler uygulama üzerinden duyurulacaktır.</p>
            </>
          ) : (
            <>
              <p><strong>1. Veri Toplama</strong></p>
              <p>Mahallemiz, hesap oluşturma sırasında ad, soyad, e-posta adresi, TC Kimlik No ve konum bilgilerinizi toplar.</p>
              <p><strong>2. Veri Kullanımı</strong></p>
              <p>Toplanan veriler yalnızca hizmet sunumu, mahalle eşleştirmesi ve güvenlik doğrulaması amacıyla kullanılır.</p>
              <p><strong>3. Veri Güvenliği</strong></p>
              <p>Tüm kişisel veriler SSL şifreleme ile korunur ve güvenli sunucularda saklanır. Verileriniz üçüncü taraflarla paylaşılmaz.</p>
              <p><strong>4. KVKK Hakları</strong></p>
              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında verilerinize erişim, düzeltme ve silme haklarına sahipsiniz.</p>
              <p><strong>5. Çerezler</strong></p>
              <p>Uygulama, oturum yönetimi için gerekli çerezleri kullanır. Analitik çerezler yalnızca onayınızla etkinleştirilir.</p>
              <p><strong>6. İletişim</strong></p>
              <p>Gizlilik ile ilgili sorularınız için destek@mahallemiz.com adresine e-posta gönderebilirsiniz.</p>
            </>
          )}
        </div>
        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl text-sm transition"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  )
}
