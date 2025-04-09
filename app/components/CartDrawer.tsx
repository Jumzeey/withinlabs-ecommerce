'use client';

import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, X } from 'lucide-react'; // Added X icon
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/api';
import { Separator } from '@/components/ui/separator';
import { fetchCartProducts } from '@/lib/api';

export function CartDrawer() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCartProducts() {
      try {
        const productIds = items.map(item => item.productId);
        const cartProducts = productIds.length > 0
          ? await fetchCartProducts(productIds)
          : [];
        setProducts(cartProducts);
      } catch (err) {
        setError('Failed to load cart items');
        console.error('Error loading cart products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCartProducts();
  }, [items]);

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (loading) {
    return <div className="p-6">Loading cart...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const cartItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { ...item, product } : null;
  }).filter(Boolean) as Array<{ product: Product; quantity: number }>;

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground">Add some products to your cart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Clear Cart Button at the top */}
      <div className="flex justify-end p-4">
        <Button
          aria-label="Clear cart"
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600"
          onClick={handleClearCart}
          disabled={totalItems === 0}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium leading-none">{product.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    aria-label="Remove item"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-6 space-y-4 border-t">
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button className="w-full">Checkout</Button>
      </div>
    </div>
  );
}