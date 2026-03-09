import Link from 'next/link'
import { Home, Shield, Users, Store, Calendar } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Mobile: Top bar (hidden on desktop) */}
      <div className="lg:hidden bg-white border-b border-[#e0e0e0] py-4 sticky top-0 z-10">
        <div className="px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-[#00833e]" />
            <span className="text-xl font-bold text-[#00833e]">KomşuApp</span>
          </Link>
        </div>
      </div>

      {/* Desktop split layout + Mobile centered */}
      <div className="flex min-h-[calc(100vh-60px)] lg:min-h-screen">
        {/* Left Panel - Brand Panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00833e] to-[#006b32] flex-col justify-between p-12 text-white">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-12 hover:opacity-90 transition-opacity">
              <Home className="w-10 h-10" />
              <span className="text-3xl font-bold">KomşuApp</span>
            </Link>

            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-3">Mahalleni Keşfet</h2>
              <p className="text-green-100 text-lg">Komşularınızla bağlanın ve mahallenizdeki etkinlikleri keşfedin</p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Güvenli Mahalle</h3>
                  <p className="text-green-100 text-sm">Doğrulanmış komşularla güvenli bir topluluk oluşturun</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Komşularla Bağlan</h3>
                  <p className="text-green-100 text-sm">Mahallenizdeki insanlarla tanışın ve yardımlaşın</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <Store className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Yerel İşletmeler</h3>
                  <p className="text-green-100 text-sm">Mahallenizdeki işletmeleri keşfedin ve destekleyin</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Etkinlikler</h3>
                  <p className="text-green-100 text-sm">Mahalle etkinlikleri hakkında bilgi alın ve katılın</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer on left panel */}
          <div className="text-green-100 text-sm">
            <p>© 2026 KomşuApp - Mahalleni Keşfet</p>
          </div>
        </div>

        {/* Right Panel - Form Content */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-[440px]">
              {children}
            </div>
          </div>

          {/* Footer (mobile and desktop) */}
          <div className="border-t border-[#e0e0e0] bg-white py-6">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#8f8f8f] px-4">
              <a href="#" className="hover:text-[#404040] transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-[#404040] transition-colors">Koşullar</a>
              <a href="#" className="hover:text-[#404040] transition-colors">Hakkında</a>
              <a href="#" className="hover:text-[#404040] transition-colors">Yardım</a>
            </div>
            <p className="text-xs text-[#8f8f8f] mt-2 text-center">© 2026 KomşuApp</p>
          </div>
        </div>
      </div>
    </div>
  )
}
