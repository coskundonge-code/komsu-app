import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-[#e0e0e0] py-4">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#00833e]" fill="currentColor">
              <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
            </svg>
            <span className="text-2xl font-bold text-[#00833e]">KomşuApp</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#8f8f8f]">
          <a href="#" className="hover:text-[#404040]">Gizlilik</a>
          <a href="#" className="hover:text-[#404040]">Koşullar</a>
          <a href="#" className="hover:text-[#404040]">Hakkında</a>
          <a href="#" className="hover:text-[#404040]">Yardım</a>
        </div>
        <p className="text-xs text-[#8f8f8f] mt-2">© 2026 KomşuApp</p>
      </div>
    </div>
  )
}
