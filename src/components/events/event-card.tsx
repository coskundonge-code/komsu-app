'use client';

import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  coverImage: string;
  organizer: {
    name: string;
    avatar: string;
  };
  attendeeCount: number;
  maxAttendees?: number;
  isOnline: boolean;
}

export function EventCard({
  id,
  title,
  description,
  date,
  location,
  coverImage,
  organizer,
  attendeeCount,
  maxAttendees,
  isOnline,
}: EventCardProps) {
  const [isInterested, setIsInterested] = useState(false);

  const dateStr = date.toLocaleDateString('tr-TR', {
    month: 'short',
    day: 'numeric',
  });

  const isFull = maxAttendees ? attendeeCount >= maxAttendees : false;

  return (
    <Link href={`/etkinlikler/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-[#00833e] text-white px-3 py-1 rounded-full text-sm font-semibold">
            {dateStr}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-700 text-sm mb-3">
            <MapPin className="w-4 h-4 text-[#00833e]" />
            <span className="line-clamp-1">
              {isOnline ? 'Çevrimiçi Etkinlik' : location}
            </span>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b">
            <Image
              src={organizer.avatar}
              alt={organizer.name}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-sm text-gray-700">{organizer.name}</span>
          </div>

          {/* Attendees and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00833e]" />
              <span className="text-sm text-gray-700">
                {attendeeCount}
                {maxAttendees ? `/${maxAttendees}` : ''} Katılımcı
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                setIsInterested(!isInterested);
              }}
              className={`p-2 rounded-full transition-colors ${
                isInterested
                  ? 'bg-[#d1fae5] text-[#00833e]'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-5 h-5" fill={isInterested ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              disabled={isFull}
              className="flex-1 bg-[#00833e] hover:bg-[#006b32] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {isFull ? 'Dolu' : 'Katılıyorum'}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsInterested(!isInterested);
              }}
              className="flex-1 border border-[#00833e] text-[#00833e] hover:bg-[#e6f4ec] py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              İlgileniyorum
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
