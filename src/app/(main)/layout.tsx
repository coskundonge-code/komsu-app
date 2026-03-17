"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/ui/skip-link";

const RightSidebar = dynamic(() => import("@/components/layout/right-sidebar").then((m) => ({ default: m.RightSidebar })), {
  loading: () => (
    <div className="w-[300px] flex-shrink-0 hidden xl:block py-4 px-2 space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] h-48 animate-pulse" />
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] h-64 animate-pulse" />
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] h-48 animate-pulse" />
    </div>
  ),
  ssr: true,
});

const WelcomeModal = dynamic(() => import("@/components/shared/welcome-modal").then((m) => ({ default: m.WelcomeModal })), {
  ssr: false,
});

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Skip to main content link for accessibility */}
      <SkipLink />

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area - 3 column layout */}
      <div className="max-w-[1280px] mx-auto w-full flex flex-1">
        {/* Left Sidebar */}
        <Sidebar className="sticky top-[56px] h-[calc(100vh-56px)]" />

        {/* Center Content */}
        <main id="main-content" className="flex-1 min-w-0 pb-20 lg:pb-4">
          {children}
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer - hidden on mobile where bottom bar is shown */}
      <Footer className="hidden lg:block" />

      {/* Mobile Bottom Bar */}
      <BottomBar />

      {/* Welcome Modal */}
      <WelcomeModal />
    </div>
  );
}
