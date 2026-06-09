'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Lock, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGroup } from '@/lib/hooks/use-groups-businesses';
import { useCurrentUser } from '@/lib/hooks/use-auth';

// NOT (2026-06-07): Bu formdan SADECE gerçekten kaydedilen alanlar bırakıldı
// (ad, açıklama, kategori, gizlilik). Kaldırılanlar: sahte "üye davet et" (uydurma
// kişiler, hiçbir yere yazılmıyordu), "grup kuralları" (groups tablosunda kolon
// yok → sessizce yok sayılıyordu) ve "kapak resmi" (yüklense de kaydedilmiyordu;
// grup için ayrılmış storage bucket'ı yok). Bkz. TECH_DEBT #12 — bu üçü ileride
// gerçek altyapıyla (rules kolonu / group-images bucket + RLS) eklenebilir.

const categories = [
  'Sosyal',
  'Hobi',
  'Spor',
  'Eğitim',
  'Yardımlaşma',
  'Mahalle',
  'Sağlık',
  'Teknoloji',
];

export default function CreateGroupPage() {
  const router = useRouter();
  const { user, neighborhood } = useCurrentUser();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sosyal',
    privacy: 'public' as 'public' | 'private',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubmitError('Giriş yapmalısınız.');
      return;
    }
    if (!formData.name.trim()) {
      setSubmitError('Grup adı zorunludur.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');

    const slug =
      formData.name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() +
      '-' +
      Date.now().toString(36);

    const { error } = await createGroup({
      name: formData.name,
      slug,
      description: formData.description || undefined,
      category: formData.category,
      is_private: formData.privacy === 'private',
      neighborhood_id: neighborhood?.id,
      created_by: user.id,
    });

    setIsSubmitting(false);
    if (error) {
      setSubmitError('Grup oluşturulamadı: ' + error.message);
      return;
    }
    router.push(`/gruplar/${slug}`);
  };

  const isSubmitDisabled = !formData.name.trim();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/gruplar"
          className="flex items-center gap-2 mb-8 text-primary hover:text-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Gruplara Geri Dön</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Grup Oluştur</h1>
              <p className="text-gray-600 mb-8">
                İlgi alanlarınız etrafında bir grup oluşturun ve komşularınızla bağlantı kurun.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Group Name with Character Count */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">Grup Adı</label>
                    <span className="text-xs font-medium text-gray-500">
                      {formData.name.length}/50
                    </span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Örn: Komşu Kahvaltıları"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value.slice(0, 50) })
                    }
                    maxLength={50}
                    className="w-full border"
                    style={{ borderColor: '#e0e0e0' }}
                  />
                </div>

                {/* Description with Character Count */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Grup Açıklaması
                    </label>
                    <span className="text-xs font-medium text-gray-500">
                      {formData.description.length}/500
                    </span>
                  </div>
                  <Textarea
                    placeholder="Grubun amacını ve faaliyet alanlarını anlatın..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value.slice(0, 500) })
                    }
                    maxLength={500}
                    rows={4}
                    className="w-full border resize-none"
                    style={{ borderColor: '#e0e0e0' }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                    style={{ borderColor: '#e0e0e0' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Privacy Settings */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Grup Gizliliği
                  </label>
                  <div className="space-y-3">
                    <label
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                      style={{ borderColor: '#e0e0e0' }}
                    >
                      <input
                        type="radio"
                        name="privacy"
                        value="public"
                        checked={formData.privacy === 'public'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            privacy: e.target.value as 'public' | 'private',
                          })
                        }
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-gray-900">Açık Grup</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Herkes gruba katılabilir ve içeriği görebilir
                        </p>
                      </div>
                    </label>
                    <label
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                      style={{ borderColor: '#e0e0e0' }}
                    >
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={formData.privacy === 'private'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            privacy: e.target.value as 'public' | 'private',
                          })
                        }
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-gray-900">Kapalı Grup</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Katılım için yönetici onayı gerekir
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                {submitError && <p className="text-sm text-red-600 py-2">{submitError}</p>}
                <div className="flex gap-3 pt-6 border-t" style={{ borderColor: '#e0e0e0' }}>
                  <Link href="/gruplar" className="flex-1">
                    <Button variant="outline" className="w-full">
                      İptal Et
                    </Button>
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitDisabled || isSubmitting}
                    className="flex-1 text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: isSubmitDisabled ? '#ccc' : '#00833e' }}
                  >
                    {isSubmitting ? 'Oluşturuluyor...' : 'Grup Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Önizleme</h3>
              <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                {/* Cover placeholder — degrade (kapak yükleme yok) */}
                <div className="aspect-video bg-gradient-to-r from-[#e6f4ec] to-green-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {(formData.name || 'G').charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 truncate mb-2">
                    {formData.name || 'Grup Adı'}
                  </h2>

                  <div className="mb-3">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: '#00833e' }}
                    >
                      {formData.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {formData.description || 'Grup açıklaması burada görünecek...'}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-gray-700">
                    {formData.privacy === 'public' ? (
                      <>
                        <Globe className="w-4 h-4 text-primary" />
                        Açık Grup
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-primary" />
                        Kapalı Grup
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>Yeni grup</span>
                  </div>
                </div>
              </div>

              {/* Form Status */}
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#f0f2f5' }}>
                <p className="text-xs font-semibold text-gray-700 mb-2">Tamamlanma Durumu</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: formData.name ? '#00833e' : '#e0e0e0' }}
                    />
                    Grup Adı {formData.name && '✓'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: formData.description ? '#00833e' : '#e0e0e0' }}
                    />
                    Açıklama {formData.description && '✓'}
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
