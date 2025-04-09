import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddToCartButton } from '@/app/components/AddToCartButton';
import { fetchProductById, fetchProducts } from '@/lib/api';

export async function generateStaticParams() {
  try {
    // Get first page of products to generate static paths
    const { products } = await fetchProducts(1, 100); // Increase limit to get more products
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Product;

  try {
    product = await fetchProductById(params.id);
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    notFound();
  }

  return (
    <div className="py-8 px-24">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.slice(1).map((image, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`${product.title} - Image ${i + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="mt-4 text-4xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <AddToCartButton productId={product.id} />

          <Tabs defaultValue="specifications" className="mt-8">
            <TabsList>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications">
              <Card className="p-6">
                <dl className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-semibold">{key}</dt>
                      <dd className="text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card className="divide-y">
                {product.reviews.map((review) => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating
                                ? 'fill-primary text-primary'
                                : 'fill-muted text-muted'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}