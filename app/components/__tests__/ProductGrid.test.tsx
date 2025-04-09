import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from '../ProductGrid';

// Mock the ProductCard and motion components
jest.mock('../ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid="product-card">{product.title}</div>
  ),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition }: any) => (
      <div
        data-testid="product-grid"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
      >
        {children}
      </div>
    ),
  },
}));

// Sample product data
const mockProducts = [
  {
    id: '1',
    title: 'Product 1',
    price: 19.99,
    images: ['/product1.jpg'],
    description: 'Description 1',
    category: 'category1',
    specifications: {},
    reviews: [],
  },
  {
    id: '2',
    title: 'Product 2',
    price: 29.99,
    images: ['/product2.jpg'],
    description: 'Description 2',
    category: 'category2',
    specifications: {},
    reviews: [],
  },
  {
    id: '3',
    title: 'Product 3',
    price: 39.99,
    images: ['/product3.jpg'],
    description: 'Description 3',
    category: 'category3',
    specifications: {},
    reviews: [],
  },
];

describe('ProductGrid', () => {
  it('renders without crashing', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
  });

  it('renders the correct grid layout classes', () => {
    render(<ProductGrid products={[]} />);
    const grid = screen.getByTestId('product-grid');
    expect(grid).toHaveClass(/grid/);
    expect(grid).toHaveClass(/grid-cols-/);
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
    expect(grid).toHaveClass('xl:grid-cols-4');
    expect(grid).toHaveClass('gap-6');
  });

  it('renders no products when empty array is passed', () => {
    render(<ProductGrid products={[]} />);
    const cards = screen.queryAllByTestId('product-card');
    expect(cards).toHaveLength(0);
  });

  it('renders the correct number of ProductCard components', () => {
    render(<ProductGrid products={mockProducts} />);
    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(mockProducts.length);
  });

  it('passes the correct product data to each ProductCard', () => {
    render(<ProductGrid products={mockProducts} />);
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.title)).toBeInTheDocument();
    });
  });

  it('applies the correct animation props', () => {
    render(<ProductGrid products={mockProducts} />);
    const grid = screen.getByTestId('product-grid');
    expect(grid).toHaveAttribute('initial', '{"opacity":0}');
    expect(grid).toHaveAttribute('animate', '{"opacity":1}');
    expect(grid).toHaveAttribute('transition', '{"duration":0.5}');
    expect(grid).toHaveAttribute('data-initial-opacity', '0');
  });

  it('matches snapshot with empty products', () => {
    const { asFragment } = render(<ProductGrid products={[]} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with products', () => {
    const { asFragment } = render(<ProductGrid products={mockProducts} />);
    expect(asFragment()).toMatchSnapshot();
  });
});