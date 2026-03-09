"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Smartphone,
  Globe,
  LogOut,
  ChevronRight,
  Camera,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Bell,
  Lock,
  MapPin,
} from "lucide-react";

const mockUser = {
  id: "1",
  name: "Ayşe Yılmaz",
  email: "ayse.yilmaz@example.com",
  phone: "+90 555 123 4567",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  bio: "Mahalle temsilcisi ve sosyal aktiviteler koordinatörü.",
  neighborhood: "Güngören, İstanbul",
};

export default function AyarlarPage() {
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    bio: mockUser.bio,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [language, setLanguage] = useState("tr");
  const [saved, setSaved] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const settingsSections = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Bildirim Ayarları",
      description: "E-posta ve push bildirimleri yönetin",
      href: "/ayarlar/bildirimler",
      color: "bg-blue-50",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Gizlilik Ayarları",
      description: "Profil görünürlüğü ve mesaj izinleri",
      href: "/ayarlar/gizlilik",
      color: "bg-purple-50",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Mahalle Ayarları",
      description: "Mahalle ve ilgi alanlarını yönetin",
      href: "/ayarlar/mahalle",
      color: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-[#333]">Hesap Ayarları</h1>
            <p className="text-sm text-[#8f8f8f] mt-1">
              Profilinizi ve tercihlerinizi yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-6">Profil Bilgileri</h2>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#e0e0e0]">
            <div className="relative">
              <Image
                src={profileData.email || mockUser.avatar}
                alt="Profile"
                width={80}
                height={80}
                unoptimized
                className="w-20 h-20 rounded-full bg-[#f0f2f5]"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#333]">
                {profileData.name}
              </h3>
              <p className="text-sm text-[#8f8f8f]">{mockUser.neighborhood}</p>
              <button className="mt-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors">
                Fotoğraf Değiştir
              </button>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors"
                placeholder="Adınızı girin"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00833e]" />
                E-posta Adresi
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors"
                placeholder="example@email.com"
              />
              <p className="text-xs text-[#8f8f8f] mt-2">
                E-posta adresinizi değiştirmek için doğrulama gereklidir
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#00833e]" />
                Telefon Numarası
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors"
                placeholder="+90 555 123 4567"
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Biyografi
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors resize-none"
                rows={4}
                placeholder="Kendiniz hakkında biraz bilgi yazın..."
              />
              <p className="text-xs text-[#8f8f8f] mt-2">
                Maksimum 500 karakter
              </p>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00833e]" />
                Dil Tercihi
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors appearance-none bg-white"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-6">Şifre Güvenliği</h2>

          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Mevcut Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors"
                  placeholder="Mevcut şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#333]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Yeni Şifre
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors"
                  placeholder="Yeni şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#333]"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-[#8f8f8f] mt-2">
                En az 8 karakter, bir büyük harf, bir sayı içermelidir
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Şifreyi Onayla
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] transition-colors"
                  placeholder="Şifrenizi tekrar girin"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#333]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button className="w-full py-3 px-4 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b32] transition-colors">
              Şifreyi Güncelle
            </button>
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-[#333]">Diğer Ayarlar</h2>
          {settingsSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block bg-white rounded-lg border border-[#e0e0e0] p-4 hover:border-[#00833e] hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${section.color} text-[#00833e]`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#333]">{section.title}</h3>
                  <p className="text-sm text-[#8f8f8f] mt-1">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#8f8f8f] mt-2" />
              </div>
            </Link>
          ))}
        </div>

        {/* Account Status Section */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4">Hesap Durumu</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#f0f2f5] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#333]">Hesap Durumu</p>
                <p className="text-xs text-[#8f8f8f]">Aktif</p>
              </div>
              <div className="w-3 h-3 bg-[#00833e] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#f0f2f5] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#333]">Son Giriş</p>
                <p className="text-xs text-[#8f8f8f]">10 Mart 2026, 14:32</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-red-700">Tehlikeli İşlemler</h2>
              <p className="text-sm text-[#8f8f8f] mt-1">
                Bu işlemler geri alınamaz. Lütfen dikkatli olun.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-red-100 border border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">
              Hesabı Geçici Olarak Devre Dışı Bırak
            </button>
            <button className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Hesabı Kalıcı Olarak Sil
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              saved
                ? "bg-[#00833e] text-white"
                : "bg-[#00833e] text-white hover:bg-[#006b32]"
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Kaydedildi
              </span>
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
