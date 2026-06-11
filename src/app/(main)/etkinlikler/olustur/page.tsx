'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/hooks/use-events';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { useVerificationGate } from '@/components/shared/verification-gate';
import {
  Camera,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  Eye,
  Plus,
} from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  isOnlineEvent: boolean;
  category: string;
  maxAttendees: number | '';
  visibility: 'neighborhood' | 'nearby' | 'everyone';
  coverImage: string | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  category?: string;
  maxAttendees?: string;
}

const CATEGORIES = [
  { id: 'social', label: 'Sosyal', color: '#00833e' },
  { id: 'sports', label: 'Spor', color: '#00833e' },
  { id: 'education', label: 'Eğitim', color: '#00833e' },
  { id: 'culture', label: 'Kültür', color: '#00833e' },
  { id: 'music', label: 'Müzik', color: '#00833e' },
  { id: 'food', label: 'Yemek', color: '#00833e' },
];

const VISIBILITY_OPTIONS = [
  { id: 'neighborhood', label: 'Sadece Mahalle' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'everyone', label: 'Herkese Açık' },
];

function isFormValid(formData: FormData): boolean {
  const isLocationValid = !formData.isOnlineEvent && formData.location.trim().length > 0;
  const hasLocation = formData.isOnlineEvent || isLocationValid;

  return (
    formData.title.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    formData.startDate.length > 0 &&
    formData.startTime.length > 0 &&
    formData.endDate.length > 0 &&
    formData.endTime.length > 0 &&
    formData.category.length > 0 &&
    hasLocation &&
    formData.maxAttendees !== '' &&
    Number(formData.maxAttendees) > 0
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const { user, neighborhood } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    isOnlineEvent: false,
    category: '',
    maxAttendees: '',
    visibility: 'neighborhood',
    coverImage: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setFormData((prev) => ({ ...prev, coverImage: imageData }));
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Etkinlik başlığı gerekli';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gerekli';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Açıklama en az 10 karakter olmalı';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi gerekli';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Başlangıç saati gerekli';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Bitiş tarihi gerekli';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Bitiş saati gerekli';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      if (end <= start) {
        newErrors.endDate = 'Bitiş tarihi başlangıcından sonra olmalı';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Kategori seçiniz';
    }

    if (!formData.isOnlineEvent && !formData.location.trim()) {
      newErrors.location = 'Konum gerekli';
    }

    if (!formData.maxAttendees || Number(formData.maxAttendees) <= 0) {
      newErrors.maxAttendees = 'Geçerli bir katılımcı sayısı giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { checkVerified, gateModal } = useVerificationGate('Etkinlik oluşturabilmek');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) { setSubmitError('Giriş yapmalısınız.'); return; }
    if (!(await checkVerified())) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const startDatetime = `${formData.startDate}T${formData.startTime}:00`;
      const endDatetime = `${formData.endDate}T${formData.endTime}:00`;

      const { error } = await createEvent({
        title: formData.title,
        description: formData.description,
        start_date: startDatetime,
        end_date: endDatetime,
        location: formData.isOnlineEvent ? 'Çevrimiçi' : formData.location,
        is_online: formData.isOnlineEvent,
        category: formData.category,
        max_attendees: formData.maxAttendees ? Number(formData.maxAttendees) : null,
        neighborhood_id: neighborhood?.id,
        organizer_id: user.id,
      } as any);

      if (error) {
        setSubmitError('Etkinlik oluşturulamadı: ' + error.message);
        setIsSubmitting(false);
        return;
      }

      router.push('/etkinlikler');
    } catch (err: any) {
      setSubmitError('Hata: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const categoryName = CATEGORIES.find((c) => c.id === formData.category)?.label || '';
  const visibilityName = VISIBILITY_OPTIONS.find(
    (v) => v.id === formData.visibility
  )?.label || '';

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      {gateModal}
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-white py-12 px-6 rounded-2xl mb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Yeni Etkinlik Oluştur
        </h1>
        <p className="text-green-50 text-lg">
          Mahallede bir etkinlik organize etmek istiyorsanız, formu doldurup etkinlik yaratın.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image Upload */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Kapak Resmi *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors bg-gradient-to-br from-[#f0f2f5] to-gray-100"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, coverImage: null }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-sm text-primary hover:text-primary-hover underline font-medium"
                      >
                        Resmi Değiştir
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-3">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <p className="font-semibold text-gray-700">
                        Kapak resmi seçiniz
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG - Max 5MB
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  İyi bir kapak resmi, etkinliğinize daha fazla ilgi çeker. Açık ve profesyonel resimler tercih edin.
                </p>
              </div>

              {/* Title */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Etkinlik Başlığı *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Mahalle Temizlik Günü, Komşu Kahvaltısı..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  maxLength={80}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.title
                      ? 'border-red-500 bg-red-50'
                      : 'border-border bg-surface'
                  }`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.title && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">{formData.title.length}/80</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Açıklama *
                </label>
                <div>
                  <textarea
                    placeholder="Etkinlik hakkında detayları yazınız. Maksimum 500 karakter."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    maxLength={500}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                      errors.description
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-surface'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.description && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                    <p
                      className={`text-sm ml-auto ${
                        formData.description.length > 450
                          ? 'text-orange-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {formData.description.length}/500
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Tarih ve Saat *
                </label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange('startDate', e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.startDate
                          ? 'border-red-500 bg-red-50'
                          : 'border-border bg-surface'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Başlangıç Saati
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        handleInputChange('startTime', e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.startTime
                          ? 'border-red-500 bg-red-50'
                          : 'border-border bg-surface'
                      }`}
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.endDate
                          ? 'border-red-500 bg-red-50'
                          : 'border-border bg-surface'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Bitiş Saati
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        handleInputChange('endTime', e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.endTime
                          ? 'border-red-500 bg-red-50'
                          : 'border-border bg-surface'
                      }`}
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Konum *
                </label>
                <div className="mb-4 flex items-center gap-3 p-3 bg-background rounded-lg">
                  <input
                    type="checkbox"
                    id="onlineEvent"
                    checked={formData.isOnlineEvent}
                    onChange={(e) =>
                      handleInputChange('isOnlineEvent', e.target.checked)
                    }
                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="onlineEvent" className="text-gray-700 cursor-pointer font-medium">
                    Bu Çevrimiçi bir Etkinlik
                  </label>
                </div>
                {!formData.isOnlineEvent && (
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-primary" />
                      <input
                        type="text"
                        placeholder="Örn: Mahalle Parkı, Spor Salonu..."
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange('location', e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                          errors.location
                            ? 'border-red-500 bg-red-50'
                            : 'border-border bg-surface'
                        }`}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.location}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Kategori *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleInputChange('category', cat.id)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all border-2 ${
                        formData.category === cat.id
                          ? 'border-primary bg-green-50 text-primary'
                          : 'border-border bg-surface text-gray-700 hover:border-primary'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Max Attendees */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Maksimum Katılımcı Sayısı *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 w-5 h-5 text-primary" />
                  <input
                    type="number"
                    placeholder="Örn: 30"
                    min="1"
                    max="999"
                    value={formData.maxAttendees}
                    onChange={(e) =>
                      handleInputChange('maxAttendees', e.target.value ? parseInt(e.target.value) : '')
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors.maxAttendees
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-surface'
                    }`}
                  />
                </div>
                {errors.maxAttendees && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.maxAttendees}
                  </p>
                )}
              </div>

              {/* Visibility */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Görünürlük *
                </label>
                <div className="space-y-3">
                  {VISIBILITY_OPTIONS.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-background transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.id}
                        checked={formData.visibility === option.id}
                        onChange={(e) =>
                          handleInputChange('visibility', e.target.value)
                        }
                        className="w-4 h-4 text-primary border-border focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                      <span className="text-gray-700 font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-surface rounded-xl shadow-md p-6">
                {submitError && (
                  <p className="text-sm text-red-600 mb-3">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={!isFormValid(formData) || isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isFormValid(formData) && !isSubmitting
                      ? 'bg-primary hover:bg-primary-hover cursor-pointer shadow-md hover:shadow-lg'
                      : 'bg-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  {isSubmitting ? 'Oluşturuluyor...' : 'Etkinlik Oluştur'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ön İzleme
              </h2>
              <div className="bg-surface rounded-xl shadow-lg overflow-hidden border border-border">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                      {categoryName || "Kategori"}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#f0f2f5] to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Resim seçiniz</p>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-base">
                      {formData.title || "Etkinlik Başlığı"}
                    </h3>
                  </div>

                  {formData.startDate && formData.startTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>{new Date(`${formData.startDate}T${formData.startTime}`).toLocaleDateString("tr-TR", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</p>
                      </div>
                    </div>
                  )}

                  {!formData.isOnlineEvent && formData.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {formData.location}
                      </p>
                    </div>
                  )}

                  {formData.isOnlineEvent && (
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Çevrimiçi Etkinlik</p>
                    </div>
                  )}

                  {formData.maxAttendees && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        Max {formData.maxAttendees} Kişi
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-text-muted">
                      <span className="font-semibold text-text-secondary">Görünürlük:</span> {visibilityName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">İpucu:</span> Açık ve çekici bir başlık ile daha fazla kişi etkinliğinizi görebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
