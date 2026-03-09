'use client';

import { useState, useRef } from 'react';
import {
  Camera,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
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
    Number(formData.maxAttendees) > 0 &&
    formData.coverImage !== null
  );
}

export default function CreateEventPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Form submitted:', formData);
    // TODO: Implement actual submission logic (API call)
  };

  const categoryName = CATEGORIES.find((c) => c.id === formData.category)?.label || '';
  const visibilityName = VISIBILITY_OPTIONS.find(
    (v) => v.id === formData.visibility
  )?.label || '';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Yeni Etkinlik Oluştur
          </h1>
          <p className="text-gray-600 text-lg">
            Mahallede bir etkinlik organize etmek istiyorsanız, lütfen aşağıdaki formu doldurun.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image Upload */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Kapak Resmi
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-600 transition-colors bg-gradient-to-br from-gray-50 to-gray-100"
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
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Resmi Değiştir
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Camera className="w-12 h-12 mb-3" />
                      <p className="font-medium text-gray-700">
                        Kapak resmi seçmek için tıklayınız
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        veya sürükleyip bırakınız
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Etkinlik Başlığı *
                </label>
                <input
                  type="text"
                  placeholder="Etkinliğinizin adı"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                    errors.title
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Açıklama *
                </label>
                <div>
                  <textarea
                    placeholder="Etkinliği açıklayınız..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all resize-none ${
                      errors.description
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white'
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
                        formData.description.length > 500
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {formData.description.length}/500
                    </p>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="bg-white rounded-lg shadow-md p-6">
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.startDate
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.startTime
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.endDate
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.endTime
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Konum
                </label>
                <div className="mb-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="onlineEvent"
                    checked={formData.isOnlineEvent}
                    onChange={(e) =>
                      handleInputChange('isOnlineEvent', e.target.checked)
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-600 cursor-pointer"
                  />
                  <label htmlFor="onlineEvent" className="text-gray-700 cursor-pointer">
                    Online Etkinlik
                  </label>
                </div>
                {!formData.isOnlineEvent && (
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Etkinlik konumunu giriniz"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange('location', e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                          errors.location
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white'
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
              <div className="bg-white rounded-lg shadow-md p-6">
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
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Maksimum Katılımcı Sayısı *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="10"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) =>
                      handleInputChange('maxAttendees', e.target.value ? parseInt(e.target.value) : '')
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                      errors.maxAttendees
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white'
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Görünürlük *
                </label>
                <div className="space-y-3">
                  {VISIBILITY_OPTIONS.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.id}
                        checked={formData.visibility === option.id}
                        onChange={(e) =>
                          handleInputChange('visibility', e.target.value)
                        }
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-2 focus:ring-green-600 cursor-pointer"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  type="submit"
                  disabled={!isFormValid(formData)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isFormValid(formData)
                      ? 'bg-green-600 hover:bg-green-700 cursor-pointer shadow-md hover:shadow-lg'
                      : 'bg-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  Etkinlik Oluştur
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Önizleme
              </h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {categoryName || 'Kategori'}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Resim seçiniz</p>
                  </div>
                )}

                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2">
                      {formData.title || 'Etkinlik Başlığı'}
                    </h3>
                  </div>

                  {formData.startDate && formData.startTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>{new Date(`${formData.startDate}T${formData.startTime}`).toLocaleDateString('tr-TR', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</p>
                      </div>
                    </div>
                  )}

                  {!formData.isOnlineEvent && formData.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {formData.location}
                      </p>
                    </div>
                  )}

                  {formData.isOnlineEvent && (
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">Online Etkinlik</p>
                    </div>
                  )}

                  {formData.maxAttendees && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        {formData.maxAttendees} Kişi
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Görünürlük: {visibilityName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
