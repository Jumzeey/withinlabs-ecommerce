import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider } from '@/app/context/CartContext.jsx';
import { Header } from '../Header';
import { useCart } from '@/app/context/CartContext.jsx';

// Mock the useCart hook to control cart state in tests
jest.mock('../../context/CartContext.jsx', () => ({
  ...jest.requireActual('../../context/CartContext.jsx'),
  useCart: jest.fn(),
}));

describe('Header', () => {
  const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Default mock implementation
    mockUseCart.mockReturnValue({
      items: [],
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      updateQuantity: jest.fn(),
      isInCart: jest.fn(),
      totalItems: 0,
    });
  });

  it('renders without crashing and shows store name', () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    expect(screen.getByText(/Withinlabs Store/i)).toBeInTheDocument();
  });

  it('displays the cart badge when there are items in the cart', () => {
    // Mock cart with items
    mockUseCart.mockReturnValue({
      items: [{ productId: '1', quantity: 1 }],
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      updateQuantity: jest.fn(),
      isInCart: jest.fn(),
      totalItems: 1,
    });

    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByLabelText(/cart items/i)).toBeInTheDocument();
  });

  it('does not display the badge when cart is empty', () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/cart items/i)).not.toBeInTheDocument();
  });

  it('contains a properly configured link to the homepage', () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    );

    const link = screen.getByRole('link', { name: /Withinlabs Store/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveAttribute('aria-label', 'Homepage');
  });

  it('matches snapshot when cart is empty', () => {
    const { asFragment } = render(
      <CartProvider>
        <Header />
      </CartProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when cart has items', () => {
    mockUseCart.mockReturnValue({
      items: [
        { productId: '1', quantity: 1 },
        { productId: '2',  quantity: 2 },
      ],
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      updateQuantity: jest.fn(),
      isInCart: jest.fn(),
      totalItems: 3,
    });

    const { asFragment } = render(
      <CartProvider>
        <Header />
      </CartProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});