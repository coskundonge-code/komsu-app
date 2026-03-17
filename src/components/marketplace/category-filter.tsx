'use client';

import { useState } from 'react';
import {
  Smartphone,
  Sofa,
  Shirt,
  BookOpen,
  Dumbbell,
  Puzzle,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type CategoryType = 'all' | 'electronics' | 'furniture' | 'clothing' | 'books' | 'sports' | 'toys' | 'other';

export interface CategoryFilterProps {
  onCategoryChange?: (category: CategoryType) => void;
  defaultCategory?: CategoryType;
  variant?: 'sidebar' | 'chips';
}

const categories: Array<{ value: CategoryType; label: string; icon: React.ReactNode }> = [
  { value: 'all', label: 'Tümü', icon: null },
  { value: 'electronics', label: 'Elektronik', icon: <Smartphone size={20} /> },
  { value: 'furniture', label: 'Mobilya', icon: <Sofa size={20} /> },
  { value: 'clothing', label: 'Giyim', icon: <Shirt size={20} /> },
  { value: 'books', label: 'Kitaplar', icon: <BookOpen size={20} /> },
  { value: 'sports', label: 'Spor', icon: <Dumbbell size={20} /> },
  { value: 'toys', label: 'Oyuncaklar', icon: <Puzzle size={20} /> },
  { value: 'other', label: 'Diğer', icon: <MoreHorizontal size={20} /> },
];

export function CategoryFilter({
  onCategoryChange,
  defaultCategory = 'all',
  variant = 'sidebar',
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(defaultCategory);

  const handleCategoryClick = (category: CategoryType) => {
    setActiveCategory(category);
    onCategoryChange?.(category);
  };

  if (variant === 'chips') {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeCategory === category.value
                ? 'bg-[#00833e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Kategoriler</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
              activeCategory === category.value
                ? 'bg-[#e6f4ec] text-[#006b32] font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {category.icon && (
              <span
                className={cn(
                  'transition-colors',
                  activeCategory === category.value
                    ? 'text-[#00833e]'
                    : 'text-gray-400'
                )}
              >
                {category.icon}
              </span>
            )}
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
