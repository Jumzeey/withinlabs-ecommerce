// components/ProductFilters.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductFiltersProps {
  initialValues: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export function ProductFilters({ initialValues }: ProductFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialValues.search || '');
  const [category, setCategory] = useState(initialValues.category || 'All');
  const [priceRange, setPriceRange] = useState({
    min: initialValues.minPrice || '',
    max: initialValues.maxPrice || ''
  });

  useEffect(() => {
    // Update local state when initialValues change
    setSearch(initialValues.search || '');
    setCategory(initialValues.category || 'All');
    setPriceRange({
      min: initialValues.minPrice || '',
      max: initialValues.maxPrice || ''
    });
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);

    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Product filters">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Home">Home</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Sports">Sports</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Books">Books</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <span>Price:</span>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="px-3 py-1 border rounded w-24"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="px-3 py-1 border rounded w-24"
          />
        </div>
      </div>
    </form>
  );
}