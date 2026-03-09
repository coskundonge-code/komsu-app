'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, Image as ImageIcon, Globe, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function EventForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    isOnline: false,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Button */}
      <Link href="/etkinlikler" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
        <ArrowLeft className="w-4 h-4" />
        <span>Geri Dön</span>
      </Link>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Etkinlik Başlığı
        </label>
        <Input
          type="text"
          placeholder="Örn: Komşu Kahvaltısı"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
          className="w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Açıklama
        </label>
        <Textarea
          placeholder="Etkinlik hakkında detaylı bilgi girin..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={5}
          className="w-full"
        />
      </div>

      {/* Date and Time */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Tarih
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Saat
          </label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          İnsan Sayısı Sınırı
        </label>
        <Input
          type="number"
          placeholder="Maksimum katılımcı sayısı (boş bırakırsanız sınırsız)"
          value={formData.maxAttendees}
          onChange={(e) =>
            setFormData({ ...formData, maxAttendees: e.target.value })
          }
          min="1"
        />
      </div>

      {/* Online Toggle */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Globe className="w-5 h-5 text-emerald-600" />
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={formData.isOnline}
            onChange={(e) =>
              setFormData({ ...formData, isOnline: e.target.checked })
            }
            className="w-4 h-4 rounded border-gray-300 text-emerald-600"
          />
          <span className="text-gray-700 font-medium">
            Çevrimiçi Etkinlik
          </span>
        </label>
      </div>

      {/* Location Input */}
      {!formData.isOnline && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Konum
          </label>
          <Input
            type="text"
            placeholder="Etkinlik konumunu girin..."
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required={!formData.isOnline}
          />
        </div>
      )}

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-600" />
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
            className="block border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            {preview ? (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-emerald-600 font-medium">
                  Değiştirmek için tıklayın
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto text-emerald-300" />
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

      {/* Submit Button */}
      <div className="flex gap-3 pt-6 border-t">
        <Link href="/etkinlikler" className="flex-1">
          <Button variant="outline" className="w-full">
            İptal Et
          </Button>
        </Link>
        <button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          Etkinlik Oluştur
        </button>
      </div>
    </form>
  );
}
