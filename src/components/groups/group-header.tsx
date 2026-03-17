'use client';

import { Users, Settings, UserPlus, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface GroupHeaderProps {
  name: string;
  coverImage: string;
  icon: string;
  description: string;
  memberCount: number;
  postCount: number;
  isJoined: boolean;
  isAdmin: boolean;
  onTabChange: (tab: 'posts' | 'members' | 'about') => void;
  activeTab: 'posts' | 'members' | 'about';
}

export function GroupHeader({
  name,
  coverImage,
  icon,
  description,
  memberCount,
  postCount,
  isJoined,
  isAdmin,
  onTabChange,
  activeTab,
}: GroupHeaderProps) {
  const [joined, setJoined] = useState(isJoined);

  const handleJoinLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setJoined(!joined);
  };

  return (
    <div className="bg-white">
      {/* Cover Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <Image
          src={coverImage}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Group Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-10">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-start justify-between mb-8">
          <div className="flex gap-6 flex-1">
            {/* Group Icon */}
            <Image
              src={icon}
              alt={name}
              width={120}
              height={120}
              className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
              <p className="text-gray-600 mb-4">{description}</p>

              {/* Stats */}
              <div className="flex gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00833e]" />
                  <span className="font-semibold">{memberCount} Üye</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{postCount} Gönderi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isAdmin && (
              <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleJoinLeave}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                joined
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-[#00833e] text-white hover:bg-[#006b32]'
              }`}
            >
              {joined ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Gruptan Çık
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Gruba Katıl
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex gap-8">
            {['posts', 'members', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab as any)}
                className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-[#00833e] border-[#00833e]'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab === 'posts' && 'Gönderiler'}
                {tab === 'members' && 'Üyeler'}
                {tab === 'about' && 'Hakkında'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
