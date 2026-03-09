"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { Footer } from "@/components/layout/footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area - 3 column layout */}
      <div className="max-w-[1280px] mx-auto w-full flex flex-1">
        {/* Left Sidebar */}
        <Sidebar className="sticky top-[56px] h-[calc(100vh-56px)]" />

        {/* Center Content */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-4">
          {children}
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer - hidden on mobile where bottom bar is shown */}
      <Footer className="hidden lg:block" />

      {/* Mobile Bottom Bar */}
      <BottomBar />
    </div>
  );
}
