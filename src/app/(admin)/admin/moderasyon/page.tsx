'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Flag,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react';

interface ReportedContent {
  id: string;
  type: 'post' | 'comment' | 'business_review';
  author: string;
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

export default function ModerasjonPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter((report) => {
      const matchesSearch =
        report.author.toLowerCase().includes(search.toLowerCase()) ||
        report.content.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingCount = MOCK_REPORTS.filter(
    (r) => r.status === 'pending'
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">İçerik Moderasyonu</h1>
        <p className="text-gray-600">
          {pendingCount} beklemede olan rapor var
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Yazar veya içerik ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all'
                ? 'Tümü'
                : status === 'pending'
                ? 'Beklemede'
                : status === 'approved'
                ? 'Onaylandı'
                : 'Reddedildi'}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const StatusIcon =
            STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG].icon;
          const statusConfig =
            STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG];
          const reasonColor = REASON_COLORS[report.reason] || 'bg-gray-100 text-gray-700';

          return (
            <div
              key={report.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="p-3 bg-red-50 rounded-lg text-red-600 h-fit">
                  <Flag size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">
                        {report.author} tarafından{' '}
                        <span className="text-gray-600 font-normal">
                          {report.type === 'post'
                            ? 'paylaşım'
                            : report.type === 'comment'
                            ? 'yorum'
                            : 'inceleme'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Bildirildi: {new Date(report.reportedAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                      <StatusIcon size={16} />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${reasonColor}`}
                    >
                      {report.reason}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {report.reportCount} bildirim
                    </span>
                  </div>

                  {/* Content Preview */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2 italic">
                    "{report.content}"
                  </p>

                  {/* Actions */}
                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium text-sm transition-colors">
                        <CheckCircle size={16} />
                        Onayla
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors">
                        <XCircle size={16} />
                        Kaldır
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors">
                        Reddet
                      </button>
                    </div>
                  )}
                </div>

                {/* Menu */}
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
          <p className="text-lg font-bold text-gray-900">Kontrol Edilecek Rapor Yok</p>
          <p className="text-gray-600 mt-2">Harika iş! Tüm raporlar işlendi.</p>
        </div>
      )}
    </div>
  );
}
