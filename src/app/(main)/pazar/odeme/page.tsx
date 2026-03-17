'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { PaymentModal } from '@/components/marketplace/payment-modal';
import { PaymentType } from '@/lib/services/payment';

interface PaymentPageContentProps {
  searchParams: {
    type?: string;
    amount?: string;
    listingId?: string;
    title?: string;
  };
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<'initial' | 'processing' | 'success' | 'error'>(
    'initial'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const paymentType = searchParams.get('type') as PaymentType | null;
  const amount = parseInt(searchParams.get('amount') || '0');
  const listingId = searchParams.get('listingId');
  const title = decodeURIComponent(searchParams.get('title') || '');

  useEffect(() => {
    // Auto-open payment modal if we have all required params
    if (paymentType && amount && listingId) {
      setIsPaymentModalOpen(true);
    }
  }, [paymentType, amount, listingId]);

  // Determine description based on payment type
  const getDescription = (): string => {
    switch (paymentType) {
      case PaymentType.LISTING_FEE:
        return 'Ek ilanı yayınlamak için ödeme yapın.';
      case PaymentType.FEATURED_3DAYS:
        return 'İlanınızı 3 gün boyunca ön plana çıkart.';
      case PaymentType.FEATURED_7DAYS:
        return 'İlanınızı 7 gün boyunca ön plana çıkart.';
      case PaymentType.FEATURED_30DAYS:
        return 'İlanınızı 30 gün boyunca ön plana çıkart.';
      case PaymentType.BUSINESS_MONTHLY:
        return 'İşletme ilanı aylık paketini satın al.';
      default:
        return 'Ödeme yapın';
    }
  };

  // Determine title based on payment type
  const getTitle = (): string => {
    switch (paymentType) {
      case PaymentType.LISTING_FEE:
        return 'İlan Ücreti Öde';
      case PaymentType.FEATURED_3DAYS:
      case PaymentType.FEATURED_7DAYS:
      case PaymentType.FEATURED_30DAYS:
        return 'İlanı Ön Plana Çıkart';
      case PaymentType.BUSINESS_MONTHLY:
        return 'İşletme İlanı';
      default:
        return 'Ödeme';
    }
  };

  const handlePaymentSubmit = async (method: string) => {
    setPaymentState('processing');
    try {
      // Simulate payment processing (in real app, call payment API)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentState('success');

      // Redirect to listing after 2 seconds
      setTimeout(() => {
        if (listingId) {
          router.push(`/pazar/ilan/${listingId}`);
        } else {
          router.push('/pazar');
        }
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Ödeme işlemi başarısız oldu';
      setErrorMessage(errorMsg);
      setPaymentState('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Geri Dön</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

              {/* Item */}
              <div className="pb-6 border-b border-gray-200">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Ürün</p>
                    <p className="font-semibold text-gray-900">{getTitle()}</p>
                  </div>

                  {title && (
                    <div>
                      <p className="text-sm text-gray-600">İlan Başlığı</p>
                      <p className="font-semibold text-gray-900 truncate">{title}</p>
                    </div>
                  )}

                  {paymentType && (
                    <div>
                      <p className="text-sm text-gray-600">Açıklama</p>
                      <p className="font-semibold text-gray-900">{getDescription()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="pt-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="text-lg font-semibold text-gray-900">{amount}₺</span>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-gray-600">KDV</span>
                  <span className="text-lg font-semibold text-gray-900">0₺</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Toplam</span>
                  <span className="text-2xl font-bold text-[#00833e]">{amount}₺</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">
                    <span className="font-semibold">Güvenli Ödeme:</span> Tüm işlemler 256-bit
                    SSL şifrelemesi ile korunur.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-900">
                    <span className="font-semibold">Geri İade Garantisi:</span> Memnun değilseniz
                    7 gün içinde geri iade yapabiliriz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment States */}
          <div>
            {paymentState === 'initial' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Ödeme Yöntemi</h2>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg text-left hover:border-[#00833e] hover:bg-green-50 transition-all group"
                  >
                    <p className="font-semibold text-gray-900 group-hover:text-[#00833e]">
                      Kredi/Banka Kartı
                    </p>
                    <p className="text-sm text-gray-600">Anında ödeme</p>
                  </button>

                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg text-left hover:border-[#00833e] hover:bg-green-50 transition-all group"
                  >
                    <p className="font-semibold text-gray-900 group-hover:text-[#00833e]">
                      Havale / EFT
                    </p>
                    <p className="text-sm text-gray-600">Banka hesabına aktarım</p>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <label className="flex items-start gap-2 text-xs text-gray-600">
                    <input type="checkbox" defaultChecked className="mt-1" />
                    <span>
                      <a href="#" className="text-[#00833e] hover:underline font-semibold">
                        Şartları ve Koşulları
                      </a>{' '}
                      kabul ediyorum.
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full mt-6 py-3 px-4 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b2f] transition-colors"
                >
                  Ödemeye Devam Et
                </button>
              </div>
            )}

            {paymentState === 'processing' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Loader2 className="w-12 h-12 text-[#00833e] animate-spin" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Ödemeniz işleniyor...
                </p>
                <p className="text-gray-600">Lütfen sayfayı kapatmayın</p>
              </div>
            )}

            {paymentState === 'success' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Ödeme Başarılı!</p>
                <p className="text-gray-600 mb-4">İlanınız hazırlanıyor...</p>
                <p className="text-sm text-gray-500">Birazdan yönlendirileceksiniz</p>
              </div>
            )}

            {paymentState === 'error' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Ödeme Başarısız</p>
                    <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPaymentState('initial');
                    setErrorMessage('');
                  }}
                  className="w-full mt-4 py-2 px-4 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b2f] transition-colors"
                >
                  Tekrar Deneyin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        title={getTitle()}
        description={getDescription()}
        amount={amount}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        isLoading={paymentState === 'processing'}
      />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
