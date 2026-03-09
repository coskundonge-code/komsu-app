import React from 'react';
import { MapPin, Star, Phone, Globe } from 'lucide-react';

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
}: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-emerald-100">
      {/* Logo Area */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 h-32 flex items-center justify-center border-b border-emerald-100">
        {logo ? (
          <img src={logo} alt={name} className="h-24 w-24 object-cover rounded" />
        ) : (
          <div className="h-24 w-24 bg-emerald-200 rounded flex items-center justify-center text-emerald-700 font-bold text-2xl">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{name}</h3>

        {/* Category */}
        <p className="text-sm text-emerald-600 font-medium mb-2">{category}</p>

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
          <MapPin size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{address}</span>
        </div>

        {/* Contact Info */}
        {(phone || website) && (
          <div className="flex gap-3 border-t border-emerald-100 pt-3">
            {phone && (
              <button className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                <Phone size={14} />
                <span className="hidden sm:inline">Ara</span>
              </button>
            )}
            {website && (
              <button className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium">
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
