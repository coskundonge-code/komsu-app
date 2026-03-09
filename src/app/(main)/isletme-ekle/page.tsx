'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Upload, Check } from 'lucide-react';

const CATEGORIES = [
  'Kahve & Çay',
  'Pastane & Fırın',
  'Berberlik',
  'Güzellik & Spor',
  'Hizmet & Onarım',
  'Temizlik & Bakım',
  'Sağlık',
  'Veterinerlik',
  'Eğitim',
  'Gıda & Restoran',
  'Elektronik',
  'Giyim & Aksesuar',
  'Diğer',
];

interface FormData {
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  hours: string;
}

export default function IsletmeEklePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    hours: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setStep(3);
    }, 1500);
  };

  const isStep1Valid = formData.name && formData.category && formData.address;
  const isStep2Valid = formData.phone && formData.email;

  return (
    <div className="min-h-screen bg-[#e6f4ec]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00833e] to-green-600 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/isletmeler"
            className="inline-flex items-center gap-2 text-[#d1fae5] hover:text-white mb-4"
          >
            <ChevronLeft size={20} />
            Geri Dön
          </Link>
          <h1 className="text-4xl font-bold">İşletme Ekle</h1>
          <p className="text-[#d1fae5] mt-2">
            Komşularınıza ulaşın ve işletmenizi tanıtın
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  num < step
                    ? 'bg-[#00833e] text-white'
                    : num === step
                    ? 'bg-[#00833e] text-white'
                    : 'bg-white text-[#00833e] border-2 border-[#a7dbb8]'
                }`}
              >
                {num < step ? <Check size={20} /> : num}
              </div>
              {num < 3 && (
                <div
                  className={`h-1 w-20 mx-2 rounded ${
                    num < step
                      ? 'bg-[#00833e]'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 3 ? (
          // Success Screen
          <div className="bg-white rounded-lg border border-[#d1fae5] p-12 text-center">
            <div className="w-16 h-16 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-[#00833e]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              İşletme Başarıyla Eklendi!
            </h2>
            <p className="text-gray-600 mb-6">
              İşletmeniz moderasyon için gönderildi. Yakında yayınlanacaktır.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Onay sürecinde e-posta adresinize bilgilendirme gönderilecektir.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/isletmeler"
                  className="bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  İşletmeleri Görüntüle
                </Link>
                <Link
                  href="/"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Anasayfa
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#d1fae5] p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Temel Bilgiler
                </h2>

                {/* Business Name */}
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    İşletme Adı *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Örn: Kahvehane Keyif"
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5]"
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Kategori *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5]"
                    required
                  >
                    <option value="">Kategori Seç</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="mb-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Adres *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Mahalle, Sokak, No..."
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5]"
                    required
                  />
                </div>

                {/* Logo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Yükle (İsteğe Bağlı)
                  </label>
                  <div className="border-2 border-dashed border-[#34d399] rounded-lg p-6 text-center cursor-pointer hover:border-[#00833e] transition-colors">
                    <Upload size={24} className="text-[#00833e] mx-auto mb-2" />
                    <p className="text-sm text-gray-700 font-medium">
                      Logoyu sürükle veya tıkla
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG - Max 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  İletişim Bilgileri
                </h2>

                {/* Phone */}
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+90 212 123 4567"
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5]"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="info@isletme.com"
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5]"
                    required
                  />
                </div>

                {/* Website */}
                <div className="mb-6">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Web Sayfası (İsteğe Bağlı)
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="www.isletme.com"
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5]"
                  />
                </div>

                {/* Hours */}
                <div className="mb-6">
                  <label
                    htmlFor="hours"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Çalışma Saatleri (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    placeholder="08:00 - 23:00"
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5]"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Açıklama (İsteğe Bağlı)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="İşletmeniz hakkında kısaca bilgi verin..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-[#a7dbb8] focus:border-[#00833e] focus:outline-none focus:ring-2 focus:ring-[#d1fae5] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Geri
                </button>
              )}
              <button
                type={step === 2 ? 'submit' : 'button'}
                onClick={() => {
                  if (step === 1 && isStep1Valid) setStep(2);
                }}
                disabled={step === 1 && !isStep1Valid}
                className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors ${
                  (step === 1 && !isStep1Valid)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#00833e] hover:bg-[#006b32] text-white'
                }`}
              >
                {step === 1 ? 'İleri' : 'Gönder'}
              </button>
            </div>

            {submitted && (
              <div className="mt-4 p-4 bg-[#e6f4ec] border border-[#a7dbb8] rounded-lg text-center">
                <p className="text-[#006b32] font-medium">
                  ✓ İşletme başarıyla ekleniyor...
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
