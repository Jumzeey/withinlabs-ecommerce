'use client';

import { Product } from '@/app/types';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from './EmptyState';
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      data-testid="product-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}