'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Check } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const mockUser = {
  id: '1',
  name: 'Ayşe Yılmaz',
  email: 'ayse.yilmaz@example.com',
  phone: '+90 555 123 4567',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  bio: 'Mahalle temsilcisi ve sosyal aktiviteler koordinatörü.',
  neighborhood: 'Güngören, İstanbul',
  birthDate: '1990-05-15',
};

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    bio: mockUser.bio,
    birthDate: mockUser.birthDate,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    console.log('Saving:', formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Fotoğrafı</h2>

        <div className="flex items-end gap-6">
          <Image
            src={mockUser.avatar}
            alt={mockUser.name}
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-600"
          />
          <div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Fotoğraf Yükle
            </button>
            <p className="text-sm text-gray-600 mt-2">
              JPG, PNG, GIF olarak maksimum 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hesap Bilgileri</h2>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ad Soyad
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              E-mail Adresi
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">
              <span className="text-emerald-600 font-semibold">✓ Doğrulanmış</span>
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Telefon Numarası
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Doğum Tarihi
            </label>
            <Input
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Biyografi
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={4}
              placeholder="Kendiniz hakkında kısaca anlatın..."
              className="w-full"
            />
          </div>

          {/* Neighborhood Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mahalle
            </label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
              {mockUser.neighborhood}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Mahalleyi ayarlar bölümünde değiştirebilirsiniz.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {isSaved && <Check className="w-4 h-4" />}
              {isSaved ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Şifre Değiştir</h2>

        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mevcut Şifre
            </label>
            <Input
              type="password"
              placeholder="Mevcut şifrenizi girin"
              className="w-full"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Yeni Şifre
            </label>
            <Input
              type="password"
              placeholder="Yeni şifrenizi girin"
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">
              En az 8 karakter, bir büyük harf, bir küçük harf ve bir sayı içermelidir.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Şifreyi Onayla
            </label>
            <Input
              type="password"
              placeholder="Yeni şifrenizi tekrar girin"
              className="w-full"
            />
          </div>

          {/* Change Password Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Şifreyi Değiştir
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-900 mb-6">Tehlikeli Bölge</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-red-900 mb-2">Hesabı Sil</h3>
            <p className="text-red-800 mb-4">
              Hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz.
            </p>
            <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
