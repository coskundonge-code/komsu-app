import { AlertTriangle } from 'lucide-react'

/**
 * Geliştirme aşamasındaki admin panellerinin başına eklenen uyarı.
 * AUDIT_REPORT.md K3 maddesi tamamlandığında her sayfadan kaldırılacak.
 */
export function MockDataBanner({
  panelName,
  realTablesNote,
}: {
  panelName?: string
  realTablesNote?: string
}) {
  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
      <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
      <div className="text-sm">
        <strong className="text-amber-900">Geliştirme Aşamasında:</strong>{' '}
        <span className="text-amber-800">
          Bu panel{panelName ? ` (${panelName})` : ''} henüz gerçek veritabanına bağlı değildir;
          görüntülenen kayıtlar örnek (mock) veridir. {realTablesNote && <em>{realTablesNote}</em>}
        </span>
      </div>
    </div>
  )
}
