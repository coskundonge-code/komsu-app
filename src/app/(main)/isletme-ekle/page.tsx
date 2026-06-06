'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { startFreeTrial, MONTHLY_PRICE, YEARLY_PRICE, FREE_TRIAL_MONTHS } from '@/lib/services/business-subscription';
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
  Gift,
  CreditCard,
  Shield,
  Loader2,
  Store,
  Sparkles,
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
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
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
          isOpen: day !== 'Pazar',
          openTime: '09:00',
          closeTime: '18:00',
        },
      }),
      {}
    ),
  });

  // Auth kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    checkAuth();
  }, []);

  // Kategorileri canli business_categories tablosundan cek (dogru category_id icin)
  useEffect(() => {
    const loadCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('business_categories').select('id, name').order('sort_order');
      setCategories((data ?? []) as { id: string; name: string }[]);
    };
    loadCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > (type === 'logo' ? 5 : 10) * 1024 * 1024) {
        setError(`Dosya boyutu ${type === 'logo' ? '5' : '10'}MB'dan küçük olmalı`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [type]: reader.result as string }));
        setError(null);
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
        formatted = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 9)} ${value.slice(9)}`;
      }
    }

    setFormData((prev) => ({ ...prev, phone: formatted }));
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
        [day]: { ...prev.workingHours[day], [field]: value },
      },
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError('Lütfen önce giriş yapın.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Logo yükle
      let logoUrl = null;
      if (formData.logo) {
        const logoBlob = await fetch(formData.logo).then((r) => r.blob());
        const logoFile = new File([logoBlob], `logo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const { data: logoData, error: logoError } = await supabase.storage
          .from('business-images')
          .upload(`logos/${userId}/${logoFile.name}`, logoFile);
        if (logoError) throw new Error('Logo yüklenemedi: ' + logoError.message);
        const { data: logoPublic } = supabase.storage.from('business-images').getPublicUrl(logoData.path);
        logoUrl = logoPublic.publicUrl;
      }

      // Kapak fotoğrafı yükle
      let coverUrl = null;
      if (formData.cover) {
        const coverBlob = await fetch(formData.cover).then((r) => r.blob());
        const coverFile = new File([coverBlob], `cover_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const { data: coverData, error: coverError } = await supabase.storage
          .from('business-images')
          .upload(`covers/${userId}/${coverFile.name}`, coverFile);
        if (coverError) throw new Error('Kapak fotoğrafı yüklenemedi: ' + coverError.message);
        const { data: coverPublic } = supabase.storage.from('business-images').getPublicUrl(coverData.path);
        coverUrl = coverPublic.publicUrl;
      }

      // Slug oluştur
      const slug = formData.name
        .toLowerCase()
        .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
        .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // İşletmeyi oluştur
      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .insert({
          owner_id: userId,
          name: formData.name.trim(),
          slug: `${slug}-${Date.now().toString(36)}`,
          category_id: formData.category,
          description: formData.description.trim(),
          address: formData.address.trim(),
          phone: formData.phone.replace(/\s/g, ''),
          website: formData.website.trim() || null,
          logo_url: logoUrl,
          cover_url: coverUrl,
          instagram: formData.instagram.trim() || null,
          facebook: formData.facebook.trim() || null,
          twitter: formData.twitter.trim() || null,
          working_hours: formData.workingHours,
          is_verified: false,
          rating_avg: null,
          review_count: 0,
          recommendation_count: 0,
        })
        .select()
        .single();

      if (bizError) {
        throw new Error('İşletme oluşturulamadı: ' + bizError.message);
      }

      // 3 aylık ücretsiz deneme başlat
      if (business) {
        await startFreeTrial(business.id);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('İşletme oluşturma hatası:', err);
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = (): boolean => {
    return !!(formData.logo && formData.cover);
  };

  const isStep2Valid = (): boolean => {
    return !!(
      formData.name.trim() &&
      formData.category &&
      formData.description.trim() &&
      formData.address.trim()
    );
  };

  const isStep3Valid = (): boolean => {
    return !!(formData.phone.replace(/\s/g, '').length >= 10);
  };

  const getStepButtonDisabled = (): boolean => {
    if (step === 1) return !isStep1Valid();
    if (step === 2) return !isStep2Valid();
    if (step === 3) return !isStep3Valid();
    return false;
  };

  const stepLabels = ['Görseller', 'Temel Bilgiler', 'İletişim & Saatler', 'Onay'];

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary to-[#00a344] text-white py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold">İşletme Oluşturuldu!</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-surface rounded-2xl border border-border p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Tebrikler! 🎉
            </h2>
            <p className="text-text-muted mb-4 text-lg">
              İşletmeniz başarıyla oluşturuldu ve <strong>{FREE_TRIAL_MONTHS} aylık ücretsiz deneme</strong> süreniz başladı.
            </p>
            <div className="bg-primary-light rounded-xl p-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <Gift className="text-primary mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-primary-hover">Ücretsiz Deneme Süresi</p>
                  <p className="text-sm text-text-muted mt-1">
                    {FREE_TRIAL_MONTHS} ay boyunca tüm özellikleri ücretsiz kullanabilirsiniz.
                    Kredi kartı bilgisi gerekmez. Süre sonunda aylık {MONTHLY_PRICE.toLocaleString('tr-TR')}₺
                    veya yıllık {YEARLY_PRICE.toLocaleString('tr-TR')}₺ ile devam edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/isletme-paneli"
                className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 rounded-lg transition-colors"
              >
                İşletme Paneline Git
              </Link>
              <Link
                href="/"
                className="bg-background hover:bg-[#e0e0e0] text-text-primary font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Anasayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Free Trial Banner */}
        <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-2xl p-6 mb-8 flex items-center gap-4 border border-[#f59e0b]/20">
          <div className="w-14 h-14 bg-[#f59e0b] rounded-xl flex items-center justify-center flex-shrink-0">
            <Gift size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#92400e] text-lg">İlk {FREE_TRIAL_MONTHS} Ay Ücretsiz!</h3>
            <p className="text-sm text-[#92400e]/80 mt-1">
              Kredi kartı gerekmeden {FREE_TRIAL_MONTHS} ay boyunca tüm özellikleri kullanın.
              Sonrasında aylık {MONTHLY_PRICE.toLocaleString('tr-TR')}₺ veya yıllık {YEARLY_PRICE.toLocaleString('tr-TR')}₺ ile devam edin.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Shield size={16} className="text-[#92400e]/60" />
            <span className="text-xs text-[#92400e]/60 font-medium">Kart Gerekmez</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-10">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    num < step
                      ? 'bg-primary text-white'
                      : num === step
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-surface text-text-muted border-2 border-border'
                  }`}
                >
                  {num < step ? <Check size={20} /> : num}
                </div>
                <span className={`text-xs mt-2 font-medium ${num <= step ? 'text-primary' : 'text-text-muted'}`}>
                  {stepLabels[num - 1]}
                </span>
              </div>
              {num < 4 && (
                <div
                  className={`flex-1 h-1 mx-3 rounded transition-colors mt-[-20px] ${
                    num < step ? 'bg-primary' : 'bg-[#e0e0e0]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="bg-surface rounded-2xl border border-border p-8 max-w-4xl mx-auto shadow-sm">
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
                      <span className="text-xs text-text-muted text-center">Tıkla</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Temel Bilgiler</h2>
              <p className="text-text-muted mb-8">İşletmenizin adı, kategorisi ve konumu</p>

              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
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

              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
                  Adres *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-3.5 text-text-muted pointer-events-none" />
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

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
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

              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                  Telefon *
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-3.5 text-text-muted pointer-events-none" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneInput}
                    placeholder="5XX XXX XXXX"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#d1fae5] transition-colors"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
                  Web Sayfası (İsteğe Bağlı)
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-3.5 text-text-muted pointer-events-none" />
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

                <div className="mb-4">
                  <label htmlFor="instagram" className="block text-xs font-semibold text-text-primary mb-2">Instagram</label>
                  <div className="relative">
                    <Instagram size={16} className="absolute left-4 top-3.5 text-text-muted pointer-events-none" />
                    <input type="text" id="instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="@isletmeniz" className="w-full pl-11 pr-4 py-2 rounded border border-border focus:border-primary focus:outline-none text-sm" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="facebook" className="block text-xs font-semibold text-text-primary mb-2">Facebook</label>
                  <div className="relative">
                    <Facebook size={16} className="absolute left-4 top-3.5 text-text-muted pointer-events-none" />
                    <input type="text" id="facebook" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="isletmeniz" className="w-full pl-11 pr-4 py-2 rounded border border-border focus:border-primary focus:outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-xs font-semibold text-text-primary mb-2">Twitter/X</label>
                  <div className="relative">
                    <Twitter size={16} className="absolute left-4 top-3.5 text-text-muted pointer-events-none" />
                    <input type="text" id="twitter" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="@isletmeniz" className="w-full pl-11 pr-4 py-2 rounded border border-border focus:border-primary focus:outline-none text-sm" />
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
                          checked={formData.workingHours[day]?.isOpen}
                          onChange={(e) => handleWorkingHoursChange(day, 'isOpen', e.target.checked)}
                          className="mr-2 accent-[#00833e]"
                        />
                        <span className="text-sm font-medium text-gray-900">{day}</span>
                      </label>
                      {formData.workingHours[day]?.isOpen ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={formData.workingHours[day].openTime}
                            onChange={(e) => handleWorkingHoursChange(day, 'openTime', e.target.value)}
                            className="px-3 py-2 rounded border border-border text-sm focus:border-primary focus:outline-none"
                          />
                          <span className="text-text-muted">-</span>
                          <input
                            type="time"
                            value={formData.workingHours[day].closeTime}
                            onChange={(e) => handleWorkingHoursChange(day, 'closeTime', e.target.value)}
                            className="px-3 py-2 rounded border border-border text-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-text-muted">Kapalı</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation & Pricing Summary */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Özet & Onay</h2>
              <p className="text-text-muted mb-8">Bilgilerinizi kontrol edin ve işletmenizi oluşturun</p>

              {/* Business Preview */}
              <div className="mb-8 rounded-xl overflow-hidden border border-border">
                {formData.cover && (
                  <div
                    className="w-full"
                    style={{
                      backgroundImage: `url(${formData.cover})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '160px',
                    }}
                  />
                )}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {formData.logo && (
                      <img src={formData.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md -mt-12" />
                    )}
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-gray-900">{formData.name}</h3>
                      <p className="text-sm text-text-muted">{categories.find((c) => c.id === formData.category)?.name || ''}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-text-muted">
                      <MapPin size={14} />
                      <span>{formData.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted">
                      <Phone size={14} />
                      <span>{formData.phone}</span>
                    </div>
                    {formData.website && (
                      <div className="flex items-center gap-2 text-text-muted">
                        <Globe size={14} />
                        <span>{formData.website}</span>
                      </div>
                    )}
                  </div>
                  {formData.description && (
                    <p className="mt-3 text-sm text-text-muted line-clamp-2">{formData.description}</p>
                  )}
                </div>
              </div>

              {/* Pricing Info */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 mb-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-primary" size={22} />
                  <h3 className="text-lg font-bold text-gray-900">Abonelik Planı</h3>
                </div>

                <div className="space-y-4">
                  {/* Free Trial */}
                  <div className="bg-white rounded-lg p-4 flex items-center gap-4 border border-primary/20">
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Gift size={22} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">İlk {FREE_TRIAL_MONTHS} Ay Ücretsiz</p>
                      <p className="text-sm text-text-muted">Kredi kartı bilgisi gerekmez</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">0₺</span>
                  </div>

                  {/* After Trial */}
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Deneme sonrası fiyatlandırma:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                        <CreditCard size={18} className="text-text-muted" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{MONTHLY_PRICE.toLocaleString('tr-TR')}₺<span className="font-normal text-text-muted">/ay</span></p>
                          <p className="text-xs text-text-muted">Aylık ödeme</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background relative">
                        <CreditCard size={18} className="text-text-muted" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{YEARLY_PRICE.toLocaleString('tr-TR')}₺<span className="font-normal text-text-muted">/yıl</span></p>
                          <p className="text-xs text-text-muted">12 ay peşin</p>
                        </div>
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#f59e0b] text-white text-xs font-bold rounded-full">
                          Avantajlı
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Store size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  İşletmeniz oluşturulduktan sonra moderasyon sürecine alınır.
                  Onaylandıktan sonra komşularınız tarafından görüntülenebilir.
                  Deneme süresi boyunca tüm özellikler kullanılabilir.
                </p>
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
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={getStepButtonDisabled()}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors ${
                  getStepButtonDisabled()
                    ? 'bg-[#e0e0e0] text-text-muted cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-hover text-white'
                }`}
              >
                {step === 1 ? 'İleri' : 'Devam Et'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Store size={20} />
                    İşletme Oluştur (Ücretsiz Başla)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}