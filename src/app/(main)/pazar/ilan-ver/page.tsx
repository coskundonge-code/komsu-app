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
  'Ev & Yaşam',
  'Spor',
  'Kitap',
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
  'Giyim': '1b2cc5c7-8f2e-4e8a-bb5e-c5e5e5e5e5e5',
  'Ev & Yaşam': '2c3dd6d8-9g3f-5f9b-cc6f-d6f6f6f6f6f6',
  'Spor': '3d4ee7e9-0h4g-6g0c-dd7g-e7g7g7g7g7g7',
  'Kitap': '4e5ff8f0-1i5h-7h1d-ee8h-f8h8h8h8h8h8',
  'Araç': '5f6gg9g1-2j6i-8i2e-ff9i-g9i9i9i9i9i9',
  'Diğer': '6g7hh0h2-3k7j-9j3f-gg0j-h0j0j0j0j0j0',
};

interface CreateListingInput {
  title: string;
  description: string;
  category_id: string;
  listing_type: ListingType;
  condition: string;
  price?: number;
  is_free: boolean;
  location: string;
  delivery_options: {
    pickup: boolean;
    shipping: boolean;
  };
  status: 'active' | 'draft';
}

const DEFAULT_FORM_DATA: ListingFormData = {
  listingType: 'sale',
  title: '',
  category: 'Elektronik',
  condition: 'good',
  price: '',
  isFree: false,
  description: '',
  photos: [],
  location: '',
  deliveryOptions: {
    pickup: false,
    shipping: false,
  },
};

export default function IlanVerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>(DEFAULT_FORM_DATA);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotaBlocked, setQuotaBlocked] = useState(false);
  const [quotaBlockReason, setQuotaBlockReason] = useState('');

  useEffect(() => {
    const checkQuota = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const user = await supabase.auth.getUser();

        if (!user.data.user?.id) {
          router.push('/login');
          return;
        }

        const canPost = await checkCanPost(user.data.user.id);

        if (!canPost.allowed) {
          setQuotaBlocked(true);
          setQuotaBlockReason(canPost.reason || 'You have reached the posting limit');
        }
      } catch (error) {
        console.error('Quota check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkQuota();
  }, [router]);

  if (quotaBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border border-red-200">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Posting Limit Reached
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {quotaBlockReason}
          </p>
          <button
            onClick={() => router.push('/pazar')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleListingTypeChange = (type: ListingType) => {
    setFormData((prev) => ({
      ...prev,
      listingType: type,
      isFree: type === 'free',
      price: type === 'free' ? '' : prev.price,
    }));
  };

  const handleMediaUpload = async (files: FileList) => {
    if (!files) return;

    const newItems: MediaItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        toast.error('Please upload only images or videos');
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newItems.push({
          id: `${Date.now()}-${i}`,
          file,
          preview: e.target?.result as string,
          type: isVideo ? 'video' : 'image',
        });

        if (newItems.length === files.length || i === files.length - 1) {
          setMediaItems((prev) => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    if (!formData.isFree && !formData.price.trim()) {
      toast.error('Please enter a price');
      return;
    }

    if (formData.listingType === 'sale' && !formData.isFree && !formData.price) {
      toast.error('Price is required for sale listings');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (mediaItems.length === 0) {
      toast.error('Please upload at least one image or video');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const user = await supabase.auth.getUser();

      if (!user.data.user?.id) {
        router.push('/login');
        return;
      }

      const uploadedMedia = await uploadMultipleMedia(
        mediaItems.map((item) => item.file),
        'listings'
      );

      const moderatedFiles = await moderateMediaFiles(
        mediaItems.map((item) => item.file)
      );

      const contentAnalysis = await analyzeContent({
        title: formData.title,
        description: formData.description,
      });

      const listingInput: CreateListingInput = {
        title: formData.title,
        description: formData.description,
        category_id: CATEGORY_ID_MAP[formData.category],
        listing_type: formData.listingType,
        condition: formData.condition,
        price: formData.isFree ? null : (parseFloat(formData.price) || null),
        is_free: formData.isFree,
        location: formData.location,
        delivery_options: formData.deliveryOptions,
        status: 'active',
      };

      const listing = await createListing({
        ...listingInput,
        user_id: user.data.user.id,
        media_urls: uploadedMedia,
        moderation_status: contentAnalysis.flagged ? 'pending_review' : 'approved',
      });

      if (contentAnalysis.flagged || moderatedFiles.some((f) => f.flagged)) {
        await submitForModeration({
          listing_id: listing.id,
          reason: 'Content flagged for review',
          flagged_items: moderatedFiles.filter((f) => f.flagged).map((f) => f.name),
        });
      }

      await consumeFreeQuota(user.data.user.id);

      toast.success('Listing created successfully!');
      router.push(`/pazar/${listing.id}`);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Post Your Item
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Share what you want to sell, give away, or rent
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Listing Type Selection */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What are you doing?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LISTING_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleListingTypeChange(type.value)}
                  className={`p-4 rounded-lg border-2 transition text-center ${
                    formData.listingType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-sm text-gray-800">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Title & Category */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Item title (required)"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Condition & Price */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Item Condition & Price</h2>
            <div className="space-y-4">
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, condition: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>

              {!formData.isFree && (
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-600">₺</span>
                  <input
                    type="number"
                    placeholder="Price (optional)"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <MapPin className="inline w-5 h-5 mr-2" />
              Location
            </h2>
            <input
              type="text"
              placeholder="Where are you located?"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </section>

          {/* Description */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
            <textarea
              placeholder="Tell people more about your item (required)"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </section>

          {/* Media Upload */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <ImagePlus className="inline w-5 h-5 mr-2" />
              Photos & Videos
            </h2>
            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleMediaUpload(e.target.files as FileList)}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload images or videos</p>
                  <p className="text-xs text-gray-500">PNG, JPG, MP4 up to 50MB each</p>
                </div>
              </label>

              {mediaItems.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaItems.map((item) => (
                    <div key={item.id} className="relative rounded-lg overflow-hidden">
                      {item.type === 'image' ? (
                        <img
                          src={item.preview}
                          alt="preview"
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <video
                          src={item.preview}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(item.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="text-white text-center">
                            <div className="text-3xl mb-2">🎥</div>
                            <p className="text-xs">Video</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Delivery Options */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Options</h2>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.deliveryOptions.pickup}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryOptions: {
                        ...prev.deliveryOptions,
                        pickup: e.target.checked,
                      },
                    }))
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">Local Pickup</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.deliveryOptions.shipping}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryOptions: {
                        ...prev.deliveryOptions,
                        shipping: e.target.checked,
                      },
                    }))
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">Shipping Available</span>
              </label>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Create Listing
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}