'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  AlertCircle,
  AlertTriangle,
  MapPin,
  Clock,
  X,
  Plus,
  CloudRain,
  Car,
  Shield,
  Construction,
  Flame,
  Eye,
  EyeOff,
  Bell,
  Loader2,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { getAlerts, createAlert } from '@/lib/hooks/use-notifications';
import { toast } from '@/lib/utils/show-toast';

// NOT (2026-06-07): Bu sayfa eskiden 9 sahte uyarı (mockAlerts: fırtına/yangın/
// şüpheli araç…) ve haritada 4 uydurma işaretçi gösteriyordu; useEffect gerçek
// veri çekiyor ama atıp mock'a düşüyordu. "Uyarı Paylaş" formu da hiçbir şey
// kaydetmiyordu. Artık yalnızca gerçek `alerts` tablosuna bağlı: harita yalnızca
// gerçek koordinatlı uyarılar varsa görünür ve form gerçekten kayıt oluşturur
// (RLS: author_id = auth.uid()). Bkz. TECH_DEBT #12.

const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), { ssr: false });

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  lat?: number;
  lng?: number;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'weather' | 'traffic' | 'security' | 'infrastructure' | 'disaster' | 'other';
  source: string;
  active: boolean;
}

const getCategoryIcon = (category: string) => {
  const iconClass = "w-5 h-5";
  switch (category) {
    case 'weather':
      return <CloudRain className={iconClass} />;
    case 'traffic':
      return <Car className={iconClass} />;
    case 'security':
      return <Shield className={iconClass} />;
    case 'infrastructure':
      return <Construction className={iconClass} />;
    case 'disaster':
      return <Flame className={iconClass} />;
    default:
      return <AlertCircle className={iconClass} />;
  }
};

// Serbest metin olan DB `type` değerini bilinen kategoriye eşler.
function normalizeCategory(raw: string): Alert['category'] {
  const t = (raw || '').toLowerCase();
  if (t.includes('weather') || t.includes('hava') || t.includes('storm') || t.includes('fırtına') || t.includes('yağ')) return 'weather';
  if (t.includes('traffic') || t.includes('trafik') || t.includes('yol') || t.includes('kaza')) return 'traffic';
  if (t.includes('secur') || t.includes('güven') || t.includes('safety') || t.includes('hırsız') || t.includes('şüpheli')) return 'security';
  if (t.includes('infra') || t.includes('altyapı') || t.includes('elektrik') || t.includes('kesinti')) return 'infrastructure';
  if (t.includes('disaster') || t.includes('afet') || t.includes('yangın') || t.includes('fire') || t.includes('deprem')) return 'disaster';
  return 'other';
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return 'az önce';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} dakika önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat önce`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'dün';
  if (diffDay < 7) return `${diffDay} gün önce`;
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
}

function mapAlertRow(a: any): Alert {
  return {
    id: a.id,
    title: a.title || 'Uyarı',
    description: a.body || '',
    location: '',
    lat: typeof a.lat === 'number' ? a.lat : undefined,
    lng: typeof a.lng === 'number' ? a.lng : undefined,
    time: formatRelativeTime(a.created_at || null),
    severity: (a.severity as Alert['severity']) || 'low',
    category: normalizeCategory(a.type),
    source: a.source || a.profiles?.full_name || 'Mahalle',
    active: !a.expires_at || new Date(a.expires_at).getTime() > Date.now(),
  };
}

const filterCategories = [
  { id: 'all', label: 'Tümü', icon: null },
  { id: 'weather', label: 'Hava Durumu', icon: <CloudRain size={16} /> },
  { id: 'traffic', label: 'Trafik', icon: <Car size={16} /> },
  { id: 'security', label: 'Güvenlik', icon: <Shield size={16} /> },
  { id: 'infrastructure', label: 'Altyapı', icon: <Construction size={16} /> },
  { id: 'disaster', label: 'Doğal Afet', icon: <AlertTriangle size={16} /> },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'border-l-4 border-red-600 bg-red-50';
    case 'high':
      return 'border-l-4 border-orange-500 bg-orange-50';
    case 'medium':
      return 'border-l-4 border-yellow-500 bg-yellow-50';
    case 'low':
      return 'border-l-4 border-blue-500 bg-blue-50';
    default:
      return 'border-l-4 border-gray-300 bg-gray-50';
  }
};

const getSeverityBadgeColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSeverityLabel = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'Kritik';
    case 'high':
      return 'Yüksek';
    case 'medium':
      return 'Orta';
    case 'low':
      return 'Düşük';
    default:
      return 'Bilinmiyor';
  }
};

const getSeverityIconColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-red-600';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

const severityMarkerColor = (severity: string): 'green' | 'red' | 'blue' | 'orange' => {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'orange';
    default:
      return 'blue';
  }
};

export default function AlertsPage() {
  const { user, profile, neighborhood } = useCurrentUser();
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [showActive, setShowActive] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    location: '',
    category: 'security',
    severity: 'medium',
  });

  // Fetch real alerts (mahalle varsa ona göre, yoksa tümü)
  useEffect(() => {
    let cancelled = false;
    async function fetchAlerts() {
      setLoading(true);
      const { data, error } = await getAlerts(neighborhood?.id, { limit: 100 });
      if (cancelled) return;
      if (data && !error) {
        setAlerts((data as any[]).map(mapAlertRow));
      }
      setLoading(false);
    }
    fetchAlerts();
    return () => {
      cancelled = true;
    };
  }, [neighborhood?.id]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'all' || alert.category === activeFilter;
    const matchesStatus = alert.active === showActive;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Uyarı paylaşmak için giriş yapmanız gerekir');
      return;
    }
    setSubmitting(true);
    try {
      const body = formData.location
        ? `${formData.description}\n\nKonum: ${formData.location}`
        : formData.description;
      const { data, error } = await createAlert({
        title: formData.title,
        body,
        type: formData.category,
        severity: formData.severity as any,
        author_id: user.id,
        neighborhood_id: neighborhood?.id ?? null,
        source: profile?.full_name ?? null,
      } as any);

      if (!error && data) {
        setAlerts((prev) => [mapAlertRow({ ...data, profiles: { full_name: profile?.full_name } }), ...prev]);
        setFormData({ title: '', description: '', location: '', category: 'security', severity: 'medium' });
        setIsModalOpen(false);
        setShowActive(true);
        toast.success('Uyarı paylaşıldı');
      } else {
        toast.error('Uyarı paylaşılırken bir hata oluştu');
      }
    } catch {
      toast.error('Uyarı paylaşılırken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const activeAlertCount = alerts.filter(a => a.active).length;
  const resolvedAlertCount = alerts.filter(a => !a.active).length;

  const mapMarkers = alerts
    .filter((a) => typeof a.lat === 'number' && typeof a.lng === 'number')
    .map((a) => ({ lat: a.lat as number, lng: a.lng as number, title: a.title, color: severityMarkerColor(a.severity) }));

  return (
    <div className="min-h-screen bg-background">
      {/* Map - yalnızca gerçek koordinatlı uyarılar varsa */}
      {mapMarkers.length > 0 && (
        <div className="bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <LeafletMap
                center={[mapMarkers[0].lat, mapMarkers[0].lng]}
                zoom={13}
                className="w-full h-[300px] sm:h-[400px]"
                markers={mapMarkers}
                interactive={false}
              />
              <div className="p-3">
                <p className="text-xs text-text-muted text-center">Uyarı konumları haritada gösterilmektedir</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Mahalle Uyarıları</h1>
            {/* Notification Toggle */}
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2 rounded-lg transition-all ${
                notificationsEnabled
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-muted border border-border'
              }`}
              title={notificationsEnabled ? "Bildirimler açık" : "Bildirimler kapalı"}
            >
              <Bell size={20} />
            </button>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            {/* Active/Past Toggle */}
            <div className="flex items-center gap-2 bg-background rounded-full p-1">
              <button
                onClick={() => setShowActive(true)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  showActive
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Eye size={16} />
                Aktif
                <span className="bg-surface/30 px-2 py-0.5 rounded-full text-xs font-bold">{activeAlertCount}</span>
              </button>
              <button
                onClick={() => setShowActive(false)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  !showActive
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <EyeOff size={16} />
                Geçmiş
                <span className="bg-surface/30 px-2 py-0.5 rounded-full text-xs font-bold">{resolvedAlertCount}</span>
              </button>
            </div>

            {/* Create Alert Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Uyarı Paylaş
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeFilter === category.id
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-primary border border-border hover:border-primary'
                }`}
              >
                {category.icon && <span className={activeFilter === category.id ? 'text-white' : 'text-gray-600'}>{category.icon}</span>}
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-9 h-9 text-primary animate-spin" />
              <p className="text-text-muted text-sm">Uyarılar yükleniyor…</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-surface rounded-lg border border-border p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-primary font-medium">Uyarı bulunamadı</p>
              <p className="text-text-muted text-sm mt-1">
                {showActive
                  ? 'Şu anda aktif uyarı bulunmamaktadır'
                  : 'Geçmiş uyarı bulunmamaktadır'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`block ${getSeverityColor(alert.severity)} rounded-lg p-5 border-2 border-l-4 transition-all`}
                >
                  <div className="flex items-start gap-4">
                    {/* Large Severity Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-lg ${getSeverityIconColor(alert.severity)} bg-surface/50`}>
                      {getCategoryIcon(alert.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with Title and Severity Badge */}
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-text-primary">{alert.title}</h3>
                          <p className="text-xs text-text-muted mt-0.5 font-medium">Kaynak: {alert.source}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 uppercase tracking-wide ${getSeverityBadgeColor(alert.severity)}`}>
                          {getSeverityLabel(alert.severity)}
                        </span>
                      </div>

                      {/* Description */}
                      {alert.description && (
                        <p className="text-sm text-text-secondary mb-4 leading-relaxed whitespace-pre-line">{alert.description}</p>
                      )}

                      {/* Footer: Location and Time */}
                      <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap pt-3 border-t border-white/30">
                        {alert.location && (
                          <>
                            <div className="flex items-center gap-2 font-medium">
                              <MapPin size={16} className="text-primary" />
                              <span>{alert.location}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                          </>
                        )}
                        <div className="flex items-center gap-2 font-medium">
                          <Clock size={16} className="text-primary" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-text-primary">Yeni Uyarı Oluştur</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateAlert} className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Uyarı başlığını yazınız"
                  className="w-full px-3 py-2 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Uyarının detaylarını yazınız"
                  className="w-full px-3 py-2 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Konum</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Uyarı konumunu yazınız"
                  className="w-full px-3 py-2 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="security">Güvenlik</option>
                  <option value="weather">Hava Durumu</option>
                  <option value="traffic">Trafik</option>
                  <option value="infrastructure">Altyapı</option>
                  <option value="disaster">Doğal Afet</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Aciliyet Derecesi</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="critical">Kritik</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border text-text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Paylaşılıyor...' : 'Uyarı Paylaş'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
