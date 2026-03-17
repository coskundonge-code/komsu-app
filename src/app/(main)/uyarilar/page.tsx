'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Search,
  AlertCircle,
  AlertTriangle,
  Cloud,
  Zap,
  AlertOctagon,
  MapPin,
  Clock,
  X,
  Plus,
  CloudRain,
  Car,
  Shield,
  Construction,
  Flame,
  Volume2,
  PawPrint,
  Map,
  Eye,
  EyeOff,
  Bell,
} from 'lucide-react';
import Link from 'next/link';

const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), { ssr: false });

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'weather' | 'traffic' | 'security' | 'infrastructure' | 'disaster' | 'other';
  source: string;
  active: boolean;
  icon: React.ReactNode;
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

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Fırtına Uyarısı - Kritik',
    description: 'Güçlü rüzgarlar ve şiddetli yağış beklenmektedir. Açık hava faaliyetlerini iptal ediniz.',
    location: 'Tüm Mahalle',
    time: '5 dakika önce',
    severity: 'critical',
    category: 'weather',
    source: 'Meteoroloji Dairesi',
    active: true,
    icon: <CloudRain size={20} />,
  },
  {
    id: '2',
    title: 'Yangın Uyarısı - Merkez Binası',
    description: 'Merkez bölgedeki bir binada küçük yangın çıkması durumu. İtfaiye ekibi gönderilmiştir.',
    location: 'Merkez Binaları, 3. Cadde',
    time: '12 dakika önce',
    severity: 'critical',
    category: 'disaster',
    source: 'İtfaiye',
    active: true,
    icon: <Flame size={20} />,
  },
  {
    id: '3',
    title: 'Şüpheli Araç Bildirimi',
    description: 'Plakası belirsiz gri renk bir araç mahalleden geçmekte. Lütfen dikkatli olunuz.',
    location: 'Ana Cadde, Park Yakınları',
    time: '28 dakika önce',
    severity: 'high',
    category: 'security',
    source: 'Mahalle Sakinleri',
    active: true,
    icon: <Shield size={20} />,
  },
  {
    id: '4',
    title: 'Su Kesintisi Bildirimi',
    description: 'Boru kırılması nedeniyle yarın 08:00-16:00 saatleri arasında su kesintisi yapılacaktır.',
    location: '1. ve 2. Sokaklar',
    time: '45 dakika önce',
    severity: 'medium',
    category: 'infrastructure',
    source: 'Su İdaresi',
    active: true,
    icon: <Zap size={20} />,
  },
  {
    id: '5',
    title: 'Elektrik Kesintisi',
    description: 'Bakım çalışmaları nedeniyle elektrik kesintisi gerçekleşecektir. Saatler belirlenmektedir.',
    location: 'Merkez Mahalle',
    time: '1 saat önce',
    severity: 'medium',
    category: 'infrastructure',
    source: 'Elektrik Şirketi',
    active: true,
    icon: <Zap size={20} />,
  },
  {
    id: '6',
    title: 'Yol Çalışması - Ana Cadde',
    description: 'Bu hafta yapılacak yol onarımları nedeniyle trafik düzenlemesi uygulanacaktır.',
    location: 'Ana Cadde',
    time: '2 saat önce',
    severity: 'low',
    category: 'traffic',
    source: 'Belediye',
    active: true,
    icon: <Construction size={20} />,
  },
  {
    id: '7',
    title: 'Kayıp Evcil Hayvan - Köpek',
    description: 'Kahverengi labrador köpek kayıp. İsmi "Max", yaklaşık 3 yaşında. Bilgi için iletişime geçiniz.',
    location: '5. Sokak',
    time: '3 saat önce',
    severity: 'low',
    category: 'other',
    source: 'Mahalle Sakinleri',
    active: true,
    icon: <PawPrint size={20} />,
  },
  {
    id: '8',
    title: 'Gürültü Şikayeti - Gece Saatları',
    description: 'Geç saatlerde müzik ve gürültü şikayeti alınmıştır. Lütfen dikkatli olunuz.',
    location: 'Merkez Apartmanları',
    time: '4 saat önce',
    severity: 'low',
    category: 'other',
    source: 'Mahalle Sakinleri',
    active: false,
    icon: <Volume2 size={20} />,
  },
  {
    id: '9',
    title: 'Trafik Kazası - Çarpışma',
    description: 'İki araç arasında hafif çarpışma meydana gelmiştir. Yaralı bildirilmemiştir.',
    location: 'Dönüş Noktası',
    time: '5 saat önce',
    severity: 'high',
    category: 'traffic',
    source: 'Polis',
    active: false,
    icon: <Car size={20} />,
  },
];

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

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [showActive, setShowActive] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    location: '',
    category: 'security',
    severity: 'medium',
  });

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'all' || alert.category === activeFilter;
    const matchesStatus = alert.active === showActive;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset form
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'security',
      severity: 'medium',
    });
    setIsModalOpen(false);
  };

  const activeAlertCount = mockAlerts.filter(a => a.active).length;
  const resolvedAlertCount = mockAlerts.filter(a => !a.active).length;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Section */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <h1 className="text-2xl font-bold text-[#333]">Mahalle Uyarıları</h1>
            {/* Notification Toggle */}
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2 rounded-lg transition-all ${
                notificationsEnabled
                  ? 'bg-[#00833e] text-white'
                  : 'bg-[#f0f2f5] text-[#8f8f8f] border border-[#e0e0e0]'
              }`}
              title={notificationsEnabled ? "Bildirimler açık" : "Bildirimler kapalı"}
            >
              <Bell size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
            <input
              type="text"
              placeholder="Uyarılarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            {/* Active/Past Toggle */}
            <div className="flex items-center gap-2 bg-[#f0f2f5] rounded-full p-1">
              <button
                onClick={() => setShowActive(true)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  showActive
                    ? 'bg-[#00833e] text-white'
                    : 'text-[#8f8f8f] hover:text-[#333]'
                }`}
              >
                <Eye size={16} />
                Aktif
                <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs font-bold">{activeAlertCount}</span>
              </button>
              <button
                onClick={() => setShowActive(false)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  !showActive
                    ? 'bg-[#00833e] text-white'
                    : 'text-[#8f8f8f] hover:text-[#333]'
                }`}
              >
                <EyeOff size={16} />
                Geçmiş
                <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs font-bold">{resolvedAlertCount}</span>
              </button>
            </div>

            {/* Create Alert Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
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
                    ? 'bg-[#00833e] text-white'
                    : 'bg-white text-[#333] border border-[#e0e0e0] hover:border-[#00833e]'
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
      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-[#8f8f8f] mb-3" />
              <p className="text-[#333] font-medium">Uyarı bulunamadı</p>
              <p className="text-[#8f8f8f] text-sm mt-1">
                {showActive
                  ? 'Şu anda aktif uyarı bulunmamaktadır'
                  : 'Geçmiş uyarı bulunmamaktadır'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/uyarilar/${alert.id}`}
                  className={`block ${getSeverityColor(alert.severity)} rounded-lg p-5 border-2 border-l-4 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    {/* Large Severity Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-lg ${getSeverityIconColor(alert.severity)} bg-white/50`}>
                      {alert.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with Title and Severity Badge */}
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-[#333]">{alert.title}</h3>
                          <p className="text-xs text-[#8f8f8f] mt-0.5 font-medium">Kaynak: {alert.source}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 uppercase tracking-wide ${getSeverityBadgeColor(alert.severity)}`}>
                          {getSeverityLabel(alert.severity)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#404040] mb-4 leading-relaxed">{alert.description}</p>

                      {/* Footer: Location and Time */}
                      <div className="flex items-center gap-4 text-xs text-[#8f8f8f] flex-wrap pt-3 border-t border-white/30">
                        <div className="flex items-center gap-2 font-medium">
                          <MapPin size={16} className="text-[#00833e]" />
                          <span>{alert.location}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-2 font-medium">
                          <Clock size={16} className="text-[#00833e]" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Map */}
          <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
            <LeafletMap
              center={[41.0370, 28.9850]}
              zoom={13}
              className="w-full h-48"
              markers={[
                { lat: 41.0422, lng: 29.0050, title: 'Su Kesintisi', color: 'blue' },
                { lat: 41.0350, lng: 28.9900, title: 'Yol Çalışması', color: 'orange' },
                { lat: 41.0300, lng: 28.9780, title: 'Güvenlik Uyarısı', color: 'red' },
                { lat: 41.0450, lng: 28.9750, title: 'Gürültü Şikayeti', color: 'orange' },
              ]}
              interactive={false}
            />
            <div className="p-3">
              <p className="text-xs text-[#8f8f8f] text-center">Uyarı konumları haritada gösterilmektedir</p>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
            <h3 className="font-bold text-[#333] mb-5 flex items-center gap-2">
              <AlertCircle size={18} className="text-[#00833e]" />
              Aciliyet İstatistikleri
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0] hover:bg-[#f0f2f5] -mx-1 px-1 py-1 rounded transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></div>
                  <span className="text-sm font-medium text-[#333]">Kritik</span>
                </div>
                <span className="font-bold text-lg text-red-600">{mockAlerts.filter(a => a.severity === 'critical' && a.active).length}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0] hover:bg-[#f0f2f5] -mx-1 px-1 py-1 rounded transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-[#333]">Yüksek</span>
                </div>
                <span className="font-bold text-lg text-orange-500">{mockAlerts.filter(a => a.severity === 'high' && a.active).length}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0] hover:bg-[#f0f2f5] -mx-1 px-1 py-1 rounded transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-[#333]">Orta</span>
                </div>
                <span className="font-bold text-lg text-yellow-600">{mockAlerts.filter(a => a.severity === 'medium' && a.active).length}</span>
              </div>
              <div className="flex items-center justify-between hover:bg-[#f0f2f5] -mx-1 px-1 py-1 rounded transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-[#333]">Düşük</span>
                </div>
                <span className="font-bold text-lg text-green-600">{mockAlerts.filter(a => a.severity === 'low' && a.active).length}</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown Card */}
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
            <h3 className="font-bold text-[#333] mb-5 flex items-center gap-2">
              <Zap size={18} className="text-[#00833e]" />
              Kategori Dağılımı
            </h3>
            <div className="space-y-2">
              {filterCategories.filter(c => c.id !== 'all').map((category) => {
                const count = mockAlerts.filter(a => a.category === category.id && a.active).length;
                return (
                  <div key={category.id} className="flex items-center justify-between text-sm hover:bg-[#f0f2f5] -mx-1 px-1 py-1.5 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00833e]">{category.icon}</span>
                      <span className="text-[#333] font-medium">{category.label}</span>
                    </div>
                    <span className="font-bold text-[#00833e] bg-[#e6f4ec] px-2.5 py-0.5 rounded-full text-xs">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0]">
              <h2 className="text-lg font-bold text-[#333]">Yeni Uyarı Oluştur</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-[#8f8f8f]" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateAlert} className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Uyarı başlığını yazınız"
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Uyarının detaylarını yazınız"
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">Konum</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Uyarı konumunu yazınız"
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
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
                <label className="block text-sm font-medium text-[#333] mb-2">Aciliyet Derecesi</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
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
                  className="flex-1 px-4 py-2 border border-[#e0e0e0] text-[#333] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors"
                >
                  Uyarı Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
