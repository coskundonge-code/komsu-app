'use client';

import { useState } from 'react';
import { Copy, MessageCircle, Send, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface InvitedUser {
  id: string;
  name: string;
  status: 'pending' | 'verified' | 'registered';
  joinedAt?: string;
}

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'KOMSU8K4F2A';
  const maxInvites = 3;
  const currentUses = 1;

  const invitedUsers: InvitedUser[] = [
    {
      id: '1',
      name: 'Mehmet Kara',
      status: 'verified',
      joinedAt: '5 gün önce',
    },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `KomşuApp'a davet ediyorum! Kodumu kullan: ${referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareSMS = () => {
    const message = `KomşuApp'a davet ediyorum! Kodumu kullan: ${referralCode}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-[#00833e] hover:text-[#006b32] font-medium mb-4 inline-flex items-center gap-2">
            ← Ana Sayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#333] mb-2">Komşularını Davet Et</h1>
          <p className="text-[#666]">Mahallende yaşayan arkadaşlarını KomşuApp'a davet et ve birlikte komşu topluluğunu büyüt.</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            <strong>Davet Sistemi:</strong> Referans kodu ile davet ettiğiniz komşularınız adres doğrulaması yapmadan sisteme katılabilir. Her komşu en fazla 3 kişiyi davet edebilir.
          </p>
        </div>

        {/* Referral Code Section */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#333] mb-4">Davet Kodunuz</h2>

          <div className="bg-gradient-to-r from-[#00833e]/10 to-[#006b32]/10 border-2 border-dashed border-[#00833e] rounded-lg p-6 text-center mb-6">
            <p className="text-sm text-[#666] mb-2">Davet Kodu</p>
            <p className="text-4xl font-bold text-[#00833e] font-mono tracking-wider mb-4">{referralCode}</p>
            <button
              onClick={handleCopyCode}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-[#00833e] text-white'
                  : 'bg-[#e6f4ec] text-[#00833e] hover:bg-[#d1fae5]'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopyala
                </>
              )}
            </button>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20BA61] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp'ta Paylaş
            </button>
            <button
              onClick={handleShareSMS}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
              SMS Gönder
            </button>
          </div>
        </div>

        {/* Invitation Progress */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <h2 className="text-xl font-bold text-[#333] mb-4">Davet Edebileceğiniz Kişi Sayısı</h2>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#333] font-medium">
                {currentUses} / {maxInvites} kullanılan
              </p>
              <p className="text-[#666] text-sm">
                {maxInvites - currentUses} kişiyi daha davet edebilirsiniz
              </p>
            </div>
            <div className="w-full bg-[#e0e0e0] rounded-full h-3">
              <div
                className="bg-[#00833e] h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentUses / maxInvites) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[...Array(maxInvites)].map((_, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-center border-2 ${
                  i < currentUses
                    ? 'bg-[#e6f4ec] border-[#00833e]'
                    : 'bg-[#f0f2f5] border-[#e0e0e0]'
                }`}
              >
                <p className="text-sm font-bold text-[#333]">{i + 1}.</p>
                {i < currentUses ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00833e] mx-auto mt-1" />
                ) : (
                  <div className="w-5 h-5 border-2 border-[#e0e0e0] rounded-full mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invited Users */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Davet Ettiğiniz Komşular ({invitedUsers.length})
          </h2>

          {invitedUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-[#e0e0e0] mx-auto mb-3" />
              <p className="text-[#666]">Henüz kimseyi davet etmediniz.</p>
              <p className="text-sm text-[#8f8f8f] mt-2">Davet kodunuzu paylaşarak komşu topluluğunu büyütün!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:border-[#00833e] transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#333]">{user.name}</p>
                      {user.joinedAt && (
                        <p className="text-xs text-[#8f8f8f]">{user.joinedAt}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.status === 'verified' && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-[#e6f4ec] border border-[#00833e] rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-[#00833e]" />
                        <span className="text-xs font-medium text-[#00833e]">Doğrulandı</span>
                      </div>
                    )}
                    {user.status === 'registered' && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-300 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">Katıldı</span>
                      </div>
                    )}
                    {user.status === 'pending' && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full">
                        <span className="text-xs font-medium text-amber-600">Bekleniyor</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
