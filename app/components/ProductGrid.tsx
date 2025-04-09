'use client';

import { Product } from '@/app/types';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      data-testid="product-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </motion.div>
  );
}