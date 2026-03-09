"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Compass,
  ShoppingBag,
  Calendar,
  Users,
  Building2,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isOpen = true, ...props }, ref) => {
    const [expandedSection, setExpandedSection] = React.useState<string | null>(
      null
    );

    const toggleSection = (section: string) => {
      setExpandedSection(expandedSection === section ? null : section);
    };

    const navItems = [
      { icon: Home, label: "Ana Sayfa", href: "/" },
      { icon: Compass, label: "Keşfet", href: "/explore" },
      { icon: ShoppingBag, label: "Pazar Yeri", href: "/marketplace" },
      { icon: Calendar, label: "Etkinlikler", href: "/events" },
      { icon: Users, label: "Gruplar", href: "/groups" },
      { icon: Building2, label: "İşletmeler", href: "/businesses" },
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 border-r border-gray-200 bg-white p-4 transition-all duration-300",
          isOpen ? "w-64" : "hidden",
          "sm:w-64 md:block",
          className
        )}
        {...props}
      >
        {/* User Info Card */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profil" />
                  <AvatarFallback>KB</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Adı Soyadı</p>
                  <p className="text-xs text-gray-600">@kullaniciadi</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Profili Düzenle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className="justify-start gap-3 text-gray-700 hover:bg-emerald-100 hover:text-emerald-600"
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Mahalle Bilgisi Section */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => toggleSection("mahalle")}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-gray-100"
          >
            <span className="text-sm font-semibold text-gray-900">
              Mahalle Bilgisi
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                expandedSection === "mahalle" && "rotate-180"
              )}
            />
          </button>

          {expandedSection === "mahalle" && (
            <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    Mahalle Adı
                  </p>
                  <p className="text-xs text-gray-600">İstanbul, Türkiye</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-semibold text-gray-900">5.2K</span> Komşu
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">Aktif</Badge>
                  <Badge variant="secondary">Dostça</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Groups */}
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
          <h3 className="text-xs font-semibold text-gray-900 uppercase">
            Önerilen Gruplar
          </h3>
          <div className="flex flex-col gap-2">
            {["Hobi Grubu", "Spor Aktiviteleri", "Mahalle Haberleri"].map(
              (group) => (
                <Button
                  key={group}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs"
                >
                  {group}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <a href="#" className="hover:text-emerald-600">
              Gizlilik
            </a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-600">
              Şartlar
            </a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-600">
              İletişim
            </a>
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";

export { Sidebar };
