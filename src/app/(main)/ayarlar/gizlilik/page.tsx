"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Eye,
  MessageSquare,
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
type MessageOption = "everyone" | "neighborhood" | "nobody";

export default function GizlilikPage() {
  const [profileVisibility, setProfileVisibility] =
    useState<VisibilityOption>("neighborhood");
  const [messagePermission, setMessagePermission] =
    useState<MessageOption>("neighborhood");
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

  const messageOptions = [
    {
      value: "everyone" as MessageOption,
      label: "Herkes",
      description: "Tüm kullanıcılar size mesaj gönderebilir",
    },
    {
      value: "neighborhood" as MessageOption,
      label: "Sadece Mahalle",
      description: "Yalnızca mahallenizdeki kişiler mesaj gönderebilir",
    },
    {
      value: "nobody" as MessageOption,
      label: "Hiçkimse",
      description: "Kimse size mesaj gönderemez",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/ayarlar"
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#333]" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f0f2f5] rounded-lg">
              <Lock className="w-6 h-6 text-[#00833e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#333]">Gizlilik Ayarları</h1>
              <p className="text-sm text-[#8f8f8f]">
                Profilinizi ve verilerinizi kontrol edin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Visibility */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#f0f2f5] rounded-lg">
              <Eye className="w-5 h-5 text-[#00833e]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#333]">
                Profil Görünürlüğü
              </h2>
              <p className="text-sm text-[#8f8f8f]">
                Profilinizi kimler görebileceğini seçin
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {visibilityOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-[#f0f2f5] cursor-pointer transition-colors border border-transparent hover:border-[#e0e0e0]"
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
                  <span className="text-[#404040] font-medium block">
                    {option.label}
                  </span>
                  <span className="text-sm text-[#8f8f8f]">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message Permissions */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#f0f2f5] rounded-lg">
              <MessageSquare className="w-5 h-5 text-[#00833e]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#333]">
                Bana Mesaj Gönderebilecekler
              </h2>
              <p className="text-sm text-[#8f8f8f]">
                Kime mesaj yazmasına izin vereceğinizi seçin
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {messageOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-[#f0f2f5] cursor-pointer transition-colors border border-transparent hover:border-[#e0e0e0]"
              >
                <input
                  type="radio"
                  name="messagePermission"
                  value={option.value}
                  checked={messagePermission === option.value}
                  onChange={(e) =>
                    setMessagePermission(e.target.value as MessageOption)
                  }
                  className="w-4 h-4 accent-[#00833e] mt-1 flex-shrink-0"
                />
                <div>
                  <span className="text-[#404040] font-medium block">
                    {option.label}
                  </span>
                  <span className="text-sm text-[#8f8f8f]">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy Toggle Options */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-6">Görünürlük Seçenekleri</h2>
          <div className="space-y-4">
            {/* Location on Map */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#00833e]" />
                <div>
                  <h3 className="font-semibold text-[#333]">
                    Haritada Konumumu Göster
                  </h3>
                  <p className="text-sm text-[#8f8f8f]">
                    Komşularınız sizi mahalle haritasında görebilir
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationOnMap(!showLocationOnMap)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showLocationOnMap ? "bg-[#00833e]" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    showLocationOnMap ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Members List */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#00833e]" />
                <div>
                  <h3 className="font-semibold text-[#333]">
                    Mahalle Üyeleri Listesinde Görün
                  </h3>
                  <p className="text-sm text-[#8f8f8f]">
                    Diğer üyelerin görebileceği listede yer al
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInMembersList(!showInMembersList)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showInMembersList ? "bg-[#00833e]" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    showInMembersList ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Search Results */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#00833e]" />
                <div>
                  <h3 className="font-semibold text-[#333]">
                    Arama Sonuçlarında Görün
                  </h3>
                  <p className="text-sm text-[#8f8f8f]">
                    Profil aramalarında görünür ol
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInSearch(!showInSearch)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showInSearch ? "bg-[#00833e]" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    showInSearch ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Activity Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#00833e]" />
                <div>
                  <h3 className="font-semibold text-[#333]">
                    Aktif Durumunu Göster
                  </h3>
                  <p className="text-sm text-[#8f8f8f]">
                    Diğerleri ne zaman aktif olduğunuzu görebilir
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowActivityStatus(!showActivityStatus)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                  showActivityStatus ? "bg-[#00833e]" : "bg-[#e0e0e0]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    showActivityStatus ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Block List */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4">
            Engellenen Kullanıcılar
          </h2>
          {blockedUsers.length > 0 ? (
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#f0f2f5] hover:bg-[#e8eaed] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      {user.avatar}
                    </div>
                    <span className="text-[#404040] font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={() => unblockUser(user.id)}
                    className="px-4 py-2 text-sm font-semibold text-[#00833e] hover:bg-white rounded-lg transition-colors"
                  >
                    Engeli Kaldır
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-[#8f8f8f]">
                Herhangi bir engellenen kullanıcı yok
              </p>
            </div>
          )}
          <button className="w-full mt-4 py-2 px-4 border border-[#e0e0e0] text-[#333] font-medium rounded-lg hover:bg-[#f0f2f5] transition-colors">
            Yeni Kullanıcı Engelle
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4">Veri Yönetimi</h2>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-[#f0f2f5] border border-[#e0e0e0] text-[#333] font-semibold rounded-lg hover:bg-[#e8eaed] transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Verilerimizi İndir
            </button>
            <button className="w-full py-3 px-4 bg-[#f0f2f5] border border-[#e0e0e0] text-[#333] font-semibold rounded-lg hover:bg-[#e8eaed] transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-5 h-5" />
              Tüm Gönderileri Sil
            </button>
          </div>
          <p className="text-xs text-[#8f8f8f] mt-4">
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
              <p className="text-sm text-[#8f8f8f] mb-4">
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
                ? "bg-[#00833e] text-white"
                : "bg-[#00833e] text-white hover:bg-[#006b32]"
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
            className="py-3 px-4 rounded-lg font-semibold bg-white border border-[#e0e0e0] text-[#333] hover:bg-[#f0f2f5] transition-colors"
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
