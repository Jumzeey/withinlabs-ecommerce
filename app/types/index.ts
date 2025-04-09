export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  specifications: Record<string, string>;
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface SearchParams {
  page?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}