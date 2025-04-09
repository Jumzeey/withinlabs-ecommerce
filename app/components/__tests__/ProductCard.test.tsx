import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { useCart } from '../../context/CartContext';

// Mock the required modules
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock('lucide-react', () => ({
  ShoppingCart: () => <svg data-testid="shopping-cart-icon" />,
}));

jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      {...props}
      data-fill={fill?.toString()}
    />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock product data
const mockProduct = {
  id: 'prod-1',
  title: 'Test Product',
  price: 29.99,
  images: ['/test-image.jpg'],
  description: 'Test description',
  category: 'electronics',
  specifications: { weight: '1kg' },
  reviews: [],
};

describe('ProductCard', () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart,
    });
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(
      screen.getByText(`$${mockProduct.price.toFixed(2)}`)
    ).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      mockProduct.images[0]
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'alt',
      mockProduct.title
    );
  });

  it('contains a link to the product detail page', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/products/${mockProduct.id}`);
    // Verify the link contains the product image and title
    expect(link).toContainElement(screen.getByRole('img'));
    expect(link).toContainElement(screen.getByText(mockProduct.title));
  });

  it('renders the add to cart button with icon', () => {
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeInTheDocument();
    expect(button).toContainElement(screen.getByTestId('shopping-cart-icon'));
  });

  it('calls addToCart when the button is clicked', () => {
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('applies hover effect classes', () => {
    render(<ProductCard product={mockProduct} />);
    const card = screen.getByRole('link').closest('div');
    expect(card).toHaveClass('group');
    expect(screen.getByRole('img')).toHaveClass('group-hover:scale-110');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ProductCard product={mockProduct} />);
    expect(asFragment()).toMatchSnapshot();
  });
});