'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Users,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = [
  'Sosyal',
  'Hobi',
  'Spor',
  'Kültür',
  'Eğitim',
  'Sosyal Sorumluluk',
  'Sanat',
  'Teknoloji',
];

export default function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sosyal',
    rules: '',
    coverImage: null as File | null,
  });

  const [preview, setPreview] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Back Button */}
          <Link href="/gruplar" className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Gruplara Geri Dön</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yeni Grup Oluştur
          </h1>
          <p className="text-gray-600 mb-8">
            İlgi alanlarınız etrafında bir grup oluşturun ve komşularınızla bağlantı kurun.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Grup Adı
              </label>
              <Input
                type="text"
                placeholder="Örn: Komşu Kahvaltıları"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Grup Açıklaması
              </label>
              <Textarea
                placeholder="Grubun amacını ve faaliyet alanlarını anlatın..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00833e]" />
                Kapak Resmi
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="cover-image"
                />
                <label
                  htmlFor="cover-image"
                  className="block border-2 border-dashed border-[#34d399] rounded-lg p-8 text-center cursor-pointer hover:border-[#00833e] hover:bg-[#e6f4ec] transition-colors"
                >
                  {preview ? (
                    <div className="space-y-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-sm text-[#00833e] font-medium">
                        Değiştirmek için tıklayın
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 mx-auto text-[#34d399]" />
                      <p className="font-medium text-gray-900">
                        Resim yüklemek için tıklayın
                      </p>
                      <p className="text-sm text-gray-500">
                        veya sürükleyip bırakın
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Group Rules */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00833e]" />
                Grup Kuralları
              </label>
              <Textarea
                placeholder="Grubun kurallarını ve yönergeleri yazın..."
                value={formData.rules}
                onChange={(e) =>
                  setFormData({ ...formData, rules: e.target.value })
                }
                rows={4}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Grup kuralları tüm üyelerin göreceği şekilde görüntülenecektir.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6 border-t">
              <Link href="/gruplar" className="flex-1">
                <Button variant="outline" className="w-full">
                  İptal Et
                </Button>
              </Link>
              <button
                type="submit"
                className="flex-1 bg-[#00833e] hover:bg-[#006b32] text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Grup Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
