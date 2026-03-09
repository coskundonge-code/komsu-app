import React from 'react';
import { MapPin, Star, Phone, Globe, Clock } from 'lucide-react';

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  logo?: string;
  phone?: string;
  website?: string;
  isOpen?: boolean;
}

export function BusinessCard({
  id,
  name,
  category,
  rating,
  reviewCount,
  address,
  logo,
  phone,
  website,
  isOpen,
}: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#d1fae5] hover:border-[#00833e] hover:scale-105">
      {/* Logo Area */}
      <div className="bg-gradient-to-r from-[#e6f4ec] to-green-50 h-32 flex items-center justify-center border-b border-[#d1fae5]">
        {logo ? (
          <img src={logo} alt={name} className="h-24 w-24 object-cover rounded" />
        ) : (
          <div className="h-24 w-24 bg-[#a7dbb8] rounded flex items-center justify-center text-[#006b32] font-bold text-2xl">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{name}</h3>
          {typeof isOpen === 'boolean' && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
              isOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              <Clock size={12} />
              <span>{isOpen ? 'Açık' : 'Kapalı'}</span>
            </div>
          )}
        </div>

        {/* Category */}
        <p className="text-sm text-[#00833e] font-medium mb-2">{category}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : i < rating
                    ? 'fill-yellow-400 text-yellow-400 opacity-50'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        {/* Address */}
        <div className="flex gap-2 text-xs text-gray-600 mb-3 line-clamp-2">
          <MapPin size={14} className="text-[#00833e] flex-shrink-0 mt-0.5" />
          <span>{address}</span>
        </div>

        {/* Contact Info */}
        {(phone || website) && (
          <div className="flex gap-3 border-t border-[#d1fae5] pt-3">
            {phone && (
              <button className="flex items-center gap-1 text-xs text-[#00833e] hover:text-[#006b32] font-medium">
                <Phone size={14} />
                <span className="hidden sm:inline">Ara</span>
              </button>
            )}
            {website && (
              <button className="flex items-center gap-1 text-xs text-[#00833e] hover:text-[#006b32] font-medium">
                <Globe size={14} />
                <span className="hidden sm:inline">Web</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
