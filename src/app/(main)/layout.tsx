"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { Footer } from "@/components/layout/footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("home");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar onMenuToggle={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          className="hidden md:flex"
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <BottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
