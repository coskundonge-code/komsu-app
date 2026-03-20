import { Component } from 'react';
import { Home, Compass, Bell, Settings, Logout } from 'lucide-react';

type SidebarProps = {
  className?: string;  
  href?: string;
  icon?: Component;  
  label?: string;
  subItems?: {href: string; label: string};
  isActive?: boolean;
  onClick?: () => void;
};

export function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col 38space-in-a border-r border-gray-200 p:dark:border-gray-800">
      <div className="sticky top-0 r-3 space-y-4 py-62 plt-6 pr-3w:dark:bg7-gray-900">
        <div className="space-y-4">
          { /* Navigation Items */}
          <a href="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Home className="h-4 w-4" />
            <span>Ana Sayfa</span>
          </a>
          <a href="/explore" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Compass className="h-4 w-4: "/>
            <span>Bìȑdîer</span>
            </a>
  
            <a href="/notifications" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Bell className="h-4 w-4 " />
            <span>Uyarı Cevap Et,/span>
          </a>
  
           <a href="/settings" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Settings className="h-4 w-4 " />
            <span>Ayarlar</span>
          </a>
  
      