// components/ProductFilters.tsx
'use client';

import { useFilters } from '@/app/hooks/useFilters';
import { Loader2, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFiltersProps {
  initialValues: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export function ProductFilters({ initialValues }: ProductFiltersProps) {
  const {
    filters,
    isLoading,
    updateFilter,
    updatePriceRange,
    clearFilters,
  } = useFilters(initialValues);

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'All' ||
    filters.priceRange.min ||
    filters.priceRange.max;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10 pr-4 py-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Home">Home</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Sports">Sports</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Books">Books</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Price Range:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => updatePriceRange('min', e.target.value)}
                className="px-3 py-1 border rounded w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                min="0"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => updatePriceRange('max', e.target.value)}
                className="px-3 py-1 border rounded w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <span>Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                  Search: {filters.search}
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.category !== 'All' && (
                <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                  Category: {filters.category}
                  <button
                    onClick={() => updateFilter('category', 'All')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.priceRange.min || filters.priceRange.max) && (
                <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                  Price: {filters.priceRange.min || '0'} - {filters.priceRange.max || '∞'}
                  <button
                    onClick={() => {
                      updatePriceRange('min', '');
                      updatePriceRange('max', '');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}