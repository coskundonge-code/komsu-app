'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Camera,
  Check,
  X,
  AlertCircle,
  MapPin,
  Phone,
  Users,
  Heart,
} from 'lucide-react';

interface ProfileFormData {
  fullName: string;
  bio: string;
  phone: string;
  neighborhood: string;
  district: string;
  city: string;
  interests: string[];
  skills: string[];
  avatar: string;
  coverImage: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const INTERESTS = [
  'Yemek',
  'Spor',
  'Müzik',
  'Bahçecilik',
  'Evcil Hayvanlar',
  'Teknoloji',
  'Sanat',
  'Çocuklar',
  'Yaşlı Bakımı',
];

const mockProfileData: ProfileFormData = {
  fullName: 'Coşkun Dönge',
  bio: 'Mahalle gönüllüsü. Komşu topluluğunu geliştirmede tutkulu.',
  phone: '+90 555 123 4567',
  neighborhood: 'Moda',
  district: 'Kadıköy',
  city: 'İstanbul',
  interests: ['Spor', 'Müzik', 'Teknoloji'],
  skills: ['Elektrik Onarımı', 'İnsan Kaynakları'],
  avatar: 'https://picsum.photos/200/200?random=78',
  coverImage: 'https://picsum.photos/1200/400?random=78',
};

export default function ProfileEditPage() {
  const [formData, setFormData] = useState<ProfileFormData>(mockProfileData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaved, setIsSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ad Soyad gereklidir';
    }
    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio 500 karakterden fazla olamaz';
    }
    if (formData.phone && !/^(\+90|0)\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }
    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'Mahalle gereklidir';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'İlçe gereklidir';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Şehir gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          coverImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      console.log('Form saved:', formData);
    }
  };

  const handleCancel = () => {
    setFormData(mockProfileData);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333] mb-2">Profilimi Düzenle</h1>
          <p className="text-[#8f8f8f]">Profil bilgilerinizi güncelleyin ve mahallenizdeki komşularla daha iyi bağlantı kurun</p>
        </div>

        {/* Success Message */}
        {isSaved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check size={20} className="text-green-600" />
            <p className="text-green-700 font-medium">Profil başarıyla kaydedildi!</p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-[#e0e0e0]">
          {/* Cover Photo Section */}
          <div className="relative h-40 bg-gradient-to-r from-[#00833e] to-[#006b32] overflow-hidden group">
            <Image
              src={formData.coverImage}
              alt="Kapak Fotoğrafı"
              width={1200}
              height={400}
              className="w-full h-full object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Cover Upload Button */}
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#f0f2f5] text-[#333] font-medium rounded-lg transition-colors shadow-lg opacity-0 group-hover:opacity-100"
            >
              <Camera size={18} />
              Kapağı Değiştir
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {/* Avatar Section */}
            <div className="mb-8 flex items-end gap-4">
              <div className="relative group">
                <div className="w-28 h-28 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-xl flex items-center justify-center text-white text-5xl font-bold overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={formData.avatar}
                    alt="Profil Fotoğrafı"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#00833e] hover:bg-[#006b32] text-white rounded-lg transition-colors shadow-lg"
                >
                  <Camera size={18} />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-[#333] font-semibold text-lg">Profil Fotoğrafı</p>
                <p className="text-[#8f8f8f] text-sm">JPG, PNG veya GIF. Maks 5MB</p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8 pb-8 border-b border-[#e0e0e0]">
              <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#00833e]" />
                Kişisel Bilgiler
              </h2>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Adınız ve Soyadınız"
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50 ${
                      errors.fullName ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Biyografi ({formData.bio.length}/500)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Kendiniz hakkında kısaca yazın..."
                    maxLength={500}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50 resize-none ${
                      errors.bio ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.bio}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+90 555 123 4567"
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50 ${
                      errors.phone ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8 pb-8 border-b border-[#e0e0e0]">
              <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-[#00833e]" />
                Adres Bilgileri
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Neighborhood */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Mahalle
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    placeholder="Mahalleniz"
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50 ${
                      errors.neighborhood ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                  />
                  {errors.neighborhood && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.neighborhood}
                    </p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    İlçe
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="İlçeniz"
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50 ${
                      errors.district ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Şehir
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Şehriniz"
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50 ${
                      errors.city ? 'border-red-500' : 'border-[#e0e0e0]'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="mb-8 pb-8 border-b border-[#e0e0e0]">
              <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                <Heart size={20} className="text-[#00833e]" />
                İlgi Alanları
              </h2>

              <p className="text-sm text-[#8f8f8f] mb-4">
                İlgi alanlarınızı seçerek komşularınızla ortak ilgi alanlarını bulun
              </p>

              <div className="flex flex-wrap gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm border-2 ${
                      formData.interests.includes(interest)
                        ? 'bg-[#00833e] text-white border-[#00833e]'
                        : 'bg-white text-[#333] border-[#e0e0e0] hover:border-[#00833e] hover:text-[#00833e]'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#00833e]" />
                Beceriler
              </h2>

              <p className="text-sm text-[#8f8f8f] mb-4">
                Komşularınıza yardımcı olabileceğiniz beceriler ekleyin
              </p>

              {/* Add Skill Input */}
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Yeni bir beceri ekleyin (ör: Elektrik Onarımı)"
                  className="flex-1 px-4 py-3 border border-[#e0e0e0] rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50"
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors"
                >
                  Ekle
                </button>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00833e]/10 border border-[#00833e]/30 rounded-full"
                  >
                    <span className="text-sm font-medium text-[#006b32]">{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-[#006b32] hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-[#e0e0e0]">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Kaydet
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-[#e0e0e0] hover:bg-[#f0f2f5] text-[#333] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} />
                İptal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
