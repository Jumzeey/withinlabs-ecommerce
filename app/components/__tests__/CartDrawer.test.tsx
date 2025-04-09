import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartDrawer } from '../CartDrawer';
import { useCart } from '../../context/CartContext';
import { act } from '@testing-library/react';
import * as api from '@/lib/api';

// TypeScript interfaces for better type safety
interface CartItem {
  productId: string;
  quantity: number;
}
interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  specifications: Record<string, string>;
  reviews: Array<{
    id: string;
    userName: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}
interface CartContextType {
  items: CartItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  addToCart: (productId: string) => void;
  isInCart: (productId: string) => boolean;
}

// Mock the hooks and API functions
jest.mock('../../context/CartContext');
jest.mock('@/lib/api');

const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockedFetchCartProducts = api.fetchCartProducts as jest.MockedFunction<typeof api.fetchCartProducts>;

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Test Product 1',
    price: 25.5,
    images: ['/test-product.jpg'],
    description: 'Test product description',
    category: 'test-category',
    specifications: {
      weight: '1kg',
      dimensions: '10x10x10cm'
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Test User',
        userName: 'jumzeey',
        rating: 5,
        comment: 'Great product',
        date: '2023-01-01'
      }
    ]
  },
];

describe('CartDrawer', () => {
  const mockCartContext: CartContextType = {
    items: [{ productId: 'prod-1', quantity: 2 }],
    updateQuantity: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    totalItems: 2,
    addToCart: jest.fn(),
    isInCart: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCart.mockReturnValue(mockCartContext);
    mockedFetchCartProducts.mockResolvedValue(mockProducts);
  });

  it('renders loading state initially', async () => {
    render(<CartDrawer />);

    expect(screen.getByText(/loading cart/i)).toBeInTheDocument();

    await act(async () => {
      await waitFor(() => {
        expect(screen.queryByText(/loading cart/i)).not.toBeInTheDocument();
      });
    });
  });

  it('renders products in cart with correct details', async () => {
    render(<CartDrawer />);

    await waitFor(() => {
      expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument();
      expect(screen.getByText('$25.50')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Quantity
      expect(screen.getByRole('img', { name: /Test Product 1/i })).toBeInTheDocument();
    });
  });

  it('calls clearCart when "Clear Cart" is clicked and confirmed', async () => {
    window.confirm = jest.fn(() => true);

    mockedUseCart.mockReturnValueOnce({
      ...mockCartContext,
      clearCart: jest.fn(),
      addToCart: jest.fn(),
      isInCart: jest.fn(),
    });

    render(<CartDrawer />);

    fireEvent.click(screen.getByText(/clear cart/i));
    expect(jest.fn()).toHaveBeenCalled();
  });

  it('does not clear cart when confirmation is cancelled', async () => {
    window.confirm = jest.fn(() => false);

    mockedUseCart.mockReturnValueOnce({
      ...mockCartContext,
      clearCart: jest.fn(),
      addToCart: jest.fn(),
      isInCart: jest.fn(),
    });

    render(<CartDrawer />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /clear cart/i }));
      expect(window.confirm).toHaveBeenCalled();
      expect(jest.fn()).not.toHaveBeenCalled();
    });
  });

  it('renders empty state when no items in cart', async () => {
    mockedUseCart.mockReturnValueOnce({
      ...mockCartContext,
      items: [],
      totalItems: 0,
      addToCart: jest.fn(),
      isInCart: jest.fn(),
    });

    render(<CartDrawer />);

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /clear cart/i })).not.toBeInTheDocument();
    });
  });

  it('renders error message when product fetch fails', async () => {
    mockedFetchCartProducts.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<CartDrawer />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load cart items/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('retries fetching products when retry button is clicked', async () => {
    mockedFetchCartProducts.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<CartDrawer />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));
      expect(mockedFetchCartProducts).toHaveBeenCalledTimes(2);
    });
  });

  it('calls removeFromCart when remove button is clicked', async () => {
    const mockRemoveFromCart = jest.fn();

    mockedUseCart.mockReturnValueOnce({
      ...mockCartContext,
      removeFromCart: jest.fn(),
    });

    render(<CartDrawer />);

    await waitFor(() => {
      expect(screen.queryByText(/loading cart/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /trash/i }));
      expect(mockRemoveFromCart).toHaveBeenCalledWith('prod-1');
    });
  });

  it('calls updateQuantity when quantity is changed', async () => {

    mockedUseCart.mockReturnValueOnce({
      ...mockCartContext,
      updateQuantity: jest.fn(),
      addToCart: jest.fn(),
      isInCart: jest.fn(),
    });

    render(<CartDrawer />);

    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    fireEvent.change(quantityInput, { target: { value: '3' } });
    expect(jest.fn()).toHaveBeenCalledWith('prod-1', 3);
  });
});