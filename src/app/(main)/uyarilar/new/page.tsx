'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const severityOptions = [
  { value: 'low', label: 'Düşük', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'medium', label: 'Orta', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'high', label: 'Yüksek', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'critical', label: 'Kritik', color: 'bg-red-100 text-red-800 border-red-300' },
];

const categoryOptions = [
  { value: 'security', label: 'Güvenlik' },
  { value: 'weather', label: 'Hava Durumu' },
  { value: 'traffic', label: 'Trafik' },
  { value: 'emergency', label: 'Afet' },
  { value: 'other', label: 'Diğer' },
];

export default function NewAlertPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [category, setCategory] = useState('security');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/uyarilar');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back */}
        <Link
          href="/uyarilar"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-4"
        >
          <ArrowLeft size={16} />
          Uyarılara Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h1 className="text-2xl font-bold text-[#333] mb-6">Yeni Uyarı Paylaş</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1.5">Başlık</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Uyarı başlığı yazın..."
                className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1.5">Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detaylı açıklama yazın..."
                rows={4}
                className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] resize-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1.5">Konum</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f8f8f]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Konum belirtin..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1.5">Önem Derecesi</label>
              <div className="flex gap-2">
                {severityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSeverity(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      severity === opt.value ? opt.color : 'border-[#e0e0e0] text-[#8f8f8f]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Uyarı Paylaş
              </button>
              <Link
                href="/uyarilar"
                className="px-6 py-2.5 border border-[#e0e0e0] text-[#333] font-medium rounded-lg hover:bg-[#f0f2f5] transition-colors"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
