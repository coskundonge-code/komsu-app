'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Camera,
  Check,
  User,
  Bell,
  Shield,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
  Smartphone,
  Mail,
  Clock,
  LogOut,
} from 'lucide-react';
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
  neighborhoodId: 'gungorenistanbul',
  birthDate: '1990-05-15',
};

// Toggle Switch Component
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// Tab Button Component
function TabButton({
  isActive,
  onClick,
  icon: Icon,
  label,
  mobileOnly = false,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  mobileOnly?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
        mobileOnly ? 'md:hidden' : ''
      } ${
        isActive
          ? 'bg-[#00833e] text-white'
          : 'text-[#333] hover:bg-[#f0f2f5]'
      }`}
    >
      {Icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [isSaved, setIsSaved] = useState(false);

  // Account Tab State
  const [accountData, setAccountData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    bio: mockUser.bio,
    birthDate: mockUser.birthDate,
    avatar: mockUser.avatar,
  });

  // Notifications Tab State
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    inAppEnabled: true,
    pushPost: true,
    pushComment: true,
    pushEvent: true,
    emailPost: false,
    emailComment: false,
    emailEvent: true,
  });

  // Privacy Tab State
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'mahalle', // mahalle, herkes, kimse
    messageVisibility: 'mahalle',
    locationSharing: false,
    showOnlineStatus: true,
    allowMessages: 'mahalle',
  });

  // Neighborhood Tab State
  const [neighborhood, setNeighborhood] = useState({
    current: mockUser.neighborhood,
    mapPreference: 'satellite', // satellite, street, hybrid
  });

  // Security Tab State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    showPassword: false,
  });

  const [loginHistory] = useState([
    {
      id: 1,
      device: 'Chrome - Windows',
      ip: '192.168.1.100',
      date: '2026-03-10 14:32',
      location: 'İstanbul, Türkiye',
    },
    {
      id: 2,
      device: 'Safari - iPhone',
      ip: '192.168.1.101',
      date: '2026-03-09 09:15',
      location: 'İstanbul, Türkiye',
    },
    {
      id: 3,
      device: 'Chrome - Windows',
      ip: '192.168.1.100',
      date: '2026-03-08 18:45',
      location: 'İstanbul, Türkiye',
    },
  ]);

  const handleSaveAccount = () => {
    console.log('Saving account:', accountData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSavePrivacy = () => {
    console.log('Saving privacy:', privacy);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChangePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert('Şifreler eşleşmiyor');
      return;
    }
    console.log('Changing password');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setSecurity({
      ...security,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333]">Ayarlar</h1>
          <p className="text-[#8f8f8f] mt-2">Hesap ve gizlilik ayarlarınızı yönetin</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs - Desktop */}
          <div className="hidden md:flex flex-col w-48 space-y-2">
            <TabButton
              isActive={activeTab === 'account'}
              onClick={() => setActiveTab('account')}
              icon={<User className="w-5 h-5" />}
              label="Hesap"
            />
            <TabButton
              isActive={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
              icon={<Bell className="w-5 h-5" />}
              label="Bildirimler"
            />
            <TabButton
              isActive={activeTab === 'privacy'}
              onClick={() => setActiveTab('privacy')}
              icon={<Shield className="w-5 h-5" />}
              label="Gizlilik"
            />
            <TabButton
              isActive={activeTab === 'neighborhood'}
              onClick={() => setActiveTab('neighborhood')}
              icon={<MapPin className="w-5 h-5" />}
              label="Mahalle"
            />
            <TabButton
              isActive={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
              icon={<Lock className="w-5 h-5" />}
              label="Güvenlik"
            />
          </div>

          {/* Mobile Horizontal Tabs */}
          <div className="md:hidden overflow-x-auto pb-2 mb-6">
            <div className="flex gap-2 min-w-max px-2">
              <TabButton
                isActive={activeTab === 'account'}
                onClick={() => setActiveTab('account')}
                icon={<User className="w-4 h-4" />}
                label="Hesap"
              />
              <TabButton
                isActive={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
                icon={<Bell className="w-4 h-4" />}
                label="Bildirimler"
              />
              <TabButton
                isActive={activeTab === 'privacy'}
                onClick={() => setActiveTab('privacy')}
                icon={<Shield className="w-4 h-4" />}
                label="Gizlilik"
              />
              <TabButton
                isActive={activeTab === 'neighborhood'}
                onClick={() => setActiveTab('neighborhood')}
                icon={<MapPin className="w-4 h-4" />}
                label="Mahalle"
              />
              <TabButton
                isActive={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
                icon={<Lock className="w-4 h-4" />}
                label="Güvenlik"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Hesap Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
                    Profil Fotoğrafı
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                    <Image
                      src={accountData.avatar}
                      alt={accountData.name}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#00833e]"
                    />
                    <div className="flex-1">
                      <button className="bg-[#00833e] hover:bg-[#006b32] text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 inline-flex">
                        <Camera className="w-4 h-4" />
                        Fotoğraf Yükle
                      </button>
                      <p className="text-sm text-[#8f8f8f] mt-2">
                        JPG, PNG, GIF olarak maksimum 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
                    Hesap Bilgileri
                  </h2>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Ad Soyad
                      </label>
                      <Input
                        type="text"
                        value={accountData.name}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        E-mail Adresi
                      </label>
                      <Input
                        type="email"
                        value={accountData.email}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            email: e.target.value,
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                      />
                      <p className="text-sm text-[#8f8f8f] mt-2">
                        <span className="text-[#00833e] font-semibold">
                          ✓ Doğrulanmış
                        </span>
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Telefon Numarası
                      </label>
                      <Input
                        type="tel"
                        value={accountData.phone}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Doğum Tarihi
                      </label>
                      <Input
                        type="date"
                        value={accountData.birthDate}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Biyografi
                      </label>
                      <Textarea
                        value={accountData.bio}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            bio: e.target.value,
                          })
                        }
                        rows={4}
                        placeholder="Kendiniz hakkında kısaca anlatın..."
                        className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* Neighborhood Info */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Mahalle
                      </label>
                      <div className="px-4 py-2 bg-[#f0f2f5] rounded-lg text-[#333]">
                        {mockUser.neighborhood}
                      </div>
                      <p className="text-sm text-[#8f8f8f] mt-2">
                        Mahalleyi Mahalle ayarlarında değiştirebilirsiniz.
                      </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-6 border-t border-[#e0e0e0]">
                      <button
                        onClick={handleSaveAccount}
                        className="bg-[#00833e] hover:bg-[#006b32] text-white px-8 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        {isSaved && <Check className="w-4 h-4" />}
                        {isSaved ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bildirimler Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-8">
                  Bildirim Ayarları
                </h2>

                <div className="space-y-8">
                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#333]">
                      Bildirim Kanalları
                    </h3>

                    <div className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5] transition-colors">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-[#8f8f8f]" />
                        <div>
                          <p className="font-medium text-[#333]">Push Bildirimleri</p>
                          <p className="text-sm text-[#8f8f8f]">
                            Anlık bildirimler al
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={notifications.pushEnabled}
                        onChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            pushEnabled: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5] transition-colors">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#8f8f8f]" />
                        <div>
                          <p className="font-medium text-[#333]">E-mail Bildirimleri</p>
                          <p className="text-sm text-[#8f8f8f]">
                            E-posta ile özet bildirim al
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={notifications.emailEnabled}
                        onChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            emailEnabled: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5] transition-colors">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-[#8f8f8f]" />
                        <div>
                          <p className="font-medium text-[#333]">Uygulama İçi Bildirimler</p>
                          <p className="text-sm text-[#8f8f8f]">
                            Uygulamada göster
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={notifications.inAppEnabled}
                        onChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            inAppEnabled: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#333]">Bildirim Türleri</h3>

                    <div className="space-y-3">
                      <div className="p-4 border border-[#e0e0e0] rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#333]">Yeni Gönderiler</p>
                            <p className="text-sm text-[#8f8f8f]">
                              Mahalledeki yeni gönderiler hakkında
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#8f8f8f]">Push</span>
                              <ToggleSwitch
                                checked={notifications.pushPost}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    pushPost: checked,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#8f8f8f]">E-posta</span>
                              <ToggleSwitch
                                checked={notifications.emailPost}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    emailPost: checked,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-[#e0e0e0] rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#333]">Yorum ve Cevaplar</p>
                            <p className="text-sm text-[#8f8f8f]">
                              Gönderilerinize yapılan yorumlar
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#8f8f8f]">Push</span>
                              <ToggleSwitch
                                checked={notifications.pushComment}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    pushComment: checked,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#8f8f8f]">E-posta</span>
                              <ToggleSwitch
                                checked={notifications.emailComment}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    emailComment: checked,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-[#e0e0e0] rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#333]">Etkinlikler</p>
                            <p className="text-sm text-[#8f8f8f]">
                              Mahallede yapılan etkinlikleri takip et
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#8f8f8f]">Push</span>
                              <ToggleSwitch
                                checked={notifications.pushEvent}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    pushEvent: checked,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#8f8f8f]">E-posta</span>
                              <ToggleSwitch
                                checked={notifications.emailEvent}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    emailEvent: checked,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-[#e0e0e0]">
                    <button
                      onClick={handleSaveNotifications}
                      className="bg-[#00833e] hover:bg-[#006b32] text-white px-8 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      {isSaved && <Check className="w-4 h-4" />}
                      {isSaved ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gizlilik Tab */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-8">
                  Gizlilik Ayarları
                </h2>

                <div className="space-y-8">
                  {/* Who can see your profile */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#333]">
                      Profil Görünürlüğü
                    </h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Profilinizi kimler görebilir?
                    </p>

                    <div className="space-y-3">
                      {[
                        {
                          id: 'mahalle',
                          label: 'Sadece Mahalle Üyeleri',
                          desc: 'Sadece aynı mahallede oturanlar görebilir',
                        },
                        {
                          id: 'herkes',
                          label: 'Herkes',
                          desc: 'Tüm KomşuApp kullanıcıları görebilir',
                        },
                        {
                          id: 'kimse',
                          label: 'Kimse',
                          desc: 'Başka kimse göremez (sadece sen)',
                        },
                      ].map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 p-4 border border-[#e0e0e0] rounded-lg cursor-pointer hover:bg-[#f0f2f5] transition-colors"
                        >
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option.id}
                            checked={privacy.profileVisibility === option.id}
                            onChange={(e) =>
                              setPrivacy({
                                ...privacy,
                                profileVisibility: e.target.value,
                              })
                            }
                            className="w-4 h-4 accent-[#00833e]"
                          />
                          <div>
                            <p className="font-medium text-[#333]">
                              {option.label}
                            </p>
                            <p className="text-sm text-[#8f8f8f]">
                              {option.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Who can message you */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#333]">
                      Mesaj Gönderebilecekler
                    </h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Size özel mesaj gönderebilecek kişiler
                    </p>

                    <div className="space-y-3">
                      {[
                        {
                          id: 'mahalle',
                          label: 'Mahalle Üyeleri',
                          desc: 'Sadece mahallede oturanlar',
                        },
                        {
                          id: 'takipci',
                          label: 'Takipçilerim',
                          desc: 'Seni takip eden kişiler',
                        },
                        {
                          id: 'kimse',
                          label: 'Kimse',
                          desc: 'Mesaj gönderme kapalı',
                        },
                      ].map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 p-4 border border-[#e0e0e0] rounded-lg cursor-pointer hover:bg-[#f0f2f5] transition-colors"
                        >
                          <input
                            type="radio"
                            name="allowMessages"
                            value={option.id}
                            checked={privacy.allowMessages === option.id}
                            onChange={(e) =>
                              setPrivacy({
                                ...privacy,
                                allowMessages: e.target.value,
                              })
                            }
                            className="w-4 h-4 accent-[#00833e]"
                          />
                          <div>
                            <p className="font-medium text-[#333]">
                              {option.label}
                            </p>
                            <p className="text-sm text-[#8f8f8f]">
                              {option.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location and Online Status */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#333]">
                      Konum ve Durum
                    </h3>

                    <div className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5] transition-colors">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#8f8f8f]" />
                        <div>
                          <p className="font-medium text-[#333]">
                            Konum Paylaşımı
                          </p>
                          <p className="text-sm text-[#8f8f8f]">
                            Haritada konumunu göster
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={privacy.locationSharing}
                        onChange={(checked) =>
                          setPrivacy({
                            ...privacy,
                            locationSharing: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5] transition-colors">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#8f8f8f]" />
                        <div>
                          <p className="font-medium text-[#333]">
                            Çevrimiçi Durumu Göster
                          </p>
                          <p className="text-sm text-[#8f8f8f]">
                            Son görülme zamanını göster
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={privacy.showOnlineStatus}
                        onChange={(checked) =>
                          setPrivacy({
                            ...privacy,
                            showOnlineStatus: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-[#e0e0e0]">
                    <button
                      onClick={handleSavePrivacy}
                      className="bg-[#00833e] hover:bg-[#006b32] text-white px-8 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      {isSaved && <Check className="w-4 h-4" />}
                      {isSaved ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mahalle Tab */}
            {activeTab === 'neighborhood' && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-8">
                  Mahalle Ayarları
                </h2>

                <div className="space-y-8">
                  {/* Current Neighborhood */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#333]">
                      Mevcut Mahallen
                    </h3>

                    <div className="p-6 border-2 border-[#00833e] rounded-lg bg-[#f0f2f5]">
                      <div className="flex items-center gap-4">
                        <MapPin className="w-8 h-8 text-[#00833e]" />
                        <div>
                          <p className="text-sm text-[#8f8f8f]">Bulunduğunuz Mahalle</p>
                          <p className="text-xl font-bold text-[#333]">
                            {neighborhood.current}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full sm:w-auto bg-[#00833e] hover:bg-[#006b32] text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center sm:justify-start gap-2">
                      <MapPin className="w-4 h-4" />
                      Mahalleyi Değiştir
                    </button>
                  </div>

                  {/* Map Preference */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#333]">
                      Harita Tercihi
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          id: 'satellite',
                          label: 'Uydu Görünümü',
                          desc: 'Uydu fotoğrafları ile harita göster',
                        },
                        {
                          id: 'street',
                          label: 'Sokak Görünümü',
                          desc: 'Sokak haritası göster',
                        },
                        {
                          id: 'hybrid',
                          label: 'Hibrit Görünüm',
                          desc: 'Sokak adlarını içeren uydu görünümü',
                        },
                      ].map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 p-4 border border-[#e0e0e0] rounded-lg cursor-pointer hover:bg-[#f0f2f5] transition-colors"
                        >
                          <input
                            type="radio"
                            name="mapPreference"
                            value={option.id}
                            checked={neighborhood.mapPreference === option.id}
                            onChange={(e) =>
                              setNeighborhood({
                                ...neighborhood,
                                mapPreference: e.target.value,
                              })
                            }
                            className="w-4 h-4 accent-[#00833e]"
                          />
                          <div>
                            <p className="font-medium text-[#333]">
                              {option.label}
                            </p>
                            <p className="text-sm text-[#8f8f8f]">
                              {option.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Neighborhood Info */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Bilgi</p>
                      <p className="text-sm text-blue-800">
                        Mahalleyi değiştirmek tüm yerel ağınızdaki bağlantıları
                        etkileyecektir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Güvenlik Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Change */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
                    Şifre Değiştir
                  </h2>

                  <div className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Mevcut Şifre
                      </label>
                      <Input
                        type="password"
                        placeholder="Mevcut şifrenizi girin"
                        value={security.currentPassword}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Yeni Şifre
                      </label>
                      <div className="relative">
                        <Input
                          type={
                            security.showPassword ? 'text' : 'password'
                          }
                          placeholder="Yeni şifrenizi girin"
                          value={security.newPassword}
                          onChange={(e) =>
                            setSecurity({
                              ...security,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSecurity({
                              ...security,
                              showPassword: !security.showPassword,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f]"
                        >
                          {security.showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-[#8f8f8f] mt-2">
                        En az 8 karakter, bir büyük harf, bir küçük harf ve bir
                        sayı içermelidir.
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">
                        Şifreyi Onayla
                      </label>
                      <Input
                        type="password"
                        placeholder="Yeni şifrenizi tekrar girin"
                        value={security.confirmPassword}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full border border-[#e0e0e0] rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* Change Password Button */}
                    <div className="flex justify-end pt-6 border-t border-[#e0e0e0]">
                      <button
                        onClick={handleChangePassword}
                        className="bg-[#00833e] hover:bg-[#006b32] text-white px-8 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Şifreyi Değiştir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
                    İki Faktörlü Kimlik Doğrulama
                  </h2>

                  <div className="flex items-start justify-between p-4 border border-[#e0e0e0] rounded-lg">
                    <div>
                      <p className="font-semibold text-[#333]">
                        2FA Etkinleştir
                      </p>
                      <p className="text-sm text-[#8f8f8f] mt-1">
                        Hesabınıza ekstra güvenlik katmanı ekleyin. Giriş sırasında
                        SMS veya authenticator uygulamasından kod gerekir.
                      </p>
                      {security.twoFactorEnabled && (
                        <p className="text-sm text-[#00833e] font-semibold mt-2">
                          ✓ 2FA Etkin
                        </p>
                      )}
                    </div>
                    <ToggleSwitch
                      checked={security.twoFactorEnabled}
                      onChange={(checked) =>
                        setSecurity({
                          ...security,
                          twoFactorEnabled: checked,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Login History */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
                    Giriş Geçmişi
                  </h2>

                  <div className="space-y-4">
                    {loginHistory.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5] transition-colors gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#333]">
                            {session.device}
                          </p>
                          <div className="text-sm text-[#8f8f8f] mt-1">
                            <p>{session.location}</p>
                            <p>{session.ip}</p>
                            <p>{session.date}</p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 whitespace-nowrap">
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-red-900 mb-6">
                    Tehlikeli Bölge
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-red-900 mb-2">Hesabı Sil</h3>
                      <p className="text-red-800 mb-4">
                        Hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz.
                        Bu işlem geri alınamaz.
                      </p>
                      <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                        Hesabı Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
