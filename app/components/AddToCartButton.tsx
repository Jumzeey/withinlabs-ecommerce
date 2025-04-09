'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';

export function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      onClick={() => addToCart(productId)}
    >
      <ShoppingCart className="h-5 w-5" />
      Add to Cart
    </Button>
  );
}