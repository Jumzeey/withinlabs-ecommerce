'use client';

import { Product } from '@/app/types';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-1">{product.title}</h3>
            <p className="mt-2 text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </Link>
        <div className="p-4 pt-0">
          <Button
            onClick={() => addToCart(product.id)}
            className="w-full gap-2 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}