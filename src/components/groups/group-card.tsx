'use client';

import { Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface GroupCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  category: string;
  isJoined?: boolean;
}

export function GroupCard({
  id,
  slug,
  name,
  description,
  coverImage,
  memberCount,
  category,
  isJoined = false,
}: GroupCardProps) {
  const [joined, setJoined] = useState(isJoined);

  return (
    <Link href={`/gruplar/${slug}`}>
      <div className="bg-surface rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Name */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {description}
          </p>

          {/* Member Count */}
          <div className="flex items-center gap-2 text-gray-700 text-sm mb-4 pb-4 border-b">
            <Users className="w-4 h-4 text-primary" />
            <span>{memberCount} Üye</span>
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setJoined(!joined);
            }}
            className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              joined
                ? 'bg-primary-light text-primary hover:bg-[#a7dbb8]'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {joined ? 'Grubun Üyesisin' : 'Gruba Katıl'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
