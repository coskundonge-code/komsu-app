'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Lock,
  LogOut,
} from 'lucide-react';

interface SecurityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ipAddress: string;
  result: 'başarılı' | 'engellendi' | 'uyarı';
  device: string;
  location: string;
  details: string;
}

const MOCK_LOGS: SecurityLog[] = [
  {
    id: '1',
    timestamp: '2024-03-10 14:32:15',
    user: 'Ahmet K.',
    action: 'Giriş Denemesi',
    ipAddress: '192.168.1.1',
    result: 'başarılı',
    device: 'Chrome / Windows',
    location: 'Beşiktaş, İstanbul',
    details: 'Normal giriş',
  },
  {
    id: '2',
    timestamp: '2024-03-10 14:28:42',
    user: 'Bilinmeyen',
    action: 'Hatalı Şifre',
    ipAddress: '203.45.67.89',
    result: 'engellendi',
    device: 'Unknown',
    location: 'Bilinmeyen',
    details: '3 başarısız deneme - IP engellendi',
  },
  {
    id: '3',
    timestamp: '2024-03-10 14:15:20',
    user: 'Fatma D.',
    action: 'Şifre Değişikliği',
    ipAddress: '192.168.1.50',
    result: 'başarılı',
    device: 'Safari / iPhone',
    location: 'Kadıköy, İstanbul',
    details: 'Kullanıcı tarafından istenen değişiklik',
  },
  {
    id: '4',
    timestamp: '2024-03-10 13:45:33',
    user: 'System Admin',
    action: 'Kullanıcı Askıya Alma',
    ipAddress: '10.0.0.15',
    device: 'Chrome / MacOS',
    location: 'İstanbul',
    result: 'başarılı',
    details: 'Haksız etkinlik nedeniyle askıya alındı',
  },
  {
    id: '5',
    timestamp: '2024-03-10 13:20:15',
    user: 'Mustafa T.',
    action: 'Yeni Cihazdan Giriş',
    ipAddress: '172.16.0.45',
    result: 'uyarı',
    device: 'Firefox / Linux',
    location: 'Şişli, İstanbul',
    details: 'Yeni cihazdan giriş - onay emaili gönderildi',
  },
  {
    id: '6',
    timestamp: '2024-03-10 12:50:22',
    user: 'Elif Y.',
    action: 'API Anahtarı Oluşturma',
    ipAddress: '192.168.1.100',
    result: 'başarılı',
    device: 'Chrome / Windows',
    location: 'Cihangir, İstanbul',
    details: 'Yeni API anahtarı oluşturuldu',
  },
  {
    id: '7',
    timestamp: '2024-03-10 12:30:10',
    user: 'Hasan B.',
    action: 'Giriş Denemesi',
    ipAddress: '203.45.67.101',
    result: 'engellendi',
    device: 'Unknown',
    location: 'Bilinmeyen',
    details: 'IP adresi engellenmiş listede',
  },
  {
    id: '8',
    timestamp: '2024-03-10 12:15:44',
    user: 'Ayşe S.',
    action: '2FA Aktivasyon',
    ipAddress: '192.168.1.200',
    result: 'başarılı',
    device: 'Chrome / Windows',
    location: 'Fatih, İstanbul',
    details: 'İki aşamalı doğrulama etkinleştirildi',
  },
  {
    id: '9',
    timestamp: '2024-03-10 11:45:32',
    user: 'İbrahim M.',
    action: 'Oturumu Kapat',
    ipAddress: '192.168.1.75',
    result: 'başarılı',
    device: 'Safari / iPhone',
    location: 'Moda, İstanbul',
    details: 'Kullanıcı tarafından manuel oturum kapatma',
  },
  {
    id: '10',
    timestamp: '2024-03-10 11:20:15',
    user: 'Zeynep A.',
    action: 'Email Değişikliği',
    ipAddress: '192.168.1.55',
    result: 'uyarı',
    device: 'Chrome / Windows',
    location: 'Caferağa, İstanbul',
    details: 'Email doğrulaması beklemede',
  },
  {
    id: '11',
    timestamp: '2024-03-10 10:50:20',
    user: 'Cengiz K.',
    action: 'Giriş Denemesi',
    ipAddress: '192.168.1.120',
    result: 'başarılı',
    device: 'Firefox / Windows',
    location: 'Aksaray, İstanbul',
    details: 'Normal giriş',
  },
  {
    id: '12',
    timestamp: '2024-03-10 10:30:45',
    user: 'System Admin',
    action: 'Güvenlik Güncellemesi',
    ipAddress: '10.0.0.10',
    device: 'Chrome / MacOS',
    location: 'İstanbul',
    result: 'başarılı',
    details: 'Sistem güvenlik yamaları uygulandı',
  },
  {
    id: '13',
    timestamp: '2024-03-10 10:05:33',
    user: 'Demet N.',
    action: 'Giriş Denemesi',
    ipAddress: '192.168.1.88',
    result: 'başarılı',
    device: 'Chrome / Windows',
    location: 'Sarıyer, İstanbul',
    details: 'Normal giriş',
  },
  {
    id: '14',
    timestamp: '2024-03-10 09:40:15',
    user: 'Bilinmeyen',
    action: 'SQL Injection Denemesi',
    ipAddress: '203.45.67.99',
    result: 'engellendi',
    device: 'Unknown',
    location: 'Bilinmeyen',
    details: 'Kötü niyetli istekler - IP engellendi',
  },
  {
    id: '15',
    timestamp: '2024-03-10 09:15:22',
    user: 'Serkan H.',
    action: 'Giriş Denemesi',
    ipAddress: '192.168.1.65',
    result: 'başarılı',
    device: 'Chrome / Windows',
    location: 'Arnavutköy, İstanbul',
    details: 'Normal giriş',
  },
  {
    id: '16',
    timestamp: '2024-03-10 08:50:10',
    user: 'Kemal A.',
    action: 'Profil Güncelleme',
    ipAddress: '192.168.1.33',
    result: 'başarılı',
    device: 'Safari / iPhone',
    location: 'Eminönü, İstanbul',
    details: 'Profil bilgileri güncellendi',
  },
  {
    id: '17',
    timestamp: '2024-03-10 08:20:45',
    user: 'System Admin',
    action: 'IP Engelleme',
    ipAddress: '10.0.0.15',
    device: 'Chrome / MacOS',
    location: 'İstanbul',
    result: 'başarılı',
    details: 'Şüpheli IP adresi engelleme listesine eklendi',
  },
  {
    id: '18',
    timestamp: '2024-03-10 07:50:30',
    user: 'Yusuf P.',
    action: 'Giriş Denemesi',
    ipAddress: '192.168.1.44',
    result: 'başarılı',
    device: 'Chrome / Windows',
    location: 'Kâğıthane, İstanbul',
    details: 'Normal giriş',
  },
  {
    id: '19',
    timestamp: '2024-03-10 07:15:20',
    user: 'Ali K.',
    action: 'Giriş Denemesi',
    ipAddress: '192.168.1.99',
    result: 'başarılı',
    device: 'Safari / iPhone',
    location: 'Beyoğlu, İstanbul',
    details: 'Normal giriş',
  },
  {
    id: '20',
    timestamp: '2024-03-10 06:45:15',
    user: 'Mehmet G.',
    action: 'Oturumu Kapat',
    ipAddress: '192.168.1.77',
    result: 'başarılı',
    device: 'Firefox / Windows',
    location: 'Gaziosmanpaşa, İstanbul',
    details: 'Kullanıcı tarafından manuel oturum kapatma',
  },
];

const ACTION_COLORS: Record<string, string> = {
  'Giriş Denemesi': 'bg-blue-100 text-blue-800',
  'Hatalı Şifre': 'bg-red-100 text-red-800',
  'Şifre Değişikliği': 'bg-green-100 text-green-800',
  'Kullanıcı Askıya Alma': 'bg-red-100 text-red-800',
  'Yeni Cihazdan Giriş': 'bg-yellow-100 text-yellow-800',
  'API Anahtarı Oluşturma': 'bg-purple-100 text-purple-800',
  '2FA Aktivasyon': 'bg-green-100 text-green-800',
  'Oturumu Kapat': 'bg-gray-100 text-gray-800',
  'Email Değişikliği': 'bg-yellow-100 text-yellow-800',
  'Güvenlik Güncellemesi': 'bg-green-100 text-green-800',
  'SQL Injection Denemesi': 'bg-red-100 text-red-800',
  'Profil Güncelleme': 'bg-blue-100 text-blue-800',
  'IP Engelleme': 'bg-red-100 text-red-800',
};

const RESULT_CONFIG = {
  başarılı: { label: 'Başarılı', color: 'bg-green-100 text-green-800', icon: '✓' },
  engellendi: { label: 'Engellendi', color: 'bg-red-100 text-red-800', icon: '✕' },
  uyarı: { label: 'Uyarı', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
};

export default function GuvenlikPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = !actionFilter || log.action === actionFilter;
      const matchesResult = !resultFilter || log.result === resultFilter;
      return matchesSearch && matchesAction && matchesResult;
    });
  }, [searchTerm, actionFilter, resultFilter]);

  const paginatedLogs = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const successCount = MOCK_LOGS.filter((l) => l.result === 'başarılı').length;
  const blockedCount = MOCK_LOGS.filter((l) => l.result === 'engellendi').length;
  const warningCount = MOCK_LOGS.filter((l) => l.result === 'uyarı').length;

  const stats = [
    {
      title: 'Başarılı İşlemler',
      value: successCount,
      icon: '✓',
      color: '#00833e',
    },
    {
      title: 'Engellenen Girişler',
      value: blockedCount,
      icon: '🚫',
      color: '#F44336',
    },
    {
      title: 'Uyarılar',
      value: warningCount,
      icon: '⚠️',
      color: '#FF9800',
    },
    {
      title: 'Toplam İşlemler',
      value: MOCK_LOGS.length,
      icon: '📊',
      color: '#2196F3',
    },
  ];

  const uniqueActions = Array.from(new Set(MOCK_LOGS.map((l) => l.action)));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Güvenlik Logları</h1>
        <p className="text-gray-600">
          Giriş denemeleri, işlemler ve şüpheli aktiviteleri takip edin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-[#e0e0e0]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-[#e0e0e0] mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kullanıcı, IP veya işlem ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              />
            </div>
          </div>
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          >
            <option value="">Tüm İşlemler</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
          <select
            value={resultFilter}
            onChange={(e) => {
              setResultFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          >
            <option value="">Tüm Sonuçlar</option>
            {Object.entries(RESULT_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#f0f2f5]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Zaman
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  IP Adresi
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Sonuç
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => {
                const resultConfig = RESULT_CONFIG[log.result];
                const actionColor = ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800';
                return (
                  <tr key={log.id} className="border-b border-[#e0e0e0] hover:bg-[#f0f2f5]">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{log.timestamp}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{log.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${actionColor}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">{log.ipAddress}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${resultConfig.color}`}
                      >
                        {resultConfig.icon} {resultConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-[#00833e] hover:text-[#006b32] font-medium text-sm"
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
          <span className="text-sm text-gray-600">
            {filteredLogs.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredLogs.length} log)
              </>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg disabled:opacity-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg disabled:opacity-50 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-[#e0e0e0] flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Log Detayı</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Zaman</p>
                  <p className="text-gray-900 mt-1">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kullanıcı</p>
                  <p className="text-gray-900 mt-1">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">İşlem</p>
                  <p className="text-gray-900 mt-1">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Sonuç</p>
                  <p className="text-gray-900 mt-1">
                    {RESULT_CONFIG[selectedLog.result].label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">IP Adresi</p>
                  <p className="text-gray-900 mt-1 font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Konum</p>
                  <p className="text-gray-900 mt-1">{selectedLog.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Cihaz</p>
                  <p className="text-gray-900 mt-1">{selectedLog.device}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Detaylar</p>
                  <p className="text-gray-900 mt-1">{selectedLog.details}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#e0e0e0]">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg text-gray-900 font-medium hover:bg-[#f0f2f5]"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
