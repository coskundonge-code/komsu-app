'use client';

import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Condition = 'excellent' | 'good' | 'fair' | 'used';
export type Category = 'electronics' | 'furniture' | 'clothing' | 'books' | 'sports' | 'toys' | 'other';

export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  location: string;
  imageUrls: string[];
}

export interface ListingFormProps {
  onSubmit?: (data: ListingFormData) => void;
  onCancel?: () => void;
}

const categories: Array<{ value: Category; label: string }> = [
  { value: 'electronics', label: 'Elektronik' },
  { value: 'furniture', label: 'Mobilya' },
  { value: 'clothing', label: 'Giyim' },
  { value: 'books', label: 'Kitaplar' },
  { value: 'sports', label: 'Spor & Outdoor' },
  { value: 'toys', label: 'Oyuncaklar' },
  { value: 'other', label: 'Diğer' },
];

const conditions: Array<{ value: Condition; label: string }> = [
  { value: 'excellent', label: 'Mükemmel' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
  { value: 'used', label: 'Kullanılmış' },
];

export function ListingForm({ onSubmit, onCancel }: ListingFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [condition, setCondition] = useState<Condition>('good');
  const [location, setLocation] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddImage = (imageUrl: string) => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, imageUrl]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleAddImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !location.trim() || imageUrls.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      onSubmit?.({
        title,
        description,
        price: parseFloat(price),
        category,
        condition,
        location,
        imageUrls,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">İlan Ver</h1>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="İlanın başlığını girin"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ürünü detaylıca açıklayın..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Price & Location Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat (₺) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konum <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Mahalle/İlçe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Category & Condition Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum <span className="text-red-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {conditions.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotoğraflar <span className="text-red-500">*</span>
            <span className="text-xs font-normal text-gray-500 ml-1">
              (En fazla 5 resim)
            </span>
          </label>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Fotoğraf yüklemek için tıklayın
            </p>
            <p className="text-xs text-gray-500 mt-1">
              veya sürükleyip bırakın
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={imageUrls.length >= 5}
              onChange={(e) => {
                if (e.target.files) {
                  Array.from(e.target.files).forEach((file) => {
                    if (imageUrls.length < 5) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          handleAddImage(event.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  });
                }
              }}
              className="hidden"
            />
          </div>

          {/* Image Preview */}
          {imageUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Yüklenen Fotoğraflar ({imageUrls.length}/5)
              </p>
              <div className="grid grid-cols-3 gap-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all"
                    >
                      <X size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {imageUrls.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              Lütfen en az bir fotoğraf yükleyin
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !price || !location.trim() || imageUrls.length === 0}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Yükleniyor...' : 'İlanı Yayınla'}
          </button>
        </div>
      </div>
    </form>
  );
}
