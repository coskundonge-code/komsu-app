'use client';

import { useState } from 'react';
import { X, Loader2, Check, AlertCircle, CreditCard, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PaymentModalState = 'form' | 'processing' | 'success' | 'error';
export type PaymentMethodChoice = 'card' | 'transfer';

export interface PaymentModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  amount: number;
  currency?: string;
  onClose: () => void;
  onSubmit: (method: PaymentMethodChoice, paymentRef?: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  successMessage?: string;
}

export function PaymentModal({
  isOpen,
  title,
  description,
  amount,
  currency = '₺',
  onClose,
  onSubmit,
  isLoading = false,
  error,
  successMessage = 'Ödemeniz başarıyla tamamlandı!',
}: PaymentModalProps) {
  const [state, setState] = useState<PaymentModalState>('form');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodChoice>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [localError, setLocalError] = useState<string>('');

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof cardData
  ) => {
    let value = e.target.value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Format expiry
    if (field === 'expiryMonth') {
      value = value.replace(/\D/g, '').slice(0, 2);
    }
    if (field === 'expiryYear') {
      value = value.replace(/\D/g, '').slice(0, 2);
    }

    // CVV only numbers
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData((prev) => ({ ...prev, [field]: value }));
    setLocalError('');
  };

  const validateCardData = (): boolean => {
    if (selectedMethod === 'card') {
      if (!cardData.cardNumber || cardData.cardNumber.length < 19) {
        setLocalError('Geçerli bir kart numarası girin');
        return false;
      }
      if (!cardData.cardName.trim()) {
        setLocalError('Kart üzerindeki adı girin');
        return false;
      }
      if (!cardData.expiryMonth || !cardData.expiryYear) {
        setLocalError('Geçerlilik tarihini girin');
        return false;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        setLocalError('Geçerli bir CVV girin');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCardData()) {
      return;
    }

    setState('processing');
    try {
      await onSubmit(selectedMethod);
      setState('success');
      // Reset after 2 seconds
      setTimeout(() => {
        onClose();
        setState('form');
        setCardData({
          cardNumber: '',
          cardName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
        });
        setLocalError('');
      }, 2000);
    } catch (err) {
      setState('error');
      const errorMsg = err instanceof Error ? err.message : 'Bir hata oluştu';
      setLocalError(errorMsg);
    }
  };

  const displayError = error || localError;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            disabled={isLoading || state === 'processing'}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Description */}
          <div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Ödeme Tutarı</p>
            <p className="text-3xl font-bold text-[#00833e]">
              {amount}
              {currency}
            </p>
          </div>

          {/* Success State */}
          {state === 'success' && (
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                {successMessage}
              </p>
              <p className="text-sm text-gray-600">
                Birazdan sayfaya geri döneceksiniz
              </p>
            </div>
          )}

          {/* Processing State */}
          {state === 'processing' && (
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <Loader2 className="w-8 h-8 text-[#00833e] animate-spin" />
              </div>
              <p className="text-gray-900 font-semibold">Ödemeniz işleniyor...</p>
              <p className="text-sm text-gray-600">Lütfen bekleyin</p>
            </div>
          )}

          {/* Payment Methods */}
          {state === 'form' && (
            <>
              {/* Error Alert */}
              {displayError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{displayError}</p>
                </div>
              )}

              {/* Method Selection */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Ödeme Yöntemi
                </p>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor: selectedMethod === 'card' ? '#00833e' : undefined,
                      backgroundColor: selectedMethod === 'card' ? '#f0fdf4' : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="card"
                      checked={selectedMethod === 'card'}
                      onChange={() => setSelectedMethod('card')}
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 mx-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Kredi / Banka Kartı
                    </span>
                  </label>

                  <label
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor: selectedMethod === 'transfer' ? '#00833e' : undefined,
                      backgroundColor: selectedMethod === 'transfer' ? '#f0fdf4' : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="transfer"
                      checked={selectedMethod === 'transfer'}
                      onChange={() => setSelectedMethod('transfer')}
                      className="w-4 h-4"
                    />
                    <Building2 className="w-5 h-5 mx-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Havale / EFT
                    </span>
                  </label>
                </div>
              </div>

              {/* Card Form */}
              {selectedMethod === 'card' && (
                <div className="space-y-3 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Kart Numarası
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) => handleInputChange(e, 'cardNumber')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Kart Üzerindeki Ad Soyadı
                    </label>
                    <input
                      type="text"
                      placeholder="Ad Soyadı"
                      value={cardData.cardName}
                      onChange={(e) => handleInputChange(e, 'cardName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Ay
                      </label>
                      <input
                        type="text"
                        placeholder="MM"
                        maxLength={2}
                        value={cardData.expiryMonth}
                        onChange={(e) => handleInputChange(e, 'expiryMonth')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Yıl
                      </label>
                      <input
                        type="text"
                        placeholder="YY"
                        maxLength={2}
                        value={cardData.expiryYear}
                        onChange={(e) => handleInputChange(e, 'expiryYear')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="000"
                      maxLength={3}
                      value={cardData.cvv}
                      onChange={(e) => handleInputChange(e, 'cvv')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Transfer Info */}
              {selectedMethod === 'transfer' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Havale/EFT yapın:</span>
                    <br />
                    Banka adı ve hesap bilgileri kısa sürede size gönderilecektir.
                  </p>
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-2 text-xs text-gray-600">
                <input type="checkbox" defaultChecked className="mt-1" />
                <span>
                  Ödeme şartlarını kabul ediyorum ve KomşuApp'ın{' '}
                  <a href="#" className="text-[#00833e] hover:underline">
                    gizlilik politikasını
                  </a>{' '}
                  okudum.
                </span>
              </label>
            </>
          )}

          {/* Action Buttons */}
          {state === 'form' && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                İptal Et
              </button>
            </div>
          )}

          {state === 'error' && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setState('form')}
                className="w-full py-2.5 px-4 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b2f] transition-colors"
              >
                Tekrar Deneyin
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal Et
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
