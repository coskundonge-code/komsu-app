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
} from 'lucide-react';

interface InviteEmailData {
  emails: string[];
  currentEmail: string;
}

interface SentInvitation {
  id: string;
  email: string;
  sentDate: string;
  status: 'pending' | 'accepted';
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
      email: 'ayse@example.com',
      sentDate: '2 gün önce',
      status: 'accepted',
    },
    {
      id: '2',
      email: 'mehmet@example.com',
      sentDate: '5 gün önce',
      status: 'pending',
    },
    {
      id: '3',
      email: 'zeynep@example.com',
      sentDate: '1 hafta önce',
      status: 'accepted',
    },
  ]);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [smsPhone, setSmsPhone] = useState('');

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
    const newInvitations = emailData.emails.map((email, index) => ({
      id: Date.now().toString() + index,
      email,
      sentDate: 'şimdi',
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#333] mb-3">
            Komşularınızı Davet Edin
          </h1>
          <p className="text-lg text-[#8f8f8f]">
            Mahallenizdeki insanları Komşu uygulamasına katılmaya davet edin ve birlikte güçlü bir topluluk kurun.
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
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#1f2937] hover:bg-[#1f2937] text-[#1f2937] hover:text-white font-medium rounded-lg transition-colors">
                    <Share2 size={18} />
                    <span className="hidden sm:inline">Paylaş</span>
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#25D366] hover:bg-[#25D366] text-[#25D366] hover:text-white font-medium rounded-lg transition-colors"
                  >
                    <MessageCircle size={18} />
                    <span className="hidden sm:inline">WhatsApp</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white rounded-lg border border-[#e0e0e0] p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {invitation.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#333] truncate">
                          {invitation.email}
                        </p>
                        <p className="text-xs text-[#8f8f8f]">{invitation.sentDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                      invitation.status === 'accepted'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}
                  >
                    {invitation.status === 'accepted' ? (
                      <>
                        <Check size={12} />
                        Kabul Etti
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} />
                        Bekleniyor
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
