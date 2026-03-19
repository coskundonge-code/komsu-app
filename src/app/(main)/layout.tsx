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
      <div className="bg-surface rounded-lg shadow-card border border-border h-48 animate-pulse" />
      <div className="bg-surface rounded-lg shadow-card border border-border h-64 animate-pulse" />
      <div className="bg-surface rounded-lg shadow-card border border-border h-48 animate-pulse" />
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
    <div className="flex min-h-screen flex-col bg-background">
      <SkipLink />
      <Navbar />

      <div className="max-w-[1280px] mx-auto w-full flex flex-1">
        <Sidebar className="sticky top-14 h-[calc(100vh-56px)]" />

        <main id="main-content" className="flex-1 min-w-0 pb-24 lg:pb-6">
          <div className="page-transition">
            {children}
          </div>
        </main>

        <RightSidebar />
      </div>

      <Footer className="hidden lg:block" />
      <BottomBar />
      <WelcomeModal />
    </div>
  );
}
