"use client";

import { toast } from '@/lib/utils/show-toast';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { getProfile, updateProfile } from '@/lib/hooks/use-profile';
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
  avatar: getAvatarUrl('1', 0),
  bio: "Mahalle temsilcisi ve sosyal aktiviteler koordinatörü.",
  neighborhood: "Güngören, İstanbul",
};

export default function AyarlarPage() {
  const { user, profile } = useCurrentUser();
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
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.full_name || mockUser.name,
        email: profile.email || mockUser.email,
        phone: profile.phone || mockUser.phone,
        bio: profile.bio || mockUser.bio,
      });
    }
  }, [profile]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Giriş yapmanız gerekir');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await updateProfile(user.id, {
        full_name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
      });

      if (!error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        console.error('Failed to save profile:', error);
        toast.error('Profil kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Profil kaydedilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Hesap Ayarları</h1>
            <p className="text-sm text-text-muted mt-1">
              Profilinizi ve tercihlerinizi yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Profile Section */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Profil Bilgileri</h2>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="relative">
              <Image
                src={mockUser.avatar}
                alt={profileData.name}
                width={80}
                height={80}
                unoptimized
                className="w-20 h-20 rounded-full bg-background"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {profileData.name}
              </h3>
              <p className="text-sm text-text-muted">{mockUser.neighborhood}</p>
              <button className="mt-2 text-sm text-primary hover:text-primary-hover font-medium transition-colors">
                Fotoğraf Değiştir
              </button>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                placeholder="Adınızı girin"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                E-posta Adresi
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                placeholder="example@email.com"
              />
              <p className="text-xs text-text-muted mt-2">
                E-posta adresinizi değiştirmek için doğrulama gereklidir
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                Telefon Numarası
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                placeholder="+90 555 123 4567"
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Biyografi
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                rows={4}
                placeholder="Kendiniz hakkında biraz bilgi yazın..."
              />
              <p className="text-xs text-text-muted mt-2">
                Maksimum 500 karakter
              </p>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Dil Tercihi
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none bg-surface"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Şifre Güvenliği</h2>

          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Mevcut Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Mevcut şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
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
              <label className="block text-sm font-medium text-text-primary mb-2">
                Yeni Şifre
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Yeni şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2">
                En az 8 karakter, bir büyük harf, bir sayı içermelidir
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Şifreyi Onayla
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Şifrenizi tekrar girin"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
              Şifreyi Güncelle
            </button>
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-text-primary">Diğer Ayarlar</h2>
          {settingsSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block bg-surface rounded-lg border border-border p-4 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${section.color} text-primary`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{section.title}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted mt-2" />
              </div>
            </Link>
          ))}
        </div>

        {/* Account Status Section */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Hesap Durumu</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="text-sm font-medium text-text-primary">Hesap Durumu</p>
                <p className="text-xs text-text-muted">Aktif</p>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="text-sm font-medium text-text-primary">Son Giriş</p>
                <p className="text-xs text-text-muted">10 Mart 2026, 14:32</p>
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
              <p className="text-sm text-text-muted mt-1">
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
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              saved
                ? "bg-primary text-white"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Kaydedildi
              </span>
            ) : isLoading ? (
              "Kaydediliyor..."
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
