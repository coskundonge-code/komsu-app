'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

type Step = 1 | 2 | 3;

interface FormData {
  title: string;
  description: string;
  category: string;
  type: 'free' | 'hourly' | 'daily';
  price: string;
  condition: string;
  pickupLocation: string;
  photos: string[];
  deposit: string;
  maxDuration: string;
  terms: string;
}

const categories = [
  'Elektrikli Aletler',
  'Bahçe Aletleri',
  'Mobilya',
  'Elektronik',
  'Spor Malzemeleri',
  'Mutfak',
  'Temizlik',
  'Diğer',
];

const conditions = [
  'Sıfır (Yeni)',
  'Çok İyi',
  'İyi',
  'Orta',
];

export default function NewListingPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    type: 'free',
    price: '',
    condition: '',
    pickupLocation: '',
    photos: [],
    deposit: '',
    maxDuration: '',
    terms: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && formData.photos.length < 5) {
      const newPhotos = Array.from(files).slice(0, 5 - formData.photos.length);
      setFormData((prev) => ({
        ...prev,
        photos: [
          ...prev.photos,
          ...newPhotos.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && formData.photos.length < 5) {
      const newPhotos = Array.from(files).slice(0, 5 - formData.photos.length);
      setFormData((prev) => ({
        ...prev,
        photos: [
          ...prev.photos,
          ...newPhotos.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }
  };

  const isStep1Valid = formData.title && formData.description && formData.category && formData.condition && formData.pickupLocation;
  const isStep2Valid = formData.photos.length > 0;
  const isStep3Valid = formData.terms && (formData.type === 'free' || formData.price) && (formData.type === 'free' || formData.maxDuration);

  const goToStep = (newStep: Step) => {
    if (newStep < step || (newStep === 2 && isStep1Valid) || (newStep === 3 && isStep1Valid && isStep2Valid)) {
      setStep(newStep);
    }
  };

  const handleSubmit = () => {
    if (isStep3Valid) {
      setIsSubmitted(true);
      setTimeout(() => {
        window.location.href = '/odunc-kirala';
      }, 2000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#00833e]" />
          </div>
          <h1 className="text-2xl font-bold text-[#333] mb-2">İlanınız Yayınlandı!</h1>
          <p className="text-sm text-[#8f8f8f] mb-6">
            İlanınız incelendikten sonra yayınlanacaktır. Sizi yönlendiriyoruz...
          </p>
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-[#00833e] rounded-full animate-bounce mr-2"></div>
            <div className="w-2 h-2 bg-[#00833e] rounded-full animate-bounce mr-2" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#00833e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Back Button */}
        <Link
          href="/odunc-kirala"
          className="inline-flex items-center gap-2 text-[#00833e] font-semibold mb-6 hover:text-[#006b32]"
        >
          <ChevronLeft className="w-4 h-4" />
          Geri Dön
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#333] mb-2">Yeni İlan Ver</h1>
          <p className="text-sm text-[#8f8f8f]">
            Adım {step} / 3
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => goToStep(s as Step)}
              className={cn(
                'flex-1 h-2 rounded-full transition-colors',
                s < step
                  ? 'bg-[#00833e]'
                  : s === step
                    ? 'bg-[#00833e]'
                    : 'bg-[#e0e0e0]'
              )}
              disabled={s > step && !((s === 2 && isStep1Valid) || (s === 3 && isStep1Valid && isStep2Valid))}
            />
          ))}
        </div>

        {/* Step 1: Bilgiler */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 sm:p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#333] mb-1">Bilgiler</h2>
              <p className="text-sm text-[#8f8f8f]">
                İlanınızın temel bilgilerini doldurun
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-2">
                İlan Başlığı*
              </label>
              <input
                type="text"
                name="title"
                placeholder="örn: Bosch Matkap - Profesyonel Model"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-2">
                Açıklama*
              </label>
              <textarea
                name="description"
                placeholder="Ürün hakkında detaylı açıklama yapın..."
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30 resize-none"
              />
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  Kategori*
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  Tür*
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                >
                  <option value="free">Ücretsiz Ödünç</option>
                  <option value="hourly">Saatlik Kiralık</option>
                  <option value="daily">Günlük Kiralık</option>
                </select>
              </div>
            </div>

            {/* Price (conditional) */}
            {formData.type !== 'free' && (
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  Fiyat (₺)*
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="örn: 25"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                />
              </div>
            )}

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-2">
                Durum*
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
              >
                <option value="">Durum seçin</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-2">
                Teslim Yeri*
              </label>
              <input
                type="text"
                name="pickupLocation"
                placeholder="Mahalle, sokak adı vb."
                value={formData.pickupLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
              />
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t border-[#e0e0e0]">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-3 border border-[#e0e0e0] text-[#404040] rounded-lg text-sm font-semibold hover:bg-[#f0f2f5] transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => goToStep(2)}
                disabled={!isStep1Valid}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                  isStep1Valid
                    ? 'bg-[#00833e] text-white hover:bg-[#006b32]'
                    : 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
                )}
              >
                Sonraki
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Fotoğraflar */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 sm:p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#333] mb-1">Fotoğraflar</h2>
              <p className="text-sm text-[#8f8f8f]">
                En az 1, en fazla 5 fotoğraf yükleyin
              </p>
            </div>

            {/* Upload Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={handleDragDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                formData.photos.length < 5
                  ? 'border-[#e0e0e0] hover:border-[#00833e] hover:bg-[#f0f2f5]'
                  : 'border-[#e0e0e0] opacity-50'
              )}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={formData.photos.length >= 5}
                className="hidden"
                id="photo-input"
              />
              <label
                htmlFor="photo-input"
                className={cn(
                  'cursor-pointer',
                  formData.photos.length >= 5 && 'cursor-not-allowed'
                )}
              >
                <Upload className="w-12 h-12 text-[#8f8f8f] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#333] mb-1">
                  Fotoğrafları sürükleyin veya tıklayın
                </p>
                <p className="text-xs text-[#8f8f8f]">
                  JPG, PNG (Max 5 MB)
                </p>
              </label>
            </div>

            {/* Photo Grid */}
            {formData.photos.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#333] mb-3">
                  Yüklenen Fotoğraflar ({formData.photos.length}/5)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#e0e0e0]">
                      <Image
                        src={photo}
                        alt={`Photo ${idx + 1}`}
                        fill
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t border-[#e0e0e0]">
              <button
                onClick={() => goToStep(1)}
                className="flex-1 px-4 py-3 border border-[#e0e0e0] text-[#404040] rounded-lg text-sm font-semibold hover:bg-[#f0f2f5] transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Geri
              </button>
              <button
                onClick={() => goToStep(3)}
                disabled={!isStep2Valid}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                  isStep2Valid
                    ? 'bg-[#00833e] text-white hover:bg-[#006b32]'
                    : 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
                )}
              >
                Sonraki
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Koşullar */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 sm:p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#333] mb-1">Koşullar ve Kurallar</h2>
              <p className="text-sm text-[#8f8f8f]">
                Kiralama veya ödünçleme koşullarını belirtin
              </p>
            </div>

            {/* Deposit */}
            {formData.type !== 'free' && (
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  Depozito (₺)
                </label>
                <input
                  type="number"
                  name="deposit"
                  placeholder="örn: 50"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                />
                <p className="text-xs text-[#8f8f8f] mt-1">
                  Hasarlar için alınacak depozito miktarı
                </p>
              </div>
            )}

            {/* Max Duration */}
            {formData.type !== 'free' && (
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  Maksimum Süre*
                </label>
                <input
                  type="text"
                  name="maxDuration"
                  placeholder="örn: 7 gün, 2 hafta"
                  value={formData.maxDuration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                />
              </div>
            )}

            {/* Terms */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-2">
                Teslim Koşulları ve Kurallar*
              </label>
              <textarea
                name="terms"
                placeholder="Teslim yöntemi, dönüş koşulları vb."
                rows={4}
                value={formData.terms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30 resize-none"
              />
            </div>

            {/* Summary */}
            <div className="bg-[#f0f2f5] rounded-lg p-4 border border-[#e0e0e0]">
              <h3 className="text-sm font-bold text-[#333] mb-3">İlan Özeti</h3>
              <div className="space-y-2 text-sm text-[#404040]">
                <p><span className="font-semibold">Başlık:</span> {formData.title}</p>
                <p><span className="font-semibold">Kategori:</span> {formData.category}</p>
                <p><span className="font-semibold">Tür:</span> {formData.type === 'free' ? 'Ücretsiz Ödünç' : formData.type === 'hourly' ? 'Saatlik Kiralık' : 'Günlük Kiralık'}</p>
                {formData.type !== 'free' && <p><span className="font-semibold">Fiyat:</span> ₺{formData.price}/{formData.type === 'hourly' ? 'saat' : 'gün'}</p>}
                <p><span className="font-semibold">Fotoğraflar:</span> {formData.photos.length}/5</p>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                İlanınız incelendikten sonra yayınlanacaktır. Toplam inceleme süresi 24 saate kadar sürebilir.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t border-[#e0e0e0]">
              <button
                onClick={() => goToStep(2)}
                className="flex-1 px-4 py-3 border border-[#e0e0e0] text-[#404040] rounded-lg text-sm font-semibold hover:bg-[#f0f2f5] transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Geri
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isStep3Valid}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                  isStep3Valid
                    ? 'bg-[#00833e] text-white hover:bg-[#006b32]'
                    : 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
                )}
              >
                <Check className="w-4 h-4" />
                İlan Ver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
