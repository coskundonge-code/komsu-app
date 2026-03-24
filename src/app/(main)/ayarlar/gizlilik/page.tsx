"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Eye,
  MapPin,
  Users,
  Search,
  Trash2,
  AlertCircle,
  ChevronLeft,
  Check,
  Clock,
} from "lucide-react";

interface BlockedUser {
  id: string;
  name: string;
  avatar: string;
}

type VisibilityOption = "everyone" | "neighborhood" | "private";

export default function GizlilikPage() {
  const [profileVisibility, setProfileVisibility] =
    useState<VisibilityOption>("neighborhood");
  const [showLocationOnMap, setShowLocationOnMap] = useState(true);
  const [showInMembersList, setShowInMembersList] = useState(true);
  const [showInSearch, setShowInSearch] = useState(true);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [saved, setSaved] = useState(false);

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    { id: "1", name: "Ahmet K.", avatar: "👤" },
    { id: "2", name: "Fatma D.", avatar: "👤" },
    { id: "3", name: "Mehmet Y.", avatar: "👤" },
  ]);

  const unblockUser = (id: string) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const visibilityOptions = [
    { value: "everyone" as VisibilityOption, label: "Herkes", description: "Tüm kullanıcılar profilinizi görebilir" },
    {
      value: "neighborhood" as VisibilityOption,
      label: "Sadece Mahalle",
      description: "Yalnızca mahallenizdeki kişiler görebilir",
    },
    { value: "private" as VisibilityOption, label: "Gizli", description: "Profiliniz tamamen gizli" },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
          <Link
            href="/ayarlar"
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Gizlilik Ayarları</h1>
              <p className="text-sm text-text-muted">
                Profilinizi ve verilerinizi kontrol edin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Profile Visibility */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-background rounded-lg">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Profil Görünürlüğü
              </h2>
              <p className="text-sm text-text-muted">
                Profilinizi kimler görebileceğini seçin
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {visibilityOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-background cursor-pointer transition-colors border border-transparent hover:border-border"
              >
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option.value}
                  checked={profileVisibility === option.value}
                  onChange={(e) =>
                    setProfileVisibility(e.target.value as VisibilityOption)
                  }
                  className="w-4 h-4 accent-[#00833e] mt-1 flex-shrink-0"
                />
                <div>
                  <span className="text-text-secondary font-medium block">
                    {option.label}
                  </span>
                  <span className="text-sm text-text-muted">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>


        {/* Privacy Toggle Options */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Görünürlük Seçenekleri</h2>
          <div className="space-y-4">
            {/* Location on Map */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Haritada Konumumu Göster
                  </h3>
                  <p className="text-sm text-text-muted">
                    Komşularınız sizi mahalle haritasında görebilir
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationOnMap(!showLocationOnMap)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showLocationOnMap ? "bg-primary" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-surface transition-transform ${
                    showLocationOnMap ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Members List */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Mahalle Üyeleri Listesinde Görün
                  </h3>
                  <p className="text-sm text-text-muted">
                    Diğer üyelerin görebileceği listede yer al
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInMembersList(!showInMembersList)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showInMembersList ? "bg-primary" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-surface transition-transform ${
                    showInMembersList ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Search Results */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Arama Sonuçlarında Görün
                  </h3>
                  <p className="text-sm text-text-muted">
                    Profil aramalarında görünür ol
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInSearch(!showInSearch)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showInSearch ? "bg-primary" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-surface transition-transform ${
                    showInSearch ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Activity Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Aktif Durumunu Göster
                  </h3>
                  <p className="text-sm text-text-muted">
                    Diğerleri ne zaman aktif olduğunuzu görebilir
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowActivityStatus(!showActivityStatus)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showActivityStatus ? "bg-primary" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-surface transition-transform ${
                    showActivityStatus ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Block List */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Engellenen Kullanıcılar
          </h2>
          {blockedUsers.length > 0 ? (
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-[#e8eaed] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                      {user.avatar}
                    </div>
                    <span className="text-text-secondary font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={() => unblockUser(user.id)}
                    className="px-4 py-2 text-sm font-semibold text-primary hover:bg-surface rounded-lg transition-colors"
                  >
                    Engeli Kaldır
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-text-muted">
                Herhangi bir engellenen kullanıcı yok
              </p>
            </div>
          )}
          <button className="w-full mt-4 py-2 px-4 border border-border text-text-primary font-medium rounded-lg hover:bg-background transition-colors">
            Yeni Kullanıcı Engelle
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Veri Yönetimi</h2>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-background border border-border text-text-primary font-semibold rounded-lg hover:bg-[#e8eaed] transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Verilerimizi İndir
            </button>
            <button className="w-full py-3 px-4 bg-background border border-border text-text-primary font-semibold rounded-lg hover:bg-[#e8eaed] transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-5 h-5" />
              Tüm Gönderileri Sil
            </button>
          </div>
          <p className="text-xs text-text-muted mt-4">
            İndirme isteğiniz işlenecek ve tüm verileriniz güvenli bir şekilde indirilecektir.
          </p>
        </div>

        {/* Danger Zone - Account Deletion */}
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-700 mb-3">
                Tehlikeli Alan
              </h2>
              <p className="text-sm text-text-muted mb-4">
                Bu işlemler geri alınamaz. Lütfen dikkatli olun.
              </p>
              <button className="w-full py-3 px-4 bg-red-100 border border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-5 h-5" />
                Hesabımı Sil
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              saved
                ? "bg-primary text-white"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Kaydedildi
              </span>
            ) : (
              "Kaydet"
            )}
          </button>
          <Link
            href="/ayarlar"
            className="py-3 px-4 rounded-lg font-semibold bg-surface border border-border text-text-primary hover:bg-background transition-colors"
          >
            İptal
          </Link>
        </div>
      </div>
    </div>
  );
}

// Import placeholder - you can add an actual Download icon from lucide-react
function Download(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}
