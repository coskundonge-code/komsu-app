'use client';

import { Heart, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  condition: 'excellent' | 'good' | 'fair' | 'used';
  location: string;
  timeAgo: string;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
  onClick?: () => void;
}

const conditionConfig = {
  excellent: { label: 'Mükemmel', color: 'bg-green-100 text-green-700' },
  good: { label: 'İyi', color: 'bg-blue-100 text-blue-700' },
  fair: { label: 'Orta', color: 'bg-yellow-100 text-yellow-700' },
  used: { label: 'Kullanılmış', color: 'bg-gray-100 text-gray-700' },
};

export function ListingCard({
  id,
  title,
  price,
  imageUrl,
  condition,
  location,
  timeAgo,
  isFavorite = false,
  onFavoriteClick,
  onClick,
}: ListingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [favorited, setFavorited] = useState(isFavorite);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(!favorited);
    onFavoriteClick?.(id);
  };

  const config = conditionConfig[condition];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className={cn(
            'w-full h-full object-cover transition-transform duration-300',
            isHovered && 'scale-105'
          )}
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-3 py-1.5 rounded-lg font-semibold text-sm">
          ₺{price.toLocaleString('tr-TR')}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            size={20}
            className={cn(
              'transition-colors',
              favorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400'
            )}
          />
        </button>

        {/* Condition Badge */}
        <div className={cn('absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium', config.color)}>
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Location & Time */}
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="flex-shrink-0" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
