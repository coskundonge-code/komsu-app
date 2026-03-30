'use client';

import { toast } from '@/lib/utils/show-toast'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Shield, CheckCircle, XCircle, Clock, AlertTriangle, Eye,
  Filter, ChevronDown, ChevronUp, MessageSquare, ShoppingBag,
  Users, Calendar, Bell, Star, Image as ImageIcon, BarChart3,
  RefreshCw, Search, ArrowLeft, ArrowRight, Zap, Bot
} from 'lucide-react';
import { getAvatarUrl, getFeedImageUrl } from '@/lib/demo-images';

// ============ TYPES ============

type ContentType = 'post' | 'listing' | 'group' | 'event' | 'alert' | 'comment' | 'business_review' | 'story';
type ModerationStatus = 'pending_ai' | 'ai_approved' | 'ai_rejected' | 'pending_admin' | 'admin_approved' | 'admin_rejected' | 'published' | 'removed';
type Priority = 'low' | 'medium' | 'high' | 'critical';
type TabType = 'queue' | 'approved' | 'rejected' | 'stats';

interface QueueItem {
  id: string;
  contentType: ContentType;
  authorName: string;
  authorAvatar: string;
  title: string | null;
  content: string;
  imageUrls: string[] | null;
  aiScore: number;
  aiCategories: string[];
  aiReasoning: string;
  priority: Priority;
  status: ModerationStatus;
  createdAt: string;
  autoApproved: boolean;
}

// ============ MOCK DATA ============

const mockQueue: QueueItem[] = [
  {
    id: '1',
    contentType: 'post',
    authorName: 'Ahmet Yılmaz',
    authorAvatar: getAvatarUrl('Ahmet Yılmaz', 0),
    title: 'Mahallede elektrik kesintisi',
    content: 'Bugün saat 14:00\'den beri elektrik yok. BEDAŞ\'ı aradım ama meşgul çıkıyor. Başka arayan oldu mu? Tahmini açılma saati bilen var mı?',
    imageUrls: null,
    aiScore: 95,
    aiCategories: ['clean'],
    aiReasoning: 'İçerik temiz görünüyor',
    priority: 'low',
    status: 'pending_admin',
    createdAt: '2026-03-10T10:30:00Z',
    autoApproved: false,
  },
  {
    id: '2',
    contentType: 'listing',
    authorName: 'Zeynep Kaya',
    authorAvatar: getAvatarUrl('Zeynep Kaya', 1),
    title: 'IKEA Billy Kitaplık - Az Kullanılmış',
    content: 'IKEA Billy kitaplık, beyaz renk, 80x28x202 cm. 6 aylık, çok az kullanıldı. Taşınma sebebiyle satılık. Fiyat: 800₺. Pazarlık payı var.',
    imageUrls: [getFeedImageUrl(1, 400, 300), getFeedImageUrl(2, 400, 300)],
    aiScore: 92,
    aiCategories: ['clean'],
    aiReasoning: 'İçerik temiz görünüyor',
    priority: 'low',
    status: 'pending_admin',
    createdAt: '2026-03-10T09:15:00Z',
    autoApproved: false,
  },
  {
    id: '3',
    contentType: 'alert',
    authorName: 'Mehmet Demir',
    authorAvatar: getAvatarUrl('Mehmet Demir', 2),
    title: 'DİKKAT: Şüpheli kişi',
    content: 'Cadde üzerinde son 3 gündür kapıları deneyen şüpheli bir kişi görüldü. Dikkatli olun, kapılarınızı kilitleyin. Polis bilgilendirildi.',
    imageUrls: null,
    aiScore: 78,
    aiCategories: ['clean'],
    aiReasoning: 'Acil durum içeriği - ek denetim gerekli',
    priority: 'high',
    status: 'pending_admin',
    createdAt: '2026-03-10T08:45:00Z',
    autoApproved: false,
  },
  {
    id: '4',
    contentType: 'post',
    authorName: 'Can Özkan',
    authorAvatar: getAvatarUrl('Ceyda Özkan', 3),
    title: null,
    content: 'Herkese merhaba, kolay para kazanmak isteyenler bu linke tıklasın: https://fake-site.com/kazan. Garantili günlük 5000₺ gelir. WhatsApp grubumuz: +90 555 123 4567',
    imageUrls: null,
    aiScore: 12,
    aiCategories: ['scam', 'spam'],
    aiReasoning: 'Olası dolandırıcılık içeriği: kolay para, garantili gelir, link tıkla, whatsapp grup; Spam belirtileri: Kısa metin + link',
    priority: 'critical',
    status: 'ai_rejected',
    createdAt: '2026-03-10T07:20:00Z',
    autoApproved: false,
  },
  {
    id: '5',
    contentType: 'business_review',
    authorName: 'Ayşe Çetin',
    authorAvatar: getAvatarUrl('Ahmet Çelik', 4),
    title: 'Harika lezzet!',
    content: 'Mahallenin en iyi fırını. Pide ve lahmacun mükemmel. Fiyatlar da gayet uygun. Kesinlikle tavsiye ederim. 5/5 ⭐',
    imageUrls: [getFeedImageUrl(3, 400, 300)],
    aiScore: 88,
    aiCategories: ['clean'],
    aiReasoning: 'İçerik temiz görünüyor',
    priority: 'low',
    status: 'pending_admin',
    createdAt: '2026-03-10T11:00:00Z',
    autoApproved: false,
  },
  {
    id: '6',
    contentType: 'comment',
    authorName: 'Kerem Aydın',
    authorAvatar: getAvatarUrl('Kemal Aslan', 5),
    title: null,
    content: 'Bu adamın yaptığı resmen dolandırıcılık amk! Herkes dikkat etsin bu şerefsiz insanları kandırıyor.',
    imageUrls: null,
    aiScore: 35,
    aiCategories: ['profanity'],
    aiReasoning: 'Uygunsuz dil tespit edildi: 2 kelime',
    priority: 'medium',
    status: 'pending_admin',
    createdAt: '2026-03-10T10:00:00Z',
    autoApproved: false,
  },
  {
    id: '7',
    contentType: 'group',
    authorName: 'Fatma Şahin',
    authorAvatar: getAvatarUrl('Fatma Sarı', 6),
    title: 'Mahalle Yürüyüş Grubu',
    content: 'Her sabah 07:00\'de parkta buluşup yürüyüş yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Sağlıklı yaşam, birlikte güzel.',
    imageUrls: null,
    aiScore: 97,
    aiCategories: ['clean'],
    aiReasoning: 'İçerik temiz görünüyor',
    priority: 'low',
    status: 'pending_admin',
    createdAt: '2026-03-10T06:30:00Z',
    autoApproved: false,
  },
  {
    id: '8',
    contentType: 'event',
    authorName: 'İbrahim Koç',
    authorAvatar: getAvatarUrl('İsmail Kaya', 7),
    title: 'Mahalle İftar Yemeği',
    content: 'Ramazan ayı münasebetiyle mahalle iftarı düzenliyoruz. Yer: Merkez Park. Tarih: 15 Mart 2026. Katılım ücretsizdir. Getirmek istediğiniz yiyecekleri yazabilirsiniz.',
    imageUrls: [getFeedImageUrl(4, 400, 300)],
    aiScore: 96,
    aiCategories: ['clean'],
    aiReasoning: 'İçerik temiz görünüyor',
    priority: 'low',
    status: 'pending_admin',
    createdAt: '2026-03-09T20:00:00Z',
    autoApproved: false,
  },
];

// ============ HELPER FUNCTIONS ============

function getContentTypeIcon(type: ContentType) {
  const icons: Record<ContentType, typeof MessageSquare> = {
    post: MessageSquare,
    listing: ShoppingBag,
    group: Users,
    event: Calendar,
    alert: AlertTriangle,
    comment: MessageSquare,
    business_review: Star,
    story: ImageIcon,
  };
  return icons[type] || MessageSquare;
}

function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    post: 'Paylaşım',
    listing: 'İlan',
    group: 'Grup',
    event: 'Etkinlik',
    alert: 'Acil Durum',
    comment: 'Yorum',
    business_review: 'İşletme Yorumu',
    story: 'Hikaye',
  };
  return labels[type];
}

function getPriorityBadge(priority: Priority) {
  const config = {
    low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Düşük' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Orta' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Yüksek' },
    critical: { bg: 'bg-red-100', text: 'text-red-800', label: 'Kritik' },
  };
  return config[priority];
}

function getAIScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

function getAIScoreBg(score: number): string {
  if (score >= 85) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

// ============ COMPONENT ============

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('queue');
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch reports from Supabase
  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Map reports to queue items - keep mock data as fallback
          // In a real scenario, you'd map report data to QueueItem structure
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  // Filtrelenmiş öğeler
  const filteredQueue = queue.filter((item) => {
    if (activeTab === 'queue' && !['pending_admin', 'ai_approved'].includes(item.status)) return false;
    if (activeTab === 'approved' && item.status !== 'published') return false;
    if (activeTab === 'rejected' && !['ai_rejected', 'admin_rejected'].includes(item.status)) return false;
    if (filterType !== 'all' && item.contentType !== filterType) return false;
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.content.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q) ||
        (item.title?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  // İstatistikler
  const stats = {
    pendingAdmin: queue.filter(i => ['pending_admin', 'ai_approved'].includes(i.status)).length,
    aiRejected: queue.filter(i => i.status === 'ai_rejected').length,
    published: queue.filter(i => i.status === 'published').length,
    adminRejected: queue.filter(i => i.status === 'admin_rejected').length,
    autoApproved: queue.filter(i => i.autoApproved).length,
    avgAiScore: Math.round(queue.reduce((sum, i) => sum + i.aiScore, 0) / queue.length),
  };

  const handleApprove = async (id: string) => {
    const supabase = createClient();
    try {
      // Find the report and update its status
      const item = queue.find(i => i.id === id);
      if (item) {
        await (supabase as any)
          .from('reports')
          .update({ status: 'resolved' })
          .eq('id', id);

        // Log moderation action
        await (supabase as any)
          .from('moderation_actions')
          .insert({
            report_id: id,
            moderator_id: 'admin',
            action_type: 'approved',
            reason: adminNote || 'Approved content',
          });

        setQueue(prev => prev.map(item =>
          item.id === id ? { ...item, status: 'published' as ModerationStatus } : item
        ));
        setSelectedItem(null);
        setAdminNote('');
      }
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error('İşlem başarısız oldu');
    }
  };

  const handleReject = async (id: string) => {
    if (!adminNote.trim()) {
      toast.warning('Lütfen red gerekçesi yazın');
      return;
    }
    const supabase = createClient();
    try {
      // Update report status
      await (supabase as any)
        .from('reports')
        .update({ status: 'dismissed' })
        .eq('id', id);

      // Log moderation action
      await (supabase as any)
        .from('moderation_actions')
        .insert({
          report_id: id,
          moderator_id: 'admin',
          action_type: 'rejected',
          reason: adminNote,
        });

      setQueue(prev => prev.map(item =>
        item.id === id ? { ...item, status: 'admin_rejected' as ModerationStatus } : item
      ));
      setSelectedItem(null);
      setAdminNote('');
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error('İşlem başarısız oldu');
    }
  };

  const handleBulkApprove = () => {
    const lowRiskIds = filteredQueue
      .filter(i => i.aiScore >= 85 && i.priority === 'low')
      .map(i => i.id);
    setQueue(prev => prev.map(item =>
      lowRiskIds.includes(item.id) ? { ...item, status: 'published' as ModerationStatus, autoApproved: true } : item
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">İçerik Moderasyonu</h1>
            <p className="text-sm text-text-muted">AI destekli içerik denetim sistemi</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkApprove}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
          >
            <Zap size={16} />
            Düşük Risklileri Toplu Onayla
          </button>
          <button className="p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors">
            <RefreshCw size={18} className="text-[#666]" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Bekleyen', value: stats.pendingAdmin, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'AI Reddetti', value: stats.aiRejected, icon: Bot, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Yayında', value: stats.published, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Reddedilen', value: stats.adminRejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Oto-Onay', value: stats.autoApproved, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Ort. AI Skor', value: stats.avgAiScore, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-lg p-3 border border-opacity-20`}>
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={14} className={stat.color} />
              <span className="text-xs text-text-muted">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-background rounded-lg p-1">
        {[
          { key: 'queue' as TabType, label: 'Onay Bekleyen', count: stats.pendingAdmin },
          { key: 'approved' as TabType, label: 'Onaylanan', count: stats.published },
          { key: 'rejected' as TabType, label: 'Reddedilen', count: stats.aiRejected + stats.adminRejected },
          { key: 'stats' as TabType, label: 'İstatistikler', count: null },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-surface text-primary shadow-sm'
                : 'text-[#666] hover:text-text-primary'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-[#e0e0e0] text-[#666]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="İçerik veya yazar ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-surface-hover transition-colors"
        >
          <Filter size={16} />
          Filtrele
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showFilters && (
        <div className="flex gap-3 mb-4 p-3 bg-[#f9f9f9] rounded-lg border border-border">
          <div>
            <label className="text-xs text-text-muted mb-1 block">İçerik Tipi</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ContentType | 'all')}
              className="px-3 py-1.5 border border-border rounded-md text-sm"
            >
              <option value="all">Tümü</option>
              <option value="post">Paylaşım</option>
              <option value="listing">İlan</option>
              <option value="alert">Acil Durum</option>
              <option value="comment">Yorum</option>
              <option value="group">Grup</option>
              <option value="event">Etkinlik</option>
              <option value="business_review">İşletme Yorumu</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Öncelik</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
              className="px-3 py-1.5 border border-border rounded-md text-sm"
            >
              <option value="all">Tümü</option>
              <option value="critical">Kritik</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Moderasyon İstatistikleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Performans */}
            <div className="p-4 bg-background rounded-lg">
              <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                <Bot size={18} className="text-primary" />
                AI Filtre Performansı
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#666]">Toplam incelenen</span><span className="font-semibold">{queue.length}</span></div>
                <div className="flex justify-between"><span className="text-[#666]">Otomatik onay oranı</span><span className="font-semibold text-green-600">{Math.round((stats.autoApproved / queue.length) * 100)}%</span></div>
                <div className="flex justify-between"><span className="text-[#666]">Otomatik red oranı</span><span className="font-semibold text-red-600">{Math.round((stats.aiRejected / queue.length) * 100)}%</span></div>
                <div className="flex justify-between"><span className="text-[#666]">Admin incelemesine gönderilen</span><span className="font-semibold text-yellow-600">{Math.round((stats.pendingAdmin / queue.length) * 100)}%</span></div>
                <div className="flex justify-between"><span className="text-[#666]">Ortalama AI skoru</span><span className="font-semibold">{stats.avgAiScore}/100</span></div>
              </div>
            </div>
            {/* İçerik Dağılımı */}
            <div className="p-4 bg-background rounded-lg">
              <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                İçerik Tipi Dağılımı
              </h3>
              <div className="space-y-2 text-sm">
                {(['post', 'listing', 'comment', 'alert', 'event', 'group', 'business_review'] as ContentType[]).map((type) => {
                  const count = queue.filter(i => i.contentType === type).length;
                  const pct = Math.round((count / queue.length) * 100);
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <span className="text-[#666] w-28">{getContentTypeLabel(type)}</span>
                      <div className="flex-1 h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      {activeTab !== 'stats' && (
        <div className="space-y-3">
          {filteredQueue.length === 0 && (
            <div className="text-center py-12 bg-surface rounded-lg border border-border">
              <CheckCircle size={48} className="mx-auto text-primary mb-3" />
              <p className="text-lg font-medium text-text-primary">Tüm içerikler işlendi!</p>
              <p className="text-sm text-text-muted mt-1">Şu anda bekleyen içerik yok</p>
            </div>
          )}

          {filteredQueue.map((item) => {
            const Icon = getContentTypeIcon(item.contentType);
            const priorityBadge = getPriorityBadge(item.priority);
            const isExpanded = selectedItem?.id === item.id;

            return (
              <div
                key={item.id}
                className={`bg-surface rounded-lg border transition-all ${
                  isExpanded ? 'border-primary shadow-md' : 'border-border hover:border-[#ccc]'
                }`}
              >
                {/* Compact Row */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => setSelectedItem(isExpanded ? null : item)}
                >
                  {/* Priority indicator */}
                  <div className={`w-1 h-12 rounded-full ${
                    item.priority === 'critical' ? 'bg-red-500' :
                    item.priority === 'high' ? 'bg-orange-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />

                  {/* Type Icon */}
                  <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#666]" />
                  </div>

                  {/* Author */}
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />

                  {/* Content Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{item.authorName}</span>
                      <span className="text-xs text-text-muted">·</span>
                      <span className="text-xs text-text-muted">{getContentTypeLabel(item.contentType)}</span>
                    </div>
                    <p className="text-sm text-[#666] truncate">
                      {item.title ? `${item.title}: ` : ''}{item.content}
                    </p>
                  </div>

                  {/* AI Score */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getAIScoreColor(item.aiScore)}`}>
                        {item.aiScore}
                      </div>
                      <div className="text-[10px] text-text-muted">AI Skor</div>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${priorityBadge.bg} ${priorityBadge.text}`}>
                    {priorityBadge.label}
                  </span>

                  {/* Time */}
                  <span className="text-xs text-text-muted flex-shrink-0 w-16 text-right">
                    {timeAgo(item.createdAt)}
                  </span>

                  {/* Expand */}
                  {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[#f0f2f5]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* İçerik */}
                      <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">İçerik</h4>
                        {item.title && (
                          <p className="text-sm font-semibold text-text-primary mb-1">{item.title}</p>
                        )}
                        <p className="text-sm text-[#666] whitespace-pre-wrap">{item.content}</p>
                        {item.imageUrls && item.imageUrls.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {item.imageUrls.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`Görsel ${i + 1}`}
                                className="w-20 h-20 rounded-lg object-cover border border-border"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* AI Analizi */}
                      <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase mb-2 flex items-center gap-1">
                          <Bot size={12} />
                          AI Analizi
                        </h4>
                        <div className="space-y-2">
                          {/* Score Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#666]">Güvenlik Skoru</span>
                              <span className={`font-bold ${getAIScoreColor(item.aiScore)}`}>{item.aiScore}/100</span>
                            </div>
                            <div className="h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getAIScoreBg(item.aiScore)}`}
                                style={{ width: `${item.aiScore}%` }}
                              />
                            </div>
                          </div>
                          {/* Categories */}
                          <div className="flex flex-wrap gap-1">
                            {item.aiCategories.map((cat) => (
                              <span
                                key={cat}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  cat === 'clean' ? 'bg-green-100 text-green-800' :
                                  cat === 'scam' ? 'bg-red-100 text-red-800' :
                                  cat === 'spam' ? 'bg-orange-100 text-orange-800' :
                                  cat === 'profanity' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {cat === 'clean' ? '✓ Temiz' :
                                 cat === 'scam' ? '⚠ Dolandırıcılık' :
                                 cat === 'spam' ? '⚠ Spam' :
                                 cat === 'profanity' ? '⚠ Küfür' :
                                 cat === 'hate_speech' ? '⚠ Nefret' :
                                 cat}
                              </span>
                            ))}
                          </div>
                          {/* Reasoning */}
                          <div className="text-xs text-[#666] bg-[#f9f9f9] p-2 rounded-md">
                            <strong>AI Değerlendirmesi:</strong> {item.aiReasoning}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {activeTab === 'queue' && (
                      <div className="mt-4 pt-4 border-t border-[#f0f2f5]">
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <label className="text-xs text-text-muted mb-1 block">Admin Notu (red için zorunlu)</label>
                            <input
                              type="text"
                              placeholder="Red gerekçesi veya not..."
                              value={adminNote}
                              onChange={(e) => setAdminNote(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                          >
                            <CheckCircle size={16} />
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            <XCircle size={16} />
                            Reddet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {filteredQueue.length > 0 && (
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-muted">
                Toplam {filteredQueue.length} içerik
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="text-sm text-[#666]">Sayfa {currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 rounded-lg border border-border hover:bg-surface-hover"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
