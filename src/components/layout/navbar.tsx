"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Compass,
  ShoppingBag,
  MessageSquare,
  Bell,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuToggle?: (open: boolean) => void;
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ onMenuToggle }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [searchFocused, setSearchFocused] = React.useState(false);

    const handleMenuToggle = () => {
      const newState = !mobileMenuOpen;
      setMobileMenuOpen(newState);
      onMenuToggle?.(newState);
    };

    return (
      <nav
        ref={ref}
        className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              K
            </div>
            <span className="hidden font-bold text-gray-900 sm:inline">
              KomşuApp
            </span>
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden flex-1 max-w-md md:block">
            <div
              className={cn(
                "relative flex items-center rounded-full border-2 border-gray-200 bg-gray-50 px-4 py-2 transition-all",
                searchFocused && "border-emerald-600 bg-white"
              )}
            >
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ara..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="ml-2 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden items-center gap-1 lg:flex">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-5 w-5" />
              <span className="text-sm">Ana Sayfa</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Compass className="h-5 w-5" />
              <span className="text-sm">Keşfet</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-sm">Pazar</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Mesajlar</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Bell className="h-5 w-5" />
              <span className="text-sm">Bildirimler</span>
            </Button>
          </div>

          {/* Right Side - Icons and User Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Icon */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Navigation Icons */}
            <div className="flex items-center gap-1 lg:hidden">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
            </div>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-0 h-10 w-10"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Kullanıcı" />
                    <AvatarFallback>KB</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-900">Kullanıcı Adı</span>
                  <span className="text-xs text-gray-500">kullanici@example.com</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profilim</DropdownMenuItem>
                <DropdownMenuItem>Ayarlar</DropdownMenuItem>
                <DropdownMenuItem>Favorilerim</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Yardım ve Destek</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Çıkış Yap</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={handleMenuToggle}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="border-t border-gray-200 px-4 py-2 md:hidden">
          <div
            className={cn(
              "relative flex items-center rounded-full border-2 border-gray-200 bg-gray-50 px-4 py-2 transition-all",
              searchFocused && "border-emerald-600 bg-white"
            )}
          >
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="ml-2 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";

export { Navbar };
