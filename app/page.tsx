// app/page.tsx
import { fetchProducts } from "@/lib/api";
import { ProductFilters } from './components/ProductFilters';
import { ProductGrid } from './components/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Pagination } from "./components/Pagination";

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function HomePage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  // Parse and validate page number
  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  // Parse filters
  const filters = {
    category: searchParams.category,
    search: searchParams.search,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  };

  try {
    const { products, totalPages } = await fetchProducts(
      currentPage,
      12,
      filters
    );

    return (
      <div className="py-8 px-4 md:px-8 lg:px-24 space-y-8">
        <ProductFilters initialValues={searchParams} />

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </Suspense>
      </div>
    );

  } catch (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="text-red-500 text-center py-8">
        Failed to load products. Please try again later.
      </div>
    );
  }
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ))}
    </div>
  );
}