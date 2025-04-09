// lib/api.ts
const API_URL = "http://localhost:3001";

export interface Product {
  id: string; // Enforced as string
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  specifications: Record<string, string>;
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

/**
 * Normalizes product data from API to ensure consistent types
 */
function normalizeProduct(product: any): Product {
  return {
    ...product,
    id: String(product.id), // Force ID to string
    reviews: (product.reviews || []).map((review: any) => ({
      ...review,
      id: String(review.id), // Force review IDs to strings
    })),
  };
}

/**
 * Fetches products with pagination and filtering
 */
export async function fetchProducts(
  page: number = 1,
  limit: number = 12,
  filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): Promise<{ products: Product[]; totalPages: number }> {
  let baseUrl = `${API_URL}/products`;
  const queryParams: string[] = [];

  // Apply filters
  if (filters?.category && filters.category !== "All") {
    queryParams.push(`category=${filters.category}`);
  }
  if (filters?.search) {
    queryParams.push(`title_like=${filters.search}`);
  }
  if (filters?.minPrice || filters?.maxPrice) {
    queryParams.push(`price_gte=${filters.minPrice || 0}`);
    queryParams.push(`price_lte=${filters.maxPrice || 9999}`);
  }

  // 1. Get total count
  const countUrl =
    queryParams.length > 0 ? `${baseUrl}?${queryParams.join("&")}` : baseUrl;

  const countResponse = await fetch(countUrl);
  const allProducts = (await countResponse.json()).map(normalizeProduct);
  const totalItems = allProducts.length;
  const totalPages = Math.ceil(totalItems / limit);

  // 2. Get paginated results
  queryParams.push(`_page=${page}`, `_limit=${limit}`);
  const paginatedUrl = `${baseUrl}?${queryParams.join("&")}`;
  const paginatedResponse = await fetch(paginatedUrl);
  const products = (await paginatedResponse.json()).map(normalizeProduct);

  return { products, totalPages };
}

/**
 * Fetches a single product by ID
 */
export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return normalizeProduct(await response.json());
}

/**
 * Searches products by query string
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?q=${query}`);
  if (!response.ok) throw new Error("Failed to search products");
  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}

/**
 * Fetches multiple products for cart display
 */
export async function fetchCartProducts(
  productIds: string[]
): Promise<Product[]> {
  if (productIds.length === 0) return [];

  const response = await fetch(
    `${API_URL}/products?id=${productIds.join("&id=")}`
  );

  if (!response.ok) throw new Error("Failed to fetch cart products");

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}

/**
 * Utility function to check if object is a Product
 */
export function isProduct(obj: any): obj is Product {
  return obj && typeof obj.id !== "undefined";
}
