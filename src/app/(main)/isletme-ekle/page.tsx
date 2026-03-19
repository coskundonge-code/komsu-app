'use client';

import BusinessPackages from '@/components/business/business-packages';
import { PackageType, BillingPeriod } from '@/lib/services/business-subscription';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Upload,
  Check,
  Camera,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Clock,
} from 'lucide-react';

const CATEGORIES = [
  'Restoran',
  'Kafe',
  'Market',
  'Kuaför',
  'Eczane',
  'Tesisatçı',
  'Elektrikçi',
  'Temizlik',
  'Eğitim',
  'Sağlık',
  'Diğer',
];

const DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

interface FormData {
  selectedPackage?: PackageType;
  selectedBillingPeriod?: BillingPeriod;
  logo: string | null;
  cover: string | null;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  workingHours: WorkingHours;
}

export default function IsletmeEklePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    logo: null,
    cover: null,
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    workingHours: DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          isOpen: true,
          openTime: '09:00',
          closeTime: '18:00',
        },
      }),
      {}
    ),
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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);

    let formatted = value;
    if (value.length > 0) {
      if (value.length <= 3) {
        formatted = value;
      } else if (value.length <= 6) {
        formatted = `${value.slice(0, 3)} ${value.slice(3)}`;
      } else if (value.length <= 9) {
        formatted = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
      } else {
        formatted = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(
          6,
          9
        )} ${value.slice(9)}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };

  const handleWorkingHoursChange = (
    day: string,
    field: 'isOpen' | 'openTime' | 'closeTime',
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setStep(4);
    }, 1500);
  };

  const canSubmit = (): boolean => {
    const step1Valid = !!(
      formData.logo &&
      formData.cover &&
      formData.name.trim() &&
      formData.category
    );
    const step2Valid = !!(
      formData.description.trim() &&
      formData.address.trim() &&
      formData.phone.trim()
    );
    const step3Valid = !!(
      formData.phone.trim() &&
      formData.name.trim() &&
      formData.category
    );
    return step1Valid && step2Valid && step3Valid;
  };

  const isStep1Valid = (): boolean => {
    return !!(
      formData.logo &&
      formData.cover &&
      formData.name.trim() &&
      formData.category
    );
  };

  const isStep2Valid = (): boolean => {
    return !!(
      formData.description.trim() &&
      formData.address.trim() &&
      formData.phone.trim()
    );
  };

  const isStep3Valid = (): boolean => {
    return !!(formData.phone.trim() && formData.name.trim() && formData.category);
  };

  const getStepButtonDisabled = (): boolean => {
    if (step === 1) return !isStep1Valid();
    if (step === 2) return !isStep2Valid();
    if (step === 3) return !isStep3Valid();
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-[#00a344] text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-[#d1fae5] mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            Geri Dön
          </Link>
          <h1 className="text-4xl font-bold">İşletme Oluştur</h1>
          <p className="text-[#d1fae5] mt-2">
            Komşularınıza ulaşın ve işletmenizi tanıtın
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  num < step
                    ? 'bg-primary text-white'
                    : num === step
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted border-2 border-border'
                }`}
              >
                {num < step ? <Check size={20} /> : num}
              </div>
              {num < 4 && (
                <div
                  className={`flex-1 h-1 mx-3 rounded transition-colors ${
                    num < step ? 'bg-primary' : 'bg-[#e0e0e0]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

            {/* Step 4: Package Selection */}
            {step === 4 && (
              <div className="mb-8">
                <BusinessPackages
                  onSelectPackage={(packageId, billingPeriod) => {
                    setFormData((prev) => ({
                      ...prev,
                      selectedPackage: packageId,
                      selectedBillingPeriod: billingPeriod,
                    }));
                  }}
                  selectedPackage={formData.selectedPackage}
                  selectedBillingPeriod={formData.selectedBillingPeriod}
                />
              </div>
            )}

        {/* Success Screen */}
        {step === 4 ? (
          <div className="bg-surface rounded-lg border border-border p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              İşletme Başarıyla Oluşturuldu!
            </h2>
            <p className="text-text-muted mb-8 text-lg">
              İşletmeniz moderasyon için gönderildi. Yakında yayınlanacaktır.
            </p>
            <div className="space-y-4 mb-8">
              <p className="text-sm text-text-muted">
                Onay sürecinde e-posta adresinize bilgilendirme gönderilecektir.
              </p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/"
                className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Anasayfa
              </Link>
              <Link
                href="/"
                className="bg-background hover:bg-[#e0e0e0] text-text-primary font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Devam Et
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface rounded-lg border border-border p-8 max-w-4xl mx-auto">
            {/* Step 1: Logo & Cover */}
            {step === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Görsel Bilgileri
                </h2>
                <p className="text-text-muted mb-8">
                  İşletmeniz için logo ve kapak fotoğrafı yükleyin
                </p>

                {/* Logo Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Logo Yükle *
                  </label>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="w-32 h-32 mx-auto border-2 border-dashed border-border rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-background transition-colors"
                  >
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <>
                        <Camera size={32} className="text-primary mb-2" />
                        <span className="text-xs text-text-muted text-center">
                          Tıkla
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-text-muted text-center mt-2">
                    PNG, JPG - Max 5MB
                  </p>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                </div>

                {/* Cover Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Kapak Fotoğrafı Yükle *
                  </label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-background transition-colors"
                    style={{ aspectRatio: '16/6' }}
                  >
                    {formData.cover ? (
                      <img
                        src={formData.cover}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload size={40} className="text-primary mb-2" />
                        <span className="text-sm font-medium text-gray-900">
                          Kapak fotoğrafını sürükle veya tıkla
                        </span>
                        <span className="text-xs text-text-muted mt-1">
                          PNG, JPG - Max 10MB
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Temel Bilgiler
                </h2>
                <p className="text-text-muted mb-8">
                  İşletmenizin adı, kategorisi ve konumu
                </p>

                {/* Business Name */}
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    İşletme Adı *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Örn: Kahvehane Keyif"
                    className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#d1fae5] transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Kategori *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#d1fae5] transition-colors appearance-none bg-surface cursor-pointer"
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
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Adres *
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Mahalle, Sokak, No..."
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#d1fae5] transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Açıklama *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="İşletmeniz hakkında kısaca bilgi verin..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#d1fae5] transition-colors resize-none"
                  />
                  <div className="text-xs text-text-muted mt-1 text-right">
                    {formData.description.length}/500
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Hours */}
            {step === 3 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  İletişim ve Çalışma Saatleri
                </h2>
                <p className="text-text-muted mb-8">
                  İletişim bilgileri ve işletmenizin açık olduğu saatler
                </p>

                {/* Phone */}
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Telefon *
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneInput}
                      placeholder="(5XX) XXX XXXX"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#d1fae5] transition-colors"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="mb-6">
                  <label
                    htmlFor="website"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Web Sayfası (İsteğe Bağlı)
                  </label>
                  <div className="relative">
                    <Globe
                      size={18}
                      className="absolute left-4 top-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="www.isletme.com"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#d1fae5] transition-colors"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="mb-8 p-6 bg-background rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Sosyal Medya (İsteğe Bağlı)
                  </h3>

                  {/* Instagram */}
                  <div className="mb-4">
                    <label
                      htmlFor="instagram"
                      className="block text-xs font-semibold text-text-primary mb-2"
                    >
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram
                        size={16}
                        className="absolute left-4 top-3.5 text-text-muted pointer-events-none"
                      />
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="@isletmeniz"
                        className="w-full pl-11 pr-4 py-2 rounded border border-border focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="mb-4">
                    <label
                      htmlFor="facebook"
                      className="block text-xs font-semibold text-text-primary mb-2"
                    >
                      Facebook
                    </label>
                    <div className="relative">
                      <Facebook
                        size={16}
                        className="absolute left-4 top-3.5 text-text-muted pointer-events-none"
                      />
                      <input
                        type="text"
                        id="facebook"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="isletmeniz"
                        className="w-full pl-11 pr-4 py-2 rounded border border-border focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div>
                    <label
                      htmlFor="twitter"
                      className="block text-xs font-semibold text-text-primary mb-2"
                    >
                      Twitter/X
                    </label>
                    <div className="relative">
                      <Twitter
                        size={16}
                        className="absolute left-4 top-3.5 text-text-muted pointer-events-none"
                      />
                      <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        placeholder="@isletmeniz"
                        className="w-full pl-11 pr-4 py-2 rounded border border-border focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} />
                    Çalışma Saatleri
                  </h3>

                  <div className="space-y-4">
                    {DAYS.map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <label className="w-24">
                          <input
                            type="checkbox"
                            checked={formData.workingHours[day].isOpen}
                            onChange={(e) =>
                              handleWorkingHoursChange(
                                day,
                                'isOpen',
                                e.target.checked
                              )
                            }
                            className="mr-2 accent-[#00833e]"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {day}
                          </span>
                        </label>

                        {formData.workingHours[day].isOpen && (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              value={formData.workingHours[day].openTime}
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  day,
                                  'openTime',
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 rounded border border-border text-sm focus:border-primary focus:outline-none"
                            />
                            <span className="text-text-muted">-</span>
                            <input
                              type="time"
                              value={formData.workingHours[day].closeTime}
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  day,
                                  'closeTime',
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 rounded border border-border text-sm focus:border-primary focus:outline-none"
                            />
                          </div>
                        )}

                        {!formData.workingHours[day].isOpen && (
                          <span className="text-sm text-text-muted">Kapalı</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preview Card */}
            {step === 3 && (
              <div className="mb-8 p-6 bg-background rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Ön İzleme
                </h3>
                <div className="bg-surface rounded-lg overflow-hidden border border-border">
                  {formData.cover && (
                    <div
                      className="w-full object-cover"
                      style={{
                        backgroundImage: `url(${formData.cover})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '160px',
                      }}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {formData.logo && (
                        <img
                          src={formData.logo}
                          alt="Logo"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {formData.name || 'İşletme Adı'}
                        </h4>
                        <p className="text-xs text-text-muted">
                          {formData.category || 'Kategori'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-border">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-background hover:bg-[#e0e0e0] text-text-primary font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Geri
                </button>
              )}
              <button
                type={step === 4 ? 'submit' : 'button'}
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                }}
                disabled={getStepButtonDisabled()}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors ${
                  getStepButtonDisabled()
                    ? 'bg-[#e0e0e0] text-text-muted cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-hover text-white'
                }`}
              >
                {step === 4
                  ? 'İşletme Oluştur'
                  : step === 1
                  ? 'İleri'
                  : 'Devam Et'}
              </button>
            </div>

            {submitted && (
              <div className="mt-6 p-4 bg-primary-light border border-primary rounded-lg text-center">
                <p className="text-primary-hover font-semibold">
                  ✓ İşletme başarıyla oluşturuluyor...
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
