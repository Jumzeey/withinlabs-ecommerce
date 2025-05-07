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
  const queryParams: string[] = [];

  // Apply filters
  if (filters?.category && filters.category !== "All") {
    queryParams.push(`category=${encodeURIComponent(filters.category)}`);
  }
  if (filters?.search) {
    queryParams.push(`title_like=${encodeURIComponent(filters.search)}`);
  }
  if (filters?.minPrice !== undefined) {
    queryParams.push(`price_gte=${filters.minPrice}`);
  }
  if (filters?.maxPrice !== undefined) {
    queryParams.push(`price_lte=${filters.maxPrice}`);
  }

  // Add pagination parameters
  queryParams.push(`_page=${page}`);
  queryParams.push(`_limit=${limit}`);

  // Construct the URL
  const url = `${API_URL}/products?${queryParams.join("&")}`;

  try {
    // Fetch the paginated data with explicit headers
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    // Get total count from headers
    const totalCountHeader = response.headers.get("X-Total-Count");
    if (!totalCountHeader) {
      console.warn("X-Total-Count header not found in response");
      // Fallback: count the products in the current response
      const products = (await response.json()).map(normalizeProduct);
      return { products, totalPages: Math.ceil(products.length / limit) };
    }

    const totalCount = parseInt(totalCountHeader, 10);
    if (isNaN(totalCount)) {
      console.warn("Invalid X-Total-Count header value:", totalCountHeader);
      const products = (await response.json()).map(normalizeProduct);
      return { products, totalPages: Math.ceil(products.length / limit) };
    }

    const totalPages = Math.ceil(totalCount / limit);
    const products = (await response.json()).map(normalizeProduct);

    return { products, totalPages };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
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
  const response = await fetch(
    `${API_URL}/products?q=${encodeURIComponent(query)}`
  );
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
