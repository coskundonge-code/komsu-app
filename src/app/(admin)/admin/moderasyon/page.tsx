'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Flag,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  MessageSquare,
  User,
  Eye,
  Trash2,
  X,
  Ban,
} from 'lucide-react';

interface ReportedContent {
  id: string;
  type: 'post' | 'comment' | 'business_review';
  author: string;
  authorEmail: string;
  content: string;
  reason: string;
  reportCount: number;
  reportedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const MOCK_REPORTS: ReportedContent[] = [
  {
    id: '1',
    type: 'post',
    author: 'Ahmet K.',
    authorEmail: 'ahmet@example.com',
    content:
      'Bu konu hakkında çok kötü yorumlar yapıyorum...',
    reason: 'Uygunsuz İçerik',
    reportCount: 5,
    reportedAt: '2024-03-08',
    status: 'pending',
  },
  {
    id: '2',
    type: 'comment',
    author: 'Fatma D.',
    authorEmail: 'fatma@example.com',
    content: 'Bu eleştiriler tamamen yersizdir...',
    reason: 'Küfür / Saygısızlık',
    reportCount: 3,
    reportedAt: '2024-03-08',
    status: 'pending',
  },
  {
    id: '3',
    type: 'business_review',
    author: 'Mustafa T.',
    authorEmail: 'mustafa@example.com',
    content: 'İşletme sahiplerine saldırgan bir inceleme...',
    reason: 'Hakaret / Tehdit',
    reportCount: 2,
    reportedAt: '2024-03-07',
    status: 'pending',
  },
  {
    id: '4',
    type: 'post',
    author: 'Elif Y.',
    authorEmail: 'elif@example.com',
    content: 'Bu reklamcılık amaçlı bir paylaşımdır...',
    reason: 'İstenmeyen Reklam',
    reportCount: 4,
    reportedAt: '2024-03-07',
    status: 'approved',
  },
  {
    id: '5',
    type: 'comment',
    author: 'Hasan B.',
    authorEmail: 'hasan@example.com',
    content: 'Tartışmalı bir siyasi açıklama...',
    reason: 'Siyasi İçerik',
    reportCount: 1,
    reportedAt: '2024-03-06',
    status: 'rejected',
  },
  {
    id: '6',
    type: 'business_review',
    author: 'Ayşe S.',
    authorEmail: 'ayse@example.com',
    content: 'Yanlış bilgiler içeren inceleme...',
    reason: 'Yanlış Bilgi',
    reportCount: 2,
    reportedAt: '2024-03-06',
    status: 'pending',
  },
];

const STATUS_CONFIG = {
  pending: {
    label: 'Beklemede',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  approved: {
    label: 'Onaylandı',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Reddedildi',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

const REASON_COLORS: Record<string, string> = {
  'Uygunsuz İçerik': 'bg-red-100 text-red-700',
  'Küfür / Saygısızlık': 'bg-orange-100 text-orange-700',
  'Hakaret / Tehdit': 'bg-red-100 text-red-700',
  'İstenmeyen Reklam': 'bg-blue-100 text-blue-700',
  'Siyasi İçerik': 'bg-purple-100 text-purple-700',
  'Yanlış Bilgi': 'bg-yellow-100 text-yellow-700',
};

interface ActionModal {
  isOpen: boolean;
  reportId?: string;
  action: string;
}

interface DetailsModal {
  isOpen: boolean;
  report?: ReportedContent;
}

export default function ModerationPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'post' | 'comment' | 'business_review'>('all');
  const [actionModal, setActionModal] = useState<ActionModal>({ isOpen: false, action: '' });
  const [detailsModal, setDetailsModal] = useState<DetailsModal>({ isOpen: false });

  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter((report) => {
      const matchesSearch =
        report.author.toLowerCase().includes(search.toLowerCase()) ||
        report.content.toLowerCase().includes(search.toLowerCase()) ||
        report.reason.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;
      const matchesType =
        typeFilter === 'all' || report.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const pendingCount = MOCK_REPORTS.filter(
    (r) => r.status === 'pending'
  ).length;
  const approvedCount = MOCK_REPORTS.filter(
    (r) => r.status === 'approved'
  ).length;
  const rejectedCount = MOCK_REPORTS.filter(
    (r) => r.status === 'rejected'
  ).length;

  const handleAction = (action: string, reportId: string) => {
    setActionModal({ isOpen: true, reportId, action });
  };

  const confirmAction = () => {
    console.log(`Confirmed: ${actionModal.action} for report ${actionModal.reportId}`);
    setActionModal({ isOpen: false, action: '' });
  };

  const viewDetails = (report: ReportedContent) => {
    setDetailsModal({ isOpen: true, report });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          İçerik Moderasyonu
        </h1>
        <p className="text-gray-600">
          {pendingCount} beklemede, {approvedCount} onaylı, {rejectedCount}
          {" "}reddedilmiş rapor
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Toplam Rapor</p>
              <p className="text-2xl font-bold text-gray-900">
                {MOCK_REPORTS.length}
              </p>
            </div>
            <Flag className="text-red-600" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Beklemede</p>
              <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
            </div>
            <AlertCircle className="text-yellow-600" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Onaylı</p>
              <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
            </div>
            <CheckCircle className="text-green-600" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Reddedildi</p>
              <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
            </div>
            <XCircle className="text-red-600" size={28} />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Yazar, içerik veya neden ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="text-sm font-semibold text-gray-700 self-center">
            Durum:
          </span>
          {(['all', 'pending', 'approved', 'rejected'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  statusFilter === status
                    ? 'bg-[#00833e] text-white'
                    : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200 border border-[#e0e0e0]'
                }`}
              >
                {status === 'all'
                  ? 'Tümü'
                  : status === 'pending'
                  ? 'Beklemede'
                  : status === 'approved'
                  ? 'Onaylı'
                  : 'Reddedildi'}
              </button>
            )
          )}
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 self-center">
            Tür:
          </span>
          {(['all', 'post', 'comment', 'business_review'] as const).map(
            (type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  typeFilter === type
                    ? 'bg-[#00833e] text-white'
                    : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200 border border-[#e0e0e0]'
                }`}
              >
                {type === 'all'
                  ? 'Tümü'
                  : type === 'post'
                  ? 'Paylaşım'
                  : type === 'comment'
                  ? 'Yorum'
                  : 'İnceleme'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
            <p className="text-lg font-bold text-gray-900">
              Kontrol Edilecek Rapor Yok
            </p>
            <p className="text-gray-600 mt-2">
              Harika iş! Tüm raporlar işlendi.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const StatusIcon =
              STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].icon;
            const statusConfig =
              STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG];
            const reasonColor =
              REASON_COLORS[report.reason] || 'bg-gray-100 text-gray-700';

            return (
              <div
                key={report.id}
                className="bg-white rounded-lg border border-[#e0e0e0] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="p-3 bg-red-50 rounded-lg text-red-600 h-fit flex-shrink-0">
                    <Flag size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">
                          {report.author}{' '}
                          <span className="text-gray-600 font-normal">
                            tarafından{' '}
                            {report.type === 'post'
                              ? 'paylaşım'
                              : report.type === 'comment'
                              ? 'yorum'
                              : 'inceleme'}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Bildirildi:{' '}
                          {new Date(report.reportedAt).toLocaleDateString(
                            'tr-TR'
                          )}
                        </p>
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusConfig.color}`}
                      >
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${reasonColor}`}
                      >
                        {report.reason}
                      </span>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-[#f0f2f5] text-gray-700">
                        {report.reportCount} bildirim
                      </span>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-[#e6f4ec] text-[#006b32]">
                        {report.type === 'post'
                          ? 'Paylaşım'
                          : report.type === 'comment'
                          ? 'Yorum'
                          : 'İnceleme'}
                      </span>
                    </div>

                    {/* Content Preview */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2 italic bg-[#f0f2f5] p-3 rounded border border-[#e0e0e0]">
                      "{report.content}"
                    </p>

                    {/* Actions */}
                    {report.status === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => viewDetails(report)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors border border-blue-200"
                        >
                          <Eye size={16} />
                          Detayları Gör
                        </button>
                        <button
                          onClick={() => handleAction('approve', report.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-[#e6f4ec] text-[#006b32] hover:bg-[#d1fae5] rounded-lg font-medium text-sm transition-colors border border-[#00833e]/20"
                        >
                          <CheckCircle size={16} />
                          İçeriği Onayla
                        </button>
                        <button
                          onClick={() => handleAction('remove', report.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors border border-red-200"
                        >
                          <Trash2 size={16} />
                          İçeriği Kaldır
                        </button>
                        <button
                          onClick={() => handleAction('ban', report.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg font-medium text-sm transition-colors border border-orange-200"
                        >
                          <Ban size={16} />
                          Kullanıcıyı Yasakla
                        </button>
                      </div>
                    )}
                    {report.status === 'approved' && (
                      <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-xs font-medium text-green-800">
                        ✓ Bu içerik onaylanmış ve yayında
                      </div>
                    )}
                    {report.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-xs font-medium text-red-800">
                        ✗ Bu rapor reddedilmiş
                      </div>
                    )}
                  </div>

                  {/* Menu */}
                  <button className="p-2 hover:bg-[#f0f2f5] rounded transition-colors flex-shrink-0">
                    <MoreVertical size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && detailsModal.report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#e0e0e0] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Rapor Detayları</h2>
              <button
                onClick={() => setDetailsModal({ isOpen: false })}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="pb-4 border-b border-[#e0e0e0]">
                <div className="flex items-start gap-3 mb-3">
                  <Flag size={20} className="text-red-600 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900">Bildirilen İçerik</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {detailsModal.report.type === 'post' ? 'Paylaşım' : detailsModal.report.type === 'comment' ? 'Yorum' : 'İnceleme'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#e0e0e0]">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Yazar</p>
                  <p className="text-sm font-semibold text-gray-900">{detailsModal.report.author}</p>
                  <p className="text-xs text-gray-600">{detailsModal.report.authorEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Raporlanma Tarihi</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(detailsModal.report.reportedAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b border-[#e0e0e0]">
                <p className="text-xs font-medium text-gray-600 uppercase mb-2">İçerik Önizlemesi</p>
                <p className="text-sm text-gray-700 bg-[#f0f2f5] p-3 rounded border border-[#e0e0e0]">
                  {detailsModal.report.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Raporlama Nedeni</p>
                  <p className={`text-sm font-semibold px-2 py-1 rounded inline-block mt-1 ${REASON_COLORS[detailsModal.report.reason]}`}>
                    {detailsModal.report.reason}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Bildirim Sayısı</p>
                  <p className="text-sm font-semibold text-gray-900">{detailsModal.report.reportCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">İşlemi Onayla</h2>
            <p className="text-gray-600 mb-6">
              {actionModal.action === 'approve'
                ? 'Bu raporı onaylamak ve içeriği yayında bırakmak istediğinizden emin misiniz?'
                : actionModal.action === 'remove'
                ? 'Bu içeriği kaldırmak istediğinizden emin misiniz? Kullanıcıya bildirim gönderilecektir.'
                : actionModal.action === 'ban'
                ? 'Bu kullanıcıyı yasaklamak istediğinizden emin misiniz? Bu işlem kalıcıdır.'
                : 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setActionModal({ isOpen: false, action: '' })}
                className="flex-1 px-4 py-2 border border-[#e0e0e0] rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  actionModal.action === 'ban' || actionModal.action === 'remove'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#00833e] hover:bg-[#006b32]'
                }`}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
