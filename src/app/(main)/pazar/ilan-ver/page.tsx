'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ImagePlus,
  MapPin,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

interface Photo {
  id: string;
  file: File;
  preview: string;
}

interface ListingFormData {
  title: string;
  category: string;
  condition: string;
  price: string;
  isFree: boolean;
  description: string;
  photos: Photo[];
  location: string;
  deliveryOptions: {
    pickup: boolean;
    shipping: boolean;
  };
}

const CATEGORIES = [
  'Elektronik',
  'Mobilya',
  'Giyim',
  'Ev & Yaşam',
  'Spor',
  'Kitap',
  'Araç',
  'Diğer',
];

const CONDITIONS = [
  { value: 'new', label: 'Sıfır' },
  { value: 'barely-used', label: 'Az Kullanılmış' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    category: '',
    condition: '',
    price: '',
    isFree: false,
    description: '',
    photos: [],
    location: 'Kadıköy, Moda Mahallesi',
    deliveryOptions: {
      pickup: false,
      shipping: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Check if form can be submitted (no side effects - safe to call during render)
  const canSubmit = () => {
    if (!formData.title.trim()) return false;
    if (!formData.category) return false;
    if (!formData.condition) return false;
    if (!formData.isFree && !formData.price.trim()) return false;
    if (!formData.description.trim()) return false;
    if (formData.photos.length === 0) return false;
    if (!formData.deliveryOptions.pickup && !formData.deliveryOptions.shipping) return false;
    return true;
  };

  // Validation with error setting (only call on submit)
  const isFormValid = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'İlan başlığı gereklidir';
    }
    if (!formData.category) {
      newErrors.category = 'Kategori seçilmelidir';
    }
    if (!formData.condition) {
      newErrors.condition = 'Durum seçilmelidir';
    }
    if (!formData.isFree && !formData.price.trim()) {
      newErrors.price = 'Fiyat belirtilmelidir';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }
    if (formData.photos.length === 0) {
      newErrors.photos = 'En az bir fotoğraf ekleyin';
    }
    if (!formData.deliveryOptions.pickup && !formData.deliveryOptions.shipping) {
      newErrors.delivery = 'En az bir teslimat yöntemi seçin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Photo upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    addPhotos(files);
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addPhotos(files);
    }
  };

  const addPhotos = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const availableSlots = 10 - formData.photos.length;
    const filesToAdd = imageFiles.slice(0, availableSlots);

    const newPhotos = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const removePhoto = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  // Form handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 100);
    setFormData((prev) => ({ ...prev, title: value }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setShowCategoryDropdown(false);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: '' }));
    }
  };

  const handleConditionChange = (condition: string) => {
    setFormData((prev) => ({ ...prev, condition }));
    if (errors.condition) {
      setErrors((prev) => ({ ...prev, condition: '' }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, price: value }));
    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: '' }));
    }
  };

  const handleFreeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isFree: e.target.checked,
      price: '',
    }));
    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: '' }));
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value.slice(0, 1000);
    setFormData((prev) => ({ ...prev, description: value }));
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: '' }));
    }
  };

  const handleDeliveryChange = (
    option: 'pickup' | 'shipping',
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        [option]: checked,
      },
    }));
    if (errors.delivery) {
      setErrors((prev) => ({ ...prev, delivery: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    console.log('New listing:', formData);
    // In a real app, this would submit to your API
    router.push('/pazar');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yeni İlan Oluştur
          </h1>
          <p className="text-gray-600">
            Ürününüzü komşularınızla paylaşın ve satın alabilecek kişiler bulun.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo Upload Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Fotoğraflar
            </label>

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-[#00833e] bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              } ${errors.photos ? 'border-red-500 bg-red-50' : ''}`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoInput}
                className="hidden"
                id="photo-input"
              />
              <label htmlFor="photo-input" className="cursor-pointer">
                <ImagePlus
                  className={`mx-auto h-12 w-12 mb-3 ${
                    dragActive || errors.photos
                      ? 'text-[#00833e]'
                      : 'text-gray-400'
                  }`}
                />
                <p className="text-sm font-medium text-gray-900">
                  Fotoğraf ekleyin
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Sürükle ve bırak ya da tıkla (max 10 fotoğraf)
                </p>
              </label>
            </div>

            {errors.photos && (
              <p className="text-red-600 text-sm mt-2">{errors.photos}</p>
            )}

            {/* Photo Grid */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                {formData.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={photo.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              {formData.photos.length}/10 fotoğraf yüklendi
            </p>
          </div>

          {/* Title Input */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              İlan Başlığı
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Satılık ürünü tanımlayan başlık yazın"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#00833e]'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <p
                className={`text-xs ${
                  errors.title ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {errors.title || ''}
              </p>
              <p className="text-xs text-gray-500">
                {formData.title.length}/100
              </p>
            </div>
          </div>

          {/* Category and Condition Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Kategori
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full px-4 py-2 border rounded-lg text-left flex justify-between items-center focus:outline-none focus:ring-2 transition-colors ${
                    errors.category
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#00833e]'
                  }`}
                >
                  <span
                    className={
                      formData.category
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }
                  >
                    {formData.category || 'Kategori seçin'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full px-4 py-2 text-left hover:bg-green-50 transition-colors ${
                          formData.category === category
                            ? 'bg-green-100 text-[#00833e] font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && (
                <p className="text-red-600 text-sm mt-2">{errors.category}</p>
              )}
            </div>

            {/* Condition */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Durum
              </label>
              <div className="space-y-2">
                {CONDITIONS.map((condition) => (
                  <label
                    key={condition.value}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={formData.condition === condition.value}
                      onChange={() => handleConditionChange(condition.value)}
                      className="w-4 h-4 text-[#00833e] focus:ring-[#00833e]"
                    />
                    <span className="ml-3 text-gray-700">
                      {condition.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.condition && (
                <p className="text-red-600 text-sm mt-2">{errors.condition}</p>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Fiyat
            </label>

            {/* Free Toggle */}
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={handleFreeToggle}
                  className="w-4 h-4 text-[#00833e] focus:ring-[#00833e] rounded"
                />
                <span className="ml-2 text-gray-700">Ücretsiz</span>
              </label>
            </div>

            {/* Price Input */}
            {!formData.isFree && (
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-500 font-medium">
                  ₺
                </span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="Fiyat girin"
                  min="0"
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.price
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#00833e]'
                  }`}
                />
              </div>
            )}

            {errors.price && (
              <p className="text-red-600 text-sm mt-2">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Ürünün durumu, özellikleri ve neden satıyor olduğunuz hakkında detay bilgi verin. Çeşitli açıklamalar daha fazla ilgi çeker."
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#00833e]'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <p
                className={`text-xs ${
                  errors.description ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {errors.description || ''}
              </p>
              <p className="text-xs text-gray-500">
                {formData.description.length}/1000
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Konum
            </label>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#00833e] flex-shrink-0" />
              <span className="text-gray-700 flex-grow">
                {formData.location}
              </span>
              <button
                type="button"
                onClick={() =>
                  alert(
                    'Konum değiştirme özelliği henüz uygulanmadı.'
                  )
                }
                className="px-4 py-2 text-[#00833e] hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
              >
                Değiştir
              </button>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Teslimat Seçenekleri
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.deliveryOptions.pickup}
                  onChange={(e) =>
                    handleDeliveryChange('pickup', e.target.checked)
                  }
                  className="w-4 h-4 text-[#00833e] focus:ring-[#00833e] rounded"
                />
                <span className="ml-3 text-gray-700">Elden Teslim</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.deliveryOptions.shipping}
                  onChange={(e) =>
                    handleDeliveryChange('shipping', e.target.checked)
                  }
                  className="w-4 h-4 text-[#00833e] focus:ring-[#00833e] rounded"
                />
                <span className="ml-3 text-gray-700">Kargo ile Gönderim</span>
              </label>
            </div>
            {errors.delivery && (
              <p className="text-red-600 text-sm mt-2">{errors.delivery}</p>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-[#00833e]" />
              İlan Önizlemesi
            </h3>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Preview Image */}
              {formData.photos.length > 0 && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={formData.photos[0].preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Preview Content */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-lg mb-2">
                  {formData.title || 'İlan Başlığı'}
                </h4>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-2xl font-bold text-[#00833e]">
                      {formData.isFree ? 'Ücretsiz' : formData.price ? `₺${formData.price}` : '₺0'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData.category || 'Kategori'}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {formData.condition
                      ? CONDITIONS.find((c) => c.value === formData.condition)
                        ?.label
                      : 'Durum'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {formData.description || 'Açıklama yazın...'}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {formData.location}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!canSubmit()}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                canSubmit()
                  ? 'bg-[#00833e] text-white hover:bg-[#006b32]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              İlanı Yayınla
            </button>
          </div>

          {/* Form Validation Info */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">
                Lütfen hataları düzeltedikten sonra yayınlayın.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
