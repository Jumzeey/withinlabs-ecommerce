// lib/api.ts
const API_URL = "http://localhost:3001";

export interface Product {
  id: string;
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
  let url = `${API_URL}/products?_page=${page}&_limit=${limit}`;

  // the filters
  if (filters?.category && filters.category !== "All") {
    url += `&category=${filters.category}`;
  }
  if (filters?.search) {
    url += `&title_like=${filters.search}`;
  }
  if (filters?.minPrice || filters?.maxPrice) {
    url += `&price_gte=${filters.minPrice || 0}&price_lte=${
      filters.maxPrice || 9999
    }`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const total = Number(response.headers.get("X-Total-Count") || "0");
  const products = await response.json();

  return {
    products,
    totalPages: Math.ceil(total / limit),
  };
}

export async function fetchProductById(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

export async function searchProducts(query: string) {
  const response = await fetch(`${API_URL}/products?q=${query}`);
  if (!response.ok) throw new Error("Failed to search products");
  return response.json();
}

export async function fetchCartProducts(productIds: string[]): Promise<Product[]> {
  if (productIds.length === 0) return [];
  
  const response = await fetch(`${API_URL}/products?id=${productIds.join('&id=')}`);
  if (!response.ok) throw new Error("Failed to fetch cart products");
  return response.json();
}
