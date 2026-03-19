"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'
import {
  Camera,
  Check,
  X,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  Users,
  Heart,
} from "lucide-react";

interface ProfileFormData {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  phone: string;
  neighborhood: string;
  address: string;
  interests: string[];
  skills: string[];
  avatar: string;
  coverImage: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface BioCounterProps {
  current: number;
  max: number;
}

const INTERESTS = [
  "Yemek",
  "Spor",
  "Müzik",
  "Bahçecilik",
  "Evcil Hayvanlar",
  "Teknoloji",
  "Sanat",
  "Çocuklar",
  "Yaşlı Bakımı",
];

const mockProfileData: ProfileFormData = {
  fullName: "Coşkun Dönge",
  firstName: "Coşkun",
  lastName: "Dönge",
  email: "coskun@example.com",
  bio: "Mahalle gönüllüsü. Komşu topluluğunu geliştirmede tutkulu.",
  phone: "+90 555 123 4567",
  neighborhood: "Moda",
  address: "Mimar Sinan Cad. No: 45",
  interests: ["Spor", "Müzik", "Teknoloji"],
  skills: ["Elektrik Onarımı", "İnsan Kaynakları"],
  avatar: getFeedImageUrl(78, 200, 200),
  coverImage: getFeedImageUrl(78, 1200, 400),
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ad gereklidir";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Soyad gereklidir";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }
    if (formData.bio.length > 300) {
      newErrors.bio = "Biyografi 300 karakterden fazla olamaz";
    }
    if (formData.phone && !/^(\+90|0)\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Geçerli bir telefon numarası girin";
    }
    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = "Mahalle gereklidir";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Adres gereklidir";
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
    // Update fullName when first or last name changes
    if (field === "firstName" || field === "lastName") {
      setFormData((prev) => ({
        ...prev,
        fullName: `${field === "firstName" ? value : prev.firstName} ${field === "lastName" ? value : prev.lastName}`,
      }));
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
      console.log("Form saved:", formData);
    }
  };

  const handleCancel = () => {
    setFormData(mockProfileData);
    setErrors({});
  };

  const bioCharLimit = 300;
  const bioPercentage = (formData.bio.length / bioCharLimit) * 100;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Profilimi Düzenle</h1>
          <p className="text-text-muted text-lg">
            Profil bilgilerinizi güncelleyin ve mahallenizdeki komşularla daha iyi bağlantı kurun
          </p>
        </div>

        {/* Success Message */}
        {isSaved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in slide-in-from-top">
            <Check size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-700 font-medium">Profil başarıyla kaydedildi!</p>
              <p className="text-green-600 text-sm">Değişiklikleriniz kaydedilmiştir</p>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-surface rounded-xl shadow-lg border border-border overflow-hidden">
          {/* Cover Photo Section */}
          <div className="relative h-56 bg-gradient-to-br from-primary via-[#00833e] to-primary-hover overflow-hidden group">
            <Image
              src={formData.coverImage}
              alt="Kapak Fotoğrafı"
              width={1200}
              height={400}
              className="w-full h-full object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {/* Cover Upload Button */}
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-surface hover:bg-background text-text-primary font-medium rounded-lg transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 hover:shadow-xl"
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
            {/* Avatar Section - Positioned over cover */}
            <div className="mb-10 -mt-16 flex items-end gap-6">
              <div className="relative group flex-shrink-0">
                <div className="relative w-36 h-36 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white text-5xl font-bold overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src={formData.avatar}
                    alt="Profil Fotoğrafı"
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-primary hover:bg-primary-hover text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                  title="Profil fotoğrafını değiştir"
                >
                  <Camera size={20} />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-text-primary font-bold text-2xl mb-1">{formData.fullName}</h2>
                <p className="text-text-muted text-sm">
                  JPG, PNG veya GIF formatı. En fazla 5MB boyutta
                </p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8 pb-8 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Users size={22} className="text-primary" />
                Kişisel Bilgiler
              </h2>

              <div className="space-y-5">
                {/* First and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Ad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Adınız"
                      className={`w-full px-4 py-3 border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.firstName ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Soyadınız"
                      className={`w-full px-4 py-3 border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.lastName ? "border-red-500" : "border-border"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    E-posta
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="ornek@email.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.email ? "border-red-500" : "border-border"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Bio with Character Counter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-text-primary">
                      Biyografi
                    </label>
                    <span
                      className={`text-xs font-medium ${
                        bioPercentage > 90
                          ? "text-red-600"
                          : bioPercentage > 70
                          ? "text-orange-600"
                          : "text-text-muted"
                      }`}
                    >
                      {formData.bio.length}/{bioCharLimit}
                    </span>
                  </div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Kendiniz hakkında kısaca yazın..."
                    maxLength={bioCharLimit}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                      errors.bio ? "border-red-500" : "border-border"
                    }`}
                  />
                  {/* Character Counter Progress Bar */}
                  <div className="mt-2 h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        bioPercentage > 90
                          ? "bg-red-500"
                          : bioPercentage > 70
                          ? "bg-orange-500"
                          : "bg-primary"
                      }`}
                      style={{ width: `${bioPercentage}%` }}
                    />
                  </div>
                  {errors.bio && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.bio}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Telefon Numarası
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3 text-text-muted" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+90 555 123 4567"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.phone ? "border-red-500" : "border-border"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8 pb-8 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <MapPin size={22} className="text-primary" />
                Konum Bilgileri
              </h2>

              <div className="space-y-5">
                {/* Neighborhood */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Mahalle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                    placeholder="Örn: Moda, Beşiktaş, Cihangir"
                    className={`w-full px-4 py-3 border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.neighborhood ? "border-red-500" : "border-border"
                    }`}
                  />
                  {errors.neighborhood && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.neighborhood}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Adres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Sokak adı, bina numarası vb."
                    className={`w-full px-4 py-3 border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.address ? "border-red-500" : "border-border"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.address}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-text-muted">
                    Tam adres paylaşmazsanız, sadece mahalle adınız gösterilecektir
                  </p>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="mb-8 pb-8 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                <Heart size={22} className="text-primary" />
                İlgi Alanları
              </h2>

              <p className="text-sm text-text-muted mb-6">
                İlgi alanlarınızı seçerek komşularınızla ortak ilgi alanlarını keşfedin
              </p>

              <div className="flex flex-wrap gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm border-2 ${
                      formData.interests.includes(interest)
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-surface text-text-primary border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                <Users size={22} className="text-primary" />
                Beceriler & Uzmanlık
              </h2>

              <p className="text-sm text-text-muted mb-6">
                Komşularınıza yardımcı olabileceğiniz beceriler ekleyin
              </p>

              {/* Add Skill Input */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Örn: Elektrik Onarımı, Çatı Tamir"
                  className="flex-1 px-4 py-3 border border-border rounded-lg bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  Ekle
                </button>
              </div>

              {/* Skills List */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <span className="text-sm font-medium text-primary-hover">{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-primary-hover hover:text-red-600 transition-colors"
                        title="Beceri sil"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.skills.length === 0 && (
                <p className="text-sm text-text-muted italic">
                  Henüz beceri eklenmemiştir. Yukarıya yazarak başlayın.
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-8 border-t border-border">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
              >
                <Check size={20} />
                Değişiklikleri Kaydet
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-border hover:border-primary hover:bg-background text-text-primary font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <X size={20} />
                İptal Et
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
