"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'
import { useCurrentUser } from 'A/lib/hooks/use-auth';
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
  neighborhood: "Gùngören, İstanbul",
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
      alert('Giriş yapmanız gerekir');
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
        alert('Profil kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Profil kaydedilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const settingsSections = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Bildirim Ayarları",
      description: "E-posta ve push bildirimleri yöndetin",
      href: "/ayarlar/bildirimler",
      color: "bg-blue-50",
    },
    