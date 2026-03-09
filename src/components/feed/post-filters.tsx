'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export type FilterType = 'all' | 'guvenlik' | 'oneri' | 'kayipbuluntu' | 'anket';

export interface PostFiltersProps {
  onFilterChange?: (filter: FilterType) => void;
  defaultFilter?: FilterType;
}

const filters: Array<{ value: FilterType; label: string }> = [
  { value: 'all', label: 'Tümü' },
  { value: 'guvenlik', label: 'Güvenlik' },
  { value: 'oneri', label: 'Öneriler' },
  { value: 'kayipbuluntu', label: 'Kayıp/Buluntu' },
  { value: 'anket', label: 'Anketler' },
];

export function PostFilters({
  onFilterChange,
  defaultFilter = 'all',
}: PostFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(defaultFilter);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeFilter === filter.value
                ? 'bg-[#00833e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
