'use client';

import { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  MessageCircle,
  Share2,
  Heart,
  Users,
  Zap,
  AlertCircle,
  X,
  MessageSquare,
  TrendingUp,
  Eye,
} from 'lucide-react';

interface InviteEmailData {
  emails: string[];
  currentEmail: string;
}

interface SentInvitation {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  sentDate: string;
  status: 'accepted' | 'pending' | 'opened';
}

export default function InvitePage() {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link' | 'whatsapp' | 'sms'>('email');
  const [emailData, setEmailData] = useState<InviteEmailData>({
    emails: [],
    currentEmail: '',
  });
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteLink] = useState('https://komsuapp.com/join?ref=user123456');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([
    {
      id: '1',
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      sentDate: '2 gün önce',
      status: 'accepted',
    },
    {
      id: '2',
      name: 'Mehmet Kara',
      email: 'mehmet@example.com',
      sentDate: '5 gün önce',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Zeynep Çelik',
      email: 'zeynep@example.com',
      sentDate: '1 hafta önce',
      status: 'accepted',
    },
  ]);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [smsPhone, setSmsPhone] = useState('');

  const invitedCount = sentInvitations.filter(inv => inv.status === 'accepted').length;
  const totalInvites = 5;

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAddEmail = () => {
    const email = emailData.currentEmail.trim();

    if (!email) {
      setEmailErrors(['Lütfen bir e-posta adresi girin']);
      return;
    }

    if (!validateEmail(email)) {
      setEmailErrors(['Geçerli bir e-posta adresi girin']);
      return;
    }

    if (emailData.emails.includes(email)) {
      setEmailErrors(['Bu e-posta zaten listeye eklendi']);
      return;
    }

    setEmailData({
      emails: [...emailData.emails, email],
      currentEmail: '',
    });
    setEmailErrors([]);
  };

  const handleRemoveEmail = (email: string) => {
    setEmailData({
      ...emailData,
      emails: emailData.emails.filter((e) => e !== email),
    });
  };

  const handleSendEmails = () => {
    if (emailData.emails.length === 0) {
      setEmailErrors(['Lütfen en az bir e-posta adresi ekleyin']);
      return;
    }

    // Simulate sending invites
    const newInvitations: SentInvitation[] = emailData.emails.map((email, index) => ({
      id: Date.now().toString() + index,
      name: email.split('@')[0],
      email,
      sentDate: "şimdi",
      status: 'pending' as const,
    }));

    setSentInvitations([...newInvitations, ...sentInvitations]);
    setEmailData({ emails: [], currentEmail: '' });
    setEmailErrors([]);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Merhaba! Komşu uygulamasında beni takip etmek ister misin? ${inviteLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleSMS = () => {
    if (!smsPhone.trim()) {
      alert('Lütfen bir telefon numarası girin');
      return;
    }
    const message = `Komşu uygulamasında beni takip et: ${inviteLink}`;
    window.open(`sms:${smsPhone}?body=${encodeURIComponent(message)}`, '_blank');
  };

  const benefits = [
    {
      icon: Heart,
      title: 'Daha Güçlü Bağlantılar',
      description: 'Mahallenizdeki daha fazla kişiyle bağlantı kurun ve topluluk hissini yaşayın',
    },
    {
      icon: Zap,
      title: 'Yardımlaşma Ağı',
      description: 'Komşularınızdan hızlı yardım alın ve onlara destek olun',
    },
    {
      icon: Users,
      title: 'Sosyal Etkinlikler',
      description: 'Mahalle etkinlikleri organize edin ve birlikte vakit geçirin',
    },
    {
      icon: MessageSquare,
      title: 'Bilgi Paylaşımı',
      description: 'Tatlı tarifler, tavsiyeler ve deneyimler paylaşın',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-r from-[#00833e] to-[#006b32] rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                "Komşularını Davet Et"
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Mahallenizdeki insanları Komşu uygulamasına katılmaya davet edin ve birlikte güçlü bir topluluk kurun.
              </p>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <TrendingUp size={18} />
                <span>"Bu hafta 1.247 yeni komşu katıldı"</span>
              </div>
            </div>
            {/* Right Illustration Area */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/30">
                <Users size={64} className="text-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-[#00833e]" />
              </div>
              <div>
                <p className="text-sm text-[#8f8f8f]">Davet Ettiklerin</p>
                <p className="text-2xl font-bold text-[#333]">5 Kişi</p>
                <p className="text-xs text-[#00833e] mt-1">{invitedCount} Katıldı</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f39c12]/10 to-[#e67e22]/10 rounded-lg flex items-center justify-center">
                <Zap size={24} className="text-[#f39c12]" />
              </div>
              <div>
                <p className="text-sm text-[#8f8f8f]">Özel Rozet İçin</p>
                <p className="text-2xl font-bold text-[#333]">7 Daha</p>
                <p className="text-xs text-[#f39c12] mt-1">"7 daha davet et, özel rozet kazan!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#333]">Rozet İlerleme Durumu</p>
            <p className="text-xs font-medium text-[#8f8f8f]">{totalInvites}/12 Davet</p>
          </div>
          <div className="w-full bg-[#e0e0e0] rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#00833e] to-[#006b32] h-full transition-all duration-300"
              style={{ width: `${(totalInvites / 12) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#8f8f8f] mt-3">Hediye rozeti açmak için 12 komşu davet et</p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#333] mb-3">
            Davet Gönder
          </h2>
          <p className="text-[#8f8f8f]">
            En uygun yöntemi seçerek komşularını davet et
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-[#e0e0e0] p-6 hover:shadow-md transition-shadow card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={24} className="text-[#00833e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333] mb-1">{benefit.title}</h3>
                    <p className="text-sm text-[#8f8f8f]">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invitation Methods */}
        <div className="bg-white rounded-xl shadow-lg border border-[#e0e0e0] overflow-hidden">
          {/* Method Tabs */}
          <div className="flex flex-col sm:flex-row border-b border-[#e0e0e0]">
            {[
              { id: 'email', label: 'E-Posta ile Davet Et', icon: Mail },
              { id: 'link', label: 'Bağlantı ile Paylaş', icon: Copy },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
              { id: 'sms', label: 'SMS', icon: MessageSquare },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setInviteMethod(method.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 border-b-2 transition-all font-medium text-sm sm:border-b-0 sm:border-r sm:last:border-r-0 ${
                    inviteMethod === method.id
                      ? 'border-[#00833e] text-[#00833e] bg-[#f0f2f5]'
                      : 'border-transparent text-[#8f8f8f] hover:text-[#333]'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{method.label}</span>
                  <span className="sm:hidden">{method.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Email Method */}
            {inviteMethod === 'email' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#333] mb-2">E-Posta ile Davet Et</h2>
                  <p className="text-[#8f8f8f]">
                    Komşularınızın e-posta adreslerini girerek onları davet edin
                  </p>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    E-Posta Adresi
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={emailData.currentEmail}
                      onChange={(e) => setEmailData({ ...emailData, currentEmail: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                      placeholder="komsu@example.com"
                      className={`flex-1 px-4 py-3 border rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50 ${
                        emailErrors.length > 0 ? 'border-red-500' : 'border-[#e0e0e0]'
                      }`}
                    />
                    <button
                      onClick={handleAddEmail}
                      className="px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                      Ekle
                    </button>
                  </div>
                  {emailErrors.length > 0 && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {emailErrors[0]}
                    </p>
                  )}
                </div>

                {/* Added Emails */}
                {emailData.emails.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#333] mb-3">
                      Eklenecek E-Postalar ({emailData.emails.length})
                    </p>
                    <div className="space-y-2">
                      {emailData.emails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between px-4 py-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]"
                        >
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-[#00833e]" />
                            <span className="text-sm text-[#333] font-medium">{email}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveEmail(email)}
                            className="p-1 hover:bg-white rounded transition-colors text-[#8f8f8f] hover:text-red-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Send Button */}
                {emailData.emails.length > 0 && (
                  <button
                    onClick={handleSendEmails}
                    className="w-full px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    {emailData.emails.length} Kişiye Davet Gönder
                  </button>
                )}
              </div>
            )}

            {/* Link Method */}
            {inviteMethod === 'link' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#333] mb-2">Bağlantı ile Paylaş</h2>
                  <p className="text-[#8f8f8f]">
                    Bu bağlantıyı kopyalayarak sosyal medya, mesajlaşma uygulamaları veya e-posta aracılığıyla paylaşın
                  </p>
                </div>

                {/* Shareable Link */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Davet Bağlantısı
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 px-4 py-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] flex items-center">
                      <code className="text-sm text-[#333] font-mono truncate">{inviteLink}</code>
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`px-6 py-3 font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                        linkCopied
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-[#00833e] hover:bg-[#006b32] text-white'
                      }`}
                    >
                      {linkCopied ? (
                        <>
                          <Check size={18} />
                          Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          Kopyala
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="grid grid-cols-4 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#1f2937] hover:bg-[#1f2937] text-[#1f2937] hover:text-white font-medium rounded-lg transition-colors">
                    <Share2 size={18} />
                    <span className="hidden sm:inline text-sm">"Paylaş"</span>
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#25D366] hover:bg-[#25D366] text-[#25D366] hover:text-white font-medium rounded-lg transition-colors"
                  >
                    <MessageCircle size={18} />
                    <span className="hidden sm:inline text-sm">"WhatsApp"</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#3b5998] hover:bg-[#3b5998] text-[#3b5998] hover:text-white font-medium rounded-lg transition-colors">
                    <MessageSquare size={18} />
                    <span className="hidden sm:inline text-sm">"SMS"</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#00833e] hover:bg-[#00833e] text-[#00833e] hover:text-white font-medium rounded-lg transition-colors"
                  >
                    <Copy size={18} />
                    <span className="hidden sm:inline text-sm">"Kopyala"</span>
                  </button>
                </div>

                {/* QR Code Section */}
                <div className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] text-center">
                  <p className="text-sm text-[#8f8f8f] mb-3">
                    QR Kod ile paylaş ve komşularından hızlı bağlantı al
                  </p>
                  <div className="w-40 h-40 bg-white rounded-lg border-2 border-[#e0e0e0] mx-auto flex items-center justify-center">
                    <p className="text-xs text-[#8f8f8f] text-center">QR Kod</p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Method */}
            {inviteMethod === 'whatsapp' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#333] mb-2">WhatsApp ile Davet Et</h2>
                  <p className="text-[#8f8f8f]">
                    WhatsApp aracılığıyla doğrudan komşularınıza davet gönderebilirsiniz
                  </p>
                </div>

                {/* WhatsApp Send */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#1fa456] text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  <MessageCircle size={24} />
                  WhatsApp ile Gönder
                </button>

                {/* Info Box */}
                <div className="p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                  <p className="text-sm text-[#404040]">
                    WhatsApp'a yönlendirilecek ve hazırlanmış bir mesaj taslağı göreceksiniz. Mesajı düzenleyebilir ve göndermek istediğiniz komşularınıza gönderebilirsiniz.
                  </p>
                </div>
              </div>
            )}

            {/* SMS Method */}
            {inviteMethod === 'sms' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#333] mb-2">SMS ile Davet Et</h2>
                  <p className="text-[#8f8f8f]">
                    SMS aracılığıyla komşularınıza davet mesajı gönderin
                  </p>
                </div>

                {/* SMS Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    placeholder="+90 555 123 4567"
                    className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50"
                  />
                </div>

                {/* SMS Send Button */}
                <button
                  onClick={handleSMS}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#00833e] hover:bg-[#006b32] text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  <MessageSquare size={24} />
                  SMS Gönder
                </button>

                {/* Info Box */}
                <div className="p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                  <p className="text-sm text-[#404040]">
                    SMS uygulaması açılacak ve hazırlanmış bir mesaj göreceksiniz. Telefon numarasını doğrulayıp mesajı gönderin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sent Invitations */}
        {sentInvitations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#333] mb-6">Gönderilen Davetler</h2>

            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
              <div className="divide-y divide-[#e0e0e0]">
                {sentInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-5 flex items-center justify-between hover:bg-[#f0f2f5] transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {invitation.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#333]">{invitation.name}</p>
                        <p className="text-xs text-[#8f8f8f]">{invitation.email || invitation.phone} • {invitation.sentDate}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="ml-4 flex-shrink-0">
                      {invitation.status === 'accepted' && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <Check size={14} />
                          "Katıldı"
                        </div>
                      )}
                      {invitation.status === 'opened' && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Eye size={14} />
                          "Link Açıldı"
                        </div>
                      )}
                      {invitation.status === 'pending' && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                          <AlertCircle size={14} />
                          "Bekliyor"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
