'use client';

import { toast } from '@/lib/utils/show-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ImagePlus,
  MapPin,
  ChevronDown,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { createListing } from '@/lib/hooks/use-listings';
import { createClient } from '@/lib/supabase/client';
import { uploadMultipleMedia } from '@/lib/upload';
import { checkCanPost, consumeFreeQuota, LISTING_FEE, FREE_LISTING_LIMIT } from '@/lib/services/listing-quota';
import { moderateMediaFiles, analyzeContent, submitForModeration } from '@/lib/services/content-moderation';

interface MediaItem {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

// Keep Photo alias for backward compat
type Photo = MediaItem;

type ListingType = 'sale' | 'free' | 'rental' | 'lend';

interface ListingFormData {
  listingType: ListingType;
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

const LISTING_TYPES: { value: ListingType; label: string; icon: string; desc: string }[] = [
  { value: 'sale', label: 'Satılık', icon: '🏷️', desc: 'Ürünü sat' },
  { value: 'free', label: 'Ücretsiz', icon: '🎁', desc: 'Ücretsiz ver' },
  { value: 'rental', label: 'Kiralık', icon: '🔑', desc: 'Kiraya ver' },
  { value: 'lend', label: 'Ödünç Ver', icon: '🤝', desc: 'Ödünç ver' },
];

const CATEGORIES = [
  'Elektronik',
  'Mobilya',
  'Giyim',
  'Ev & Bahçe',
  'Spor & Hobi',
  'Kitap & Kırtasiye',
  'Bebek & Çocuk',
  'Araç',
  'Diğer',
];

const CONDITIONS = [
  { value: 'new', label: 'Sıfır' },
  { value: 'like_new', label: 'Az Kullanılmış' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
];

const CATEGORY_ID_MAP: Record<string, string> = {
  'Elektronik': 'fcea98f1-d3e8-4b84-82b2-ae36994f809d',
  'Mobilya': '836be50c-4d0d-4186-8808-df634fe8da56',
  'Giyim': '90e53ece-6792-4d12-82d4-6c2c27fb2ce9',
  'Ev & Bahçe': '418789ca-ca21-49f5-a473-2c8cea7f72be',
  'Spor & Hobi': '65848553-fb70-4ba4-b20a-4514a0262843',
  'Kitap & Kırtasiye': '24865efd-a9f5-4e4e-964b-68d681c1be56',
  'Bebek & Çocuk': '648771ed-800e-4688-84c2-1baceba31741',
  'Araç': 'd8fc0ab3-cac4-4f2f-a622-75efa1f59435',
  'Diğer': 'cfbe68e2-dcee-4524-a1c6-7586fe3059bc',
};

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>({
    listingType: 'sale',
    title: '',
    category: '',
    condition: '',
    price: '',
    isFree: false,
    description: '',
    photos: [],
    location: '',
    deliveryOptions: {
      pickup: false,
      shipping: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userNeighborhoodId, setUserNeighborhoodId] = useState<string | null>(null);
  const [quotaInfo, setQuotaInfo] = useState<{ canPostFree: boolean; remainingFree: number } | null>(null);
  const [quotaBlocked, setQuotaBlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch user's saved location from profile
  useEffect(() => {
    const fetchUserLocation = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get location from user metadata first (set during konum-secimi)
      const meta = user.user_metadata;
      if (meta?.il && meta?.ilce) {
        const locationParts = [meta.ilce, meta.mahalle].filter(Boolean);
        setFormData(prev => ({ ...prev, location: locationParts.join(', ') }));
      }

      // Also fetch from profiles for more detail
      const { data: profile } = await supabase
        .from('profiles')
        .select('location_province, location_district, location_address')
        .eq('id', user.id)
        .single();

      if (profile?.location_district) {
        const loc = profile.location_address
          ? `${profile.location_district}, ${profile.location_address}`
          : `${profile.location_district}${profile.location_province ? ', ' + profile.location_province : ''}`;
        setFormData(prev => ({ ...prev, location: loc }));
      }

      // Fetch neighborhood_id from user_addresses
      const { data: address } = await supabase
        .from('user_addresses')
        .select('neighborhood_id, district, city')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();

      if (address?.neighborhood_id) {
        setUserNeighborhoodId(address.neighborhood_id);
      }
      // Fallback location from address table if profile didn't have it
      if (address?.district && !profile?.location_district) {
        setFormData(prev => ({
          ...prev,
          location: `${address.district}${address.city ? ', ' + address.city : ''}`,
        }));
      }

      // Check listing quota
      if (user) {
        const quota = await checkCanPost(user.id, 'sale');
        if (quota) {
          setQuotaInfo({ canPostFree: quota.canPostFree, remainingFree: quota.remainingFree });
          // Block if no free quota for sale/rental
          if (!quota.canPostFree) {
            setQuotaBlocked(true);
          }
        }
      }
    };
    fetchUserLocation();
  }, []);

  // Re-check quota when listing type changes
  useEffect(() => {
    const recheckQuota = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const needsQuota = formData.listingType === 'sale' || formData.listingType === 'rental';
      if (!needsQuota) {
        // Ücretsiz ve Ödünç Ver ilanları her zaman serbest
        setQuotaBlocked(false);
        return;
      }

      const quota = await checkCanPost(user.id, formData.listingType);
      if (quota) {
        setQuotaInfo({ canPostFree: quota.canPostFree, remainingFree: quota.remainingFree });
        setQuotaBlocked(!quota.canPostFree);
      }
    };
    recheckQuota();
  }, [formData.listingType]);

  const needsPrice = () => formData.listingType === 'sale';

  // Check if form can be submitted (no side effects - safe to call during render)
  const canSubmit = () => {
    // Quota exhausted for sale/rental - BLOCK submission entirely
    if (quotaBlocked && (formData.listingType === 'sale' || formData.listingType === 'rental')) return false;
    if (!formData.title.trim()) return false;
    if (!formData.category) return false;
    if (!formData.condition) return false;
    if (needsPrice() && !formData.price.trim()) return false;
    if (!formData.description.trim()) return false;
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
    if (needsPrice() && !formData.price.trim()) {
      newErrors.price = 'Fiyat belirtilmelidir';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
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

  const addPhotos = async (files: File[]) => {
    const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

    const mediaFiles = files.filter((file) => {
      if (file.type.startsWith('image/')) return true;
      if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error('Video dosyası çok büyük. Maksimum 100MB olmalı.');
          return false;
        }
        return true;
      }
      return false;
    });

    // Max 2 videos allowed
    const currentVideoCount = formData.photos.filter(p => p.type === 'video').length;
    const availableSlots = 10 - formData.photos.length;

    const filesToAdd: File[] = [];
    let videoAddCount = 0;
    for (const file of mediaFiles) {
      if (filesToAdd.length >= availableSlots) break;
      if (file.type.startsWith('video/')) {
        if (currentVideoCount + videoAddCount >= 2) {
          toast.error('En fazla 2 video yükleyebilirsiniz.');
          continue;
        }
        videoAddCount++;
      }
      filesToAdd.push(file);
    }

    // AI Moderation - check all files before adding
    if (filesToAdd.length > 0) {
      toast.info('Dosyalar kontrol ediliyor...');
      const { approved, rejected, hasRejected } = await moderateMediaFiles(filesToAdd);

      if (hasRejected) {
        for (const { file, reason } of rejected) {
          toast.error(`"${file.name}" reddedildi: ${reason}`);
        }
      }

      // Only add approved files
      const newPhotos: MediaItem[] = approved.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      }));

      if (newPhotos.length > 0) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos],
        }));
      }
    }
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

  const _handleFreeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient() as any;
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setErrors({ submit: 'Lütfen giriş yapın' });
        setIsSubmitting(false);
        return;
      }

      // Upload images and videos to storage using the upload utility
      let mediaUrls: string[] | null = null;
      if (formData.photos.length > 0) {
        const files = formData.photos.map(photo => photo.file);
        const { urls, errors: uploadErrors } = await uploadMultipleMedia(
          files,
          'listing-images',
          `marketplace/${user.id}`
        );
        if (urls.length > 0) {
          mediaUrls = urls;
        }
        if (uploadErrors.length > 0) {
          console.warn('Some images failed to upload:', uploadErrors);
        }
      }

      // Determine price based on listing type
      const price = (formData.listingType === 'sale' && formData.price) ? parseInt(formData.price) : 0;

      // AI Content Moderation - text analysis
      const textModerationResult = analyzeContent(
        formData.description,
        formData.title,
        'listing'
      );
      if (textModerationResult.autoAction === 'reject') {
        setErrors({
          submit: `İlan içeriğiniz topluluk kurallarına uygun değil: ${textModerationResult.reasoning}. Lütfen içeriğinizi düzenleyin.`,
        });
        setIsSubmitting(false);
        return;
      }

      // Check quota for sale/rental listings - HARD BLOCK
      const needsQuota = formData.listingType === 'sale' || formData.listingType === 'rental';
      if (needsQuota) {
        const quota = await checkCanPost(user.id, formData.listingType);
        if (quota && !quota.canPostFree) {
          // User is BLOCKED - cannot post without payment
          setQuotaBlocked(true);
          setShowPaymentModal(true);
          setIsSubmitting(false);
          toast.error('Ücretsiz ilan hakkınız doldu. İlan yayınlamazsınız.');
          return;
        }
      }

      // Create listing record
      const { data, error } = await createListing({
        title: formData.title,
        description: formData.description,
        price,
        category_id: CATEGORY_ID_MAP[formData.category] || null,
        seller_id: user.id,
        neighborhood_id: userNeighborhoodId || null,
        media_urls: mediaUrls,
        condition: formData.condition,
        status: 'active',
        listing_type: formData.listingType,
      } as any);

      if (error) {
        setErrors({ submit: 'İlan oluşturulurken hata oluştu' });
        console.error('Create listing error:', error);
      } else {
        // Consume free quota for sale/rental listings
        if (needsQuota) {
          await consumeFreeQuota(user.id);
        }

        // Submit to moderation queue (AI auto-approves high-score content)
        if (data?.id) {
          await submitForModeration(
            'listing',
            data.id,
            user.id,
            formData.description,
            formData.title,
            mediaUrls || undefined
          );
        }

        toast.success('İlan başarıyla yayınlandı!');
        router.push('/pazar');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrors({ submit: 'Bir hata oluştu' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Yeni İlan Oluştur
          </h1>
          <p className="text-text-muted">
            Ürününüzü komşularınızla paylaşın ve satın alabilecek kişiler bulun. Fotoğraf eklemek ilanınıza daha fazla ilgi çeker.
          </p>
        </div>

        {/* Quota Info Banner */}
        {quotaInfo && (formData.listingType === 'sale' || formData.listingType === 'rental') && (
          <div className={`rounded-lg border p-4 mb-2 ${quotaInfo.canPostFree ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-300'}`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${quotaInfo.canPostFree ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                {quotaInfo.canPostFree ? (
                  <p className="text-sm text-green-800">
                    <strong>Ücretsiz ilan hakkınız var!</strong> Bu yıl {quotaInfo.remainingFree} adet ücretsiz Satılık/Kiralık ilan yayınlayabilirsiniz.
                  </p>
                ) : (
                  <div>
                    <p className="text-sm text-red-800 font-bold mb-1">
                      Ücretsiz ilan hakkınız doldu!
                    </p>
                    <p className="text-sm text-red-700">
                      Bu yıl için {FREE_LISTING_LIMIT} adet ücretsiz Satılık/Kiralık ilan hakkınızı kullandınız. Yeni ilan yayınlamak için {LISTING_FEE.toFixed(2)} ₺ ödeme yapmanız gerekmektedir.
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      Ücretsiz ve Ödünç Ver kategorisindeki ilanlar her zaman ücretsizdir.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-xl font-bold text-text-primary mb-3">Ödeme Gerekli</h3>
              <p className="text-text-secondary mb-4">
                Yıllık ücretsiz ilan hakkınızı kullandınız. Bu ilanı yayınlamak için <strong>{LISTING_FEE.toFixed(2)} ₺</strong> ödeme yapmanız gerekmektedir.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">İlan ücreti</span>
                  <span className="font-semibold">{LISTING_FEE.toFixed(2)} ₺</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text-primary">Toplam</span>
                    <span className="font-bold text-primary text-lg">{LISTING_FEE.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 border border-border text-text-secondary rounded-lg font-medium hover:bg-background transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    toast.info('Ödeme sistemi yakında aktif olacak. İlanınız şimdilik ücretsiz yayınlanmıştır.');
                    // TODO: Integrate actual payment gateway (Iyzico/Stripe)
                    router.push('/pazar');
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                >
                  Ödeme Yap
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Type Selector */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <label className="block text-sm font-semibold text-text-primary mb-4">
              İlan Türü <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LISTING_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    listingType: type.value,
                    isFree: type.value === 'free',
                    price: type.value !== 'sale' ? '' : prev.price,
                  }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    formData.listingType === type.value
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border hover:border-primary hover:bg-background text-text-secondary'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm font-semibold">{type.label}</span>
                  <span className="text-xs text-text-muted">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex justify-between text-xs font-medium text-text-muted mb-2">
              <span>Adım 1/3 - Fotoğraflar</span>
              <span>{Math.round((100 / 3) * (formData.photos.length > 0 ? 1 : 0) + (100 / 3) * (formData.title ? 1 : 0) + (100 / 3) * (formData.category ? 1 : 0))}%</span>
            </div>
            <div className="w-full bg-[#e0e0e0] rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${Math.round((100 / 3) * (formData.photos.length > 0 ? 1 : 0) + (100 / 3) * (formData.title ? 1 : 0) + (100 / 3) * (formData.category ? 1 : 0))}%` }}
              ></div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <label className="block text-sm font-semibold text-text-primary mb-4">
              Fotoğraflar <span className="text-red-500">*</span>
            </label>

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-green-50'
                  : 'border-border bg-background'
              } ${errors.photos ? 'border-red-500 bg-red-50' : ''}`}
            >
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/quicktime,video/webm"
                onChange={handlePhotoInput}
                className="hidden"
                id="photo-input"
              />
              <label htmlFor="photo-input" className="cursor-pointer">
                <ImagePlus
                  className={`mx-auto h-12 w-12 mb-3 ${
                    dragActive || errors.photos
                      ? 'text-primary'
                      : 'text-text-muted'
                  }`}
                />
                <p className="text-sm font-semibold text-text-primary">
                  Fotoğraf veya Video ekleyin
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Sürükle ve bırak ya da tıkla (max 10 dosya, max 2 video)
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
                    className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                  >
                    {photo.type === 'video' ? (
                      <>
                        <video
                          src={photo.preview}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                          Video
                        </span>
                      </>
                    ) : (
                      <img
                        src={photo.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-text-muted">
                {formData.photos.length > 0 ? (
                  <>İlk fotoğraf ilan resminde gösterilecek</>
                ) : (
                  <>Daha fazla fotoğraf = daha fazla ilgi</>
                )}
              </p>
              <p className="text-xs font-medium text-text-muted">
                {formData.photos.length}/10
              </p>
            </div>
          </div>

          {/* Title Input */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              İlan Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Satılık ürünü tanımlayan başlık yazın"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <p
                className={`text-xs ${
                  errors.title ? 'text-red-600' : 'text-text-muted'
                }`}
              >
                {errors.title || 'Ürünü açıklayan net bir başlık yazın'}
              </p>
              <p className="text-xs font-medium text-text-muted">
                {formData.title.length}/100
              </p>
            </div>
          </div>

          {/* Category and Condition Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-surface rounded-lg border border-border p-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full px-4 py-3 border rounded-lg text-left flex justify-between items-center focus:outline-none focus:ring-2 transition-colors ${
                    errors.category
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-border focus:ring-primary'
                  }`}
                >
                  <span
                    className={
                      formData.category
                        ? 'text-text-primary'
                        : 'text-text-muted'
                    }
                  >
                    {formData.category || 'Kategori seçin'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full px-4 py-3 text-left hover:bg-background transition-colors ${
                          formData.category === category
                            ? 'bg-primary-light text-primary font-medium'
                            : 'text-text-secondary'
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
            <div className="bg-surface rounded-lg border border-border p-6">
              <label className="block text-sm font-semibold text-text-primary mb-3">
                Durum <span className="text-red-500">*</span>
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
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="ml-3 text-text-secondary">
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

          {/* Price Section - only shown for sale */}
          {formData.listingType === 'sale' && (
            <div className="bg-surface rounded-lg border border-border p-6">
              <label className="block text-sm font-semibold text-text-primary mb-3">
                Fiyat <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-muted font-semibold">
                  ₺
                </span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="Fiyat girin"
                  min="0"
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.price
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-border focus:ring-primary'
                  }`}
                />
              </div>

              {errors.price && (
                <p className="text-red-600 text-sm mt-2">{errors.price}</p>
              )}
            </div>
          )}

          {/* Rental price - optional for rental */}
          {(formData.listingType === 'rental') && (
            <div className="bg-surface rounded-lg border border-border p-6">
              <label className="block text-sm font-semibold text-text-primary mb-3">
                Kira Bedeli (İsteğe Bağlı)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-muted font-semibold">₺</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="Günlük/haftalık kira bedeli"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Açıklama <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Ürünün durumu, özellikleri ve neden satıyor olduğunuz hakkında detay bilgi verin. Çeşitli açıklamalar daha fazla ilgi çeker."
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <p
                className={`text-xs ${
                  errors.description ? 'text-red-600' : 'text-text-muted'
                }`}
              >
                {errors.description || 'Ürün hakkında detaylı bilgi sağlayanlar daha fazla satış yapar'}
              </p>
              <p className="text-xs font-medium text-text-muted">
                {formData.description.length}/1000
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Konum
            </label>
            <div className="flex items-center gap-3 bg-background p-3 rounded-lg">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-text-primary font-medium flex-grow">
                {formData.location}
              </span>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    'Konum değiştirme özelliği henüz uygulanmadı.'
                  )
                }
                className="px-3 py-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors text-sm font-medium border border-border"
              >
                Değiştir
              </button>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Teslimat Seçenekleri <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.deliveryOptions.pickup}
                  onChange={(e) =>
                    handleDeliveryChange('pickup', e.target.checked)
                  }
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <span className="ml-3 text-text-secondary">Elden Teslim (Yüz Yüze)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.deliveryOptions.shipping}
                  onChange={(e) =>
                    handleDeliveryChange('shipping', e.target.checked)
                  }
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <span className="ml-3 text-text-secondary">Kargo ile Gönderim</span>
              </label>
            </div>
            {errors.delivery && (
              <p className="text-red-600 text-sm mt-2">{errors.delivery}</p>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-gradient-to-br from-[#f0f2f5] to-[#e6f4ec] rounded-lg border border-primary border-dashed p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              İlan Önizlemesi
            </h3>

            <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Preview Image */}
              {formData.photos.length > 0 && (
                <div className="h-48 bg-background overflow-hidden">
                  <img
                    src={formData.photos[0].preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {formData.photos.length === 0 && (
                <div className="h-48 bg-background flex items-center justify-center">
                  <p className="text-text-muted">Fotoğraf henüz eklenmedi</p>
                </div>
              )}

              {/* Preview Content */}
              <div className="p-4">
                <h4 className="font-semibold text-text-primary text-lg mb-2 line-clamp-2">
                  {formData.title || 'İlan Başlığı'}
                </h4>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-2xl font-bold text-primary mb-0.5">
                      {formData.isFree ? 'Ücretsiz' : formData.price ? `₺${Number(formData.price).toLocaleString('tr-TR')}` : '₺0'}
                    </p>
                    <p className="text-sm text-text-muted">
                      {formData.category || 'Kategori'}
                    </p>
                  </div>
                  <span className="text-xs bg-background text-text-primary px-2 py-1 rounded border border-border">
                    {formData.condition
                      ? CONDITIONS.find((c) => c.value === formData.condition)
                        ?.label
                      : 'Durum'}
                  </span>
                </div>

                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                  {formData.description || 'Açıklama yazın...'}
                </p>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <MapPin className="h-4 w-4" />
                  {formData.location}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-surface py-4 px-4 -mx-4 sm:-mx-6 lg:-mx-8 border-t border-border shadow-lg">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-border text-text-secondary rounded-lg font-medium hover:bg-background transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!canSubmit() || isSubmitting}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                canSubmit() && !isSubmitting
                  ? 'bg-primary text-white hover:bg-primary-hover shadow-md'
                  : 'bg-[#e0e0e0] text-text-muted cursor-not-allowed'
              }`}
            >
              {isSubmitting
                ? 'Yayınlanıyor...'
                : quotaBlocked && (formData.listingType === 'sale' || formData.listingType === 'rental')
                  ? 'İlan Hakkınız Doldu'
                  : 'İlanı Yayınla'}
            </button>
          </div>

          {/* Form Validation Info */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Lütfen aşağıdaki hataları düzeltin:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button Loading State */}
          {isSubmitting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <div className="animate-spin">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-sm text-blue-800">İlan yayınlanıyor...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}