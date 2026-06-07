'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

// NOT (2026-06-07): Bu panel eskiden 20 adet UYDURMA ödeme kaydı (Ahmet K., Fatma D. ...)
// ve sahte gelir istatistikleri gösteriyordu — aylık gelir gerçek veriden değil
// "haftalık × 2.5" gibi uydurma bir çarpandan hesaplanıyordu. Artık tüm kayıtlar ve
// gelir rakamları canlı `payments` tablosundan gelir. Admin'in tüm ödemeleri
// görebilmesi için `pay_select_admin` RLS politikası eklendi (sahip-bazlı
// pay_select_own korunur). Bkz. TECH_DEBT #12.

// payment_type / status değerleri payment servisindeki enum'larla aynıdır
// (src/lib/services/payment.ts).
const TYPE_LABELS: Record<string, string> = {
  listing_fee: 'İlan Ücreti',
  featured_3days: 'Öne Çıkar (3 gün)',
  featured_7days: 'Öne Çıkar (7 gün)',
  featured_30days: 'Öne Çıkar (30 gün)',
  business_monthly: 'İşletme Aboneliği',
};

const TYPE_COLORS: Record<string, string> = {
  listing_fee: 'bg-purple-100 text-purple-800',
  featured_3days: 'bg-blue-100 text-blue-800',
  featured_7days: 'bg-blue-100 text-blue-800',
  featured_30days: 'bg-blue-100 text-blue-800',
  business_monthly: 'bg-green-100 text-green-800',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  processing: { label: 'İşleniyor', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800', icon: '✓' },
  failed: { label: 'Başarısız', color: 'bg-red-100 text-red-800', icon: '✕' },
  refunded: { label: 'İade Edildi', color: 'bg-blue-100 text-blue-800', icon: '↩' },
  cancelled: { label: 'İptal Edildi', color: 'bg-gray-100 text-gray-800', icon: '–' },
};

const METHOD_LABELS: Record<string, string> = {
  credit_card: 'Kredi Kartı',
  debit_card: 'Banka Kartı',
  bank_transfer: 'Banka Transferi',
  wallet: 'Cüzdan',
};

interface PaymentRow {
  id: string;
  reference: string;
  userName: string;
  amount: number;
  paymentType: string | null;
  status: string;
  method: string | null;
  description: string | null;
  createdAtMs: number;
  createdAtLabel: string;
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function fetchPayments(): Promise<PaymentRow[]> {
  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from('payments')
    .select(
      'id, merchant_oid, payment_reference, user_id, amount, payment_type, status, method, description, created_at, completed_at'
    )
    .order('created_at', { ascending: false })
    .limit(1000);
  if (error) throw error;

  const rows = (data as any[]) || [];

  // Kullanıcı adlarını ayrı sorguda topla (payments.user_id → auth.users;
  // PostgREST embed'e güvenmek yerine profiles'tan ad eşlemesi yap).
  const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
  const nameMap = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: profs } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);
    for (const p of (profs as any[]) || []) {
      nameMap.set(p.id, p.full_name || '');
    }
  }

  return rows.map((r) => ({
    id: r.id,
    reference: r.merchant_oid || r.payment_reference || r.id.slice(0, 8),
    userName: (r.user_id && nameMap.get(r.user_id)) || 'Bilinmiyor',
    amount: Number(r.amount) || 0,
    paymentType: r.payment_type,
    status: r.status,
    method: r.method,
    description: r.description,
    createdAtMs: r.created_at ? new Date(r.created_at).getTime() : 0,
    createdAtLabel: formatDateTime(r.created_at),
  }));
}

export default function OdemelerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null);

  const itemsPerPage = 10;

  const {
    data: payments = [],
    isLoading,
    error,
  }: { data?: PaymentRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: fetchPayments,
  });

  const filteredPayments = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return payments.filter((p) => {
      const matchesSearch =
        !q ||
        p.userName.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q);
      const matchesType = !typeFilter || p.paymentType === typeFilter;
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [payments, searchTerm, typeFilter, statusFilter]);

  const paginatedPayments = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));

  // Gerçek gelir: yalnızca tamamlanan ödemeler, kayan 1/7/30 günlük pencereler.
  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 86_400_000;
    const completed = payments.filter((p) => p.status === 'completed');
    const sumWithin = (windowDays: number) =>
      completed
        .filter((p) => p.createdAtMs > 0 && now - p.createdAtMs <= windowDays * dayMs)
        .reduce((sum, p) => sum + p.amount, 0);
    return {
      daily: sumWithin(1),
      weekly: sumWithin(7),
      monthly: sumWithin(30),
      total: payments.length,
    };
  }, [payments]);

  const statCards = [
    { title: 'Günlük Gelir (son 24s)', value: `₺${stats.daily.toLocaleString('tr-TR')}`, color: '#00833e' },
    { title: 'Haftalık Gelir (7g)', value: `₺${stats.weekly.toLocaleString('tr-TR')}`, color: '#4CAF50' },
    { title: 'Aylık Gelir (30g)', value: `₺${stats.monthly.toLocaleString('tr-TR')}`, color: '#2196F3' },
    { title: 'Toplam İşlem', value: stats.total.toLocaleString('tr-TR'), color: '#FF9800' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Yönetimi</h1>
        <p className="text-gray-600">
          Tüm ödeme işlemlerini takip edin ve gelir istatistiklerini görüntüleyin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-surface p-6 rounded-lg border border-border">
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: stat.color }}>
              {isLoading ? '—' : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface p-6 rounded-lg border border-border mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kullanıcı veya işlem referansı ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Türler</option>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-gray-700 font-medium">Ödemeler yüklenemedi</p>
            <p className="text-gray-500 text-sm mt-1">Yetkiniz olduğundan emin olun veya tekrar deneyin.</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-700 font-medium">Henüz ödeme kaydı yok</p>
            <p className="text-gray-500 text-sm mt-1">İlk ödeme alındığında burada görünecek.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Referans</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kullanıcı</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Miktar</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tür</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Durum</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tarih</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment) => {
                    const statusConfig =
                      STATUS_CONFIG[payment.status] || {
                        label: payment.status,
                        color: 'bg-gray-100 text-gray-800',
                        icon: '•',
                      };
                    const typeLabel = payment.paymentType
                      ? TYPE_LABELS[payment.paymentType] || payment.paymentType
                      : '—';
                    const typeColor =
                      (payment.paymentType && TYPE_COLORS[payment.paymentType]) ||
                      'bg-gray-100 text-gray-800';
                    return (
                      <tr key={payment.id} className="border-b border-border hover:bg-background">
                        <td className="px-6 py-4">
                          <span className="font-mono font-medium text-gray-900">{payment.reference}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{payment.userName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">
                            ₺{payment.amount.toLocaleString('tr-TR')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>
                            {typeLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.icon} {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{payment.createdAtLabel}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="text-primary hover:text-primary-hover font-medium text-sm"
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <span className="text-sm text-gray-600">
                {filteredPayments.length === 0 ? (
                  'Filtreye uyan ödeme yok'
                ) : (
                  <>
                    Sayfa {currentPage} / {totalPages} ({filteredPayments.length} ödeme)
                  </>
                )}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Ödeme Detayı</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Referans</p>
                  <p className="text-gray-900 mt-1 font-mono">{selectedPayment.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Miktar</p>
                  <p className="text-gray-900 mt-1 font-bold">
                    ₺{selectedPayment.amount.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kullanıcı</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Tür</p>
                  <p className="text-gray-900 mt-1">
                    {selectedPayment.paymentType
                      ? TYPE_LABELS[selectedPayment.paymentType] || selectedPayment.paymentType
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Durum</p>
                  <p className="text-gray-900 mt-1">
                    {STATUS_CONFIG[selectedPayment.status]?.label || selectedPayment.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Ödeme Yöntemi</p>
                  <p className="text-gray-900 mt-1">
                    {selectedPayment.method
                      ? METHOD_LABELS[selectedPayment.method] || selectedPayment.method
                      : '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-semibold">Açıklama</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.description || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-semibold">Tarih</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.createdAtLabel}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border">
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full px-4 py-2 border border-border rounded-lg text-gray-900 font-medium hover:bg-background"
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
