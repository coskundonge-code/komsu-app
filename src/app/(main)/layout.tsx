"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomBar } from "@/components/layout/bottom-bar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [activeTab, setActiveTab] = React.useState("home");

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <Sidebar className="sticky top-14 h-[calc(100vh-56px)]" />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
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
