"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Home, Compass, Plus, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomBarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomBar = React.forwardRef<HTMLDivElement, BottomBarProps>(
  (
    { className, activeTab = "home", onTabChange, ...props },
    ref
  ) => {
    const tabs = [
      { id: "home", icon: Home, label: "Ana Sayfa" },
      { id: "explore", icon: Compass, label: "Keşfet" },
      { id: "create", icon: Plus, label: "Oluştur", isPrimary: true },
      { id: "messages", icon: MessageSquare, label: "Mesajlar" },
      { id: "profile", icon: User, label: "Profil" },
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-around gap-1 px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant={isActive && !tab.isPrimary ? "ghost" : "ghost"}
                size="sm"
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 h-auto py-2 rounded-lg",
                  tab.isPrimary &&
                    "bg-emerald-600 text-white hover:bg-emerald-700 relative -top-3",
                  isActive &&
                    !tab.isPrimary &&
                    "text-emerald-600 bg-emerald-50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
);

BottomBar.displayName = "BottomBar";

export { BottomBar };
