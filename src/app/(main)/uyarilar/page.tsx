'use client';

import React from 'react';
import { AlertCard, type Alert } from '@/components/alerts/alert-card';

// Mock data
const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Su Kaçağı Uyarısı',
    body: '3. blok dairelerde su tesisatında sorun tespit edilmiştir. İtfaiyeye haber verilmiştir.',
    location: '3. Blok, Daireler',
    timestamp: '30 dakika önce',
    severity: 'danger',
    type: 'water_leak',
    actionLink: '/uyarilar/1',
  },
  {
    id: '2',
    title: 'Elektrik Kesintisi',
    body: 'Bakım çalışmaları nedeniyle yarın 09:00-12:00 arasında elektrik kesintisi yapılacaktır.',
    location: 'Tüm Site',
    timestamp: '2 saat önce',
    severity: 'warning',
    type: 'power_outage',
    actionLink: '/uyarilar/2',
  },
  {
    id: '3',
    title: 'Araç Kaydı Hatırlatması',
    body: 'Site yönetiminde araç kaydı yapılmamış olan 15 adet araç vardır. Lütfen araç kaydınızı tamamlayınız.',
    location: 'Otopark Giriş',
    timestamp: '1 gün önce',
    severity: 'info',
    type: 'vehicle_registration',
    actionLink: '/ayarlar/araclar',
  },
  {
    id: '4',
    title: 'Güvenlik Kontrol Artışı',
    body: 'Bölgedeki hırsızlık olaylarından dolayı güvenlik kontrolleri artırılmıştır. Misafir getirirken kimlik gösteriniz.',
    location: 'Site Girişi',
    timestamp: '2 gün önce',
    severity: 'warning',
    type: 'security',
    actionLink: '/uyarilar/4',
  },
  {
    id: '5',
    title: 'Aidatlar Fatura Edilmiştir',
    body: 'Mart ayı aidatları fatura edilmiştir. Ödeme son tarihi 31 Mart 2026\'dır.',
    location: 'Muhasebe Ofisi',
    timestamp: '3 gün önce',
    severity: 'info',
    type: 'payment',
    actionLink: '/ayarlar/odemeler',
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState(mockAlerts);
  const [filterSeverity, setFilterSeverity] = React.useState<
    'all' | 'info' | 'warning' | 'danger'
  >('all');

  const filteredAlerts =
    filterSeverity === 'all'
      ? alerts
      : alerts.filter((alert) => alert.severity === filterSeverity);

  const handleAlertClick = (id: string, link?: string) => {
    if (link) {
      // In a real app, navigate to the link
      console.log('Navigate to:', link);
    }
  };

  const severityCount = {
    all: alerts.length,
    info: alerts.filter((a) => a.severity === 'info').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    danger: alerts.filter((a) => a.severity === 'danger').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Uyarılar</h1>
          <p className="text-gray-600">
            Site yönetimi ve komşulardan gelen önemli uyarıları takip edin
          </p>
        </div>

        {/* Map Placeholder */}
        <div className="mb-8 bg-white rounded-lg shadow p-8">
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 font-medium">Harita Görünümü</p>
              <p className="text-gray-500 text-sm mt-1">
                Uyarıların coğrafi konumları harita üzerinde gösterilecektir
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterSeverity === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Tümü ({severityCount.all})
          </button>
          <button
            onClick={() => setFilterSeverity('danger')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterSeverity === 'danger'
                ? 'bg-red-500 text-white'
                : 'bg-white text-red-700 border border-red-300 hover:bg-red-50'
            }`}
          >
            Acil ({severityCount.danger})
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterSeverity === 'warning'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-50'
            }`}
          >
            Uyarı ({severityCount.warning})
          </button>
          <button
            onClick={() => setFilterSeverity('info')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterSeverity === 'info'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            Bilgi ({severityCount.info})
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">Uyarı bulunamadı</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onActionClick={handleAlertClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
