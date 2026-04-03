'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Users,
  FileText,
  ImagePlus,
  Search,
  X,
  Lock,
  Globe,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGroup } from '@/lib/hooks/use-groups-businesses';
import { useCurrentUser } from '@/lib/hooks/use-auth';

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

// Mock member suggestions
const mockMembers = [
  { id: 1, name: 'Ahmet Kaya', avatar: '👨‍🦱' },
  { id: 2, name: 'Fatma Yılmaz', avatar: '👩‍🦰' },
  { id: 3, name: 'Murat Demir', avatar: '👨‍🦲' },
  { id: 4, name: 'Zeynep Çelik', avatar: '👩‍🦱' },
  { id: 5, name: 'Hasan Öztürk', avatar: '👨‍🦳' },
  { id: 6, name: 'Aydın Şahin', avatar: '👨‍🦱' },
];

const exampleRules = `1. Saygılı iletişim kuralı - Tüm üyeler birbirlerine saygılı davranmalı
2. Konuya uygun paylaşımlar - Sadece grubun konusuna ilgili içerik paylaşılmalı
3. Spam ve reklam yasak - Ticari içerik ve spam reklam kesinlikle yasak
4. Kişisel bilgiler - Kimse tarafından izin verilmemiş kişisel verileri paylaşma
5. Yapıcı tartışma - Çatışmalı durumlar yapıcı şekilde çözülmeli`;

export default function CreateGroupPage() {
  const router = useRouter();
  const { user, neighborhood } = useCurrentUser();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sosyal',
    rules: '',
    coverImage: null as File | null,
    privacy: 'public' as 'public' | 'private',
  });

  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<typeof mockMembers>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberSuggestions, setShowMemberSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pure function to get filtered suggestions - no side effects
  const getFilteredMembers = () => {
    return mockMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
        !invitedMembers.some((m) => m.id === member.id)
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = (member: typeof mockMembers[0]) => {
    setInvitedMembers([...invitedMembers, member]);
    setMemberSearch('');
    setShowMemberSuggestions(false);
  };

  const handleRemoveMember = (memberId: number) => {
    setInvitedMembers(invitedMembers.filter((m) => m.id !== memberId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setSubmitError('Giriş yapmalısınız.'); return; }
    if (!formData.name.trim()) { setSubmitError('Grup adı zorunludur.'); return; }
    setIsSubmitting(true);
    setSubmitError('');

    const slug = formData.name
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      .trim() + '-' + Date.now().toString(36);

    const { data, error } = await createGroup({
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
    router.push('/gruplar');
  };

  // Pure function to check if submit is disabled
  const isSubmitDisabled = !formData.name || !formData.description || !formData.category;

  const filteredMembers = getFilteredMembers();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/gruplar" className="flex items-center gap-2 mb-8 text-primary hover:text-primary-hover transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Gruplara Geri Dön</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Yeni Grup Oluştur
              </h1>
              <p className="text-gray-600 mb-8">
                İlgi alanlarınız etrafında bir grup oluşturun ve komşularınızla bağlantı kurun.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4 text-primary" />
                    Kapak Resmi
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="cover-image"
                    />
                    <label
                      htmlFor="cover-image"
                      className="block border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all hover:border-primary hover:bg-surface-hover"
                      style={{ borderColor: '#e0e0e0' }}
                    >
                      {coverImagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={coverImagePreview}
                            alt="Kapak Resmi Önizleme"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <p className="text-sm font-medium text-primary">
                            Değiştirmek için tıklayın
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <ImagePlus className="w-16 h-16 mx-auto text-primary" />
                          <p className="font-semibold text-gray-900 text-lg">
                            Resim yüklemek için tıklayın
                          </p>
                          <p className="text-sm text-gray-500">
                            veya sürükleyip bırakın (JPG, PNG)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Group Name with Character Count */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Grup Adı
                    </label>
                    <span className="text-xs font-medium text-gray-500">
                      {formData.name.length}/50
                    </span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Örn: Komşu Kahvaltıları"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value.slice(0, 50),
                      })
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
                      setFormData({
                        ...formData,
                        description: e.target.value.slice(0, 500),
                      })
                    }
                    maxLength={500}
                    rows={4}
                    className="w-full border resize-none"
                    style={{ borderColor: '#e0e0e0' }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
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
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{ borderColor: '#e0e0e0' }}>
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
                          <span className="font-semibold text-gray-900">
                            Açık Grup
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Herkes gruba katılabilir ve içeriği görebilir
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{ borderColor: '#e0e0e0' }}>
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
                          <span className="font-semibold text-gray-900">
                            Kapalı Grup
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Katılım için yönetici onayı gerekir
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Grup Kuralları
                  </label>
                  <Textarea
                    placeholder={exampleRules}
                    value={formData.rules}
                    onChange={(e) =>
                      setFormData({ ...formData, rules: e.target.value })
                    }
                    rows={6}
                    className="w-full border resize-none font-mono text-sm"
                    style={{ borderColor: '#e0e0e0' }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Grup kuralları tüm üyelerin göreceği şekilde görüntülenecektir.
                  </p>
                </div>

                {/* Invite Members */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Üye Davet Et
                  </label>
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Üye adı ile ara..."
                          value={memberSearch}
                          onChange={(e) => {
                            setMemberSearch(e.target.value);
                            setShowMemberSuggestions(true);
                          }}
                          onFocus={() => setShowMemberSuggestions(true)}
                          className="w-full pl-10 border"
                          style={{ borderColor: '#e0e0e0' }}
                        />
                      </div>
                    </div>

                    {/* Member Suggestions */}
                    {showMemberSuggestions && memberSearch && filteredMembers.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-surface border rounded-lg shadow-lg z-10" style={{ borderColor: '#e0e0e0' }}>
                        {filteredMembers.map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => handleAddMember(member)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors border-b last:border-b-0"
                            style={{ borderColor: '#e0e0e0' }}
                          >
                            <span className="text-xl">{member.avatar}</span>
                            <span className="font-medium text-gray-900">
                              {member.name}
                            </span>
                            <Plus className="w-4 h-4 ml-auto text-primary" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Invited Members List */}
                  {invitedMembers.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Davet Edilenler ({invitedMembers.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {invitedMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: '#00833e' }}
                          >
                            <span>{member.avatar}</span>
                            <span>{member.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="ml-1 hover:opacity-80 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                {submitError && (
                  <p className="text-sm text-red-600 py-2">{submitError}</p>
                )}
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
                    style={{
                      backgroundColor: isSubmitDisabled ? '#ccc' : '#00833e',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitDisabled) {
                        e.currentTarget.style.backgroundColor = '#006b32';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitDisabled) {
                        e.currentTarget.style.backgroundColor = '#00833e';
                      }
                    }}
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
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                Önizleme
              </h3>
              <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                {/* Group Card Preview */}
                <div className="aspect-video overflow-hidden bg-gray-200">
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview}
                      alt="Grup Kapak"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#f0f2f5' }}>
                      <ImagePlus className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Group Name */}
                  <h2 className="text-lg font-bold text-gray-900 truncate mb-2">
                    {formData.name || 'Grup Adı'}
                  </h2>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: '#00833e' }}
                    >
                      {formData.category}
                    </span>
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {formData.description || 'Grup açıklaması burada görünecek...'}
                  </p>

                  {/* Privacy Badge */}
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

                  {/* Members Count */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>
                      {invitedMembers.length > 0
                        ? `${invitedMembers.length} davetli üye`
                        : '0 üye'}
                    </span>
                  </div>

                  {/* Rules Preview */}
                  {formData.rules && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: '#e0e0e0' }}>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Kurallar Mevcut
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.rules.split('\n')[0].slice(0, 40)}...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Status */}
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#f0f2f5' }}>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Tamamlanma Durumu
                </p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: formData.name
                          ? '#00833e'
                          : '#e0e0e0',
                      }}
                    />
                    Grup Adı {formData.name && '✓'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: formData.description
                          ? '#00833e'
                          : '#e0e0e0',
                      }}
                    />
                    Açıklama {formData.description && '✓'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: coverImagePreview
                          ? '#00833e'
                          : '#e0e0e0',
                      }}
                    />
                    Kapak Resmi {coverImagePreview && '✓'}
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
