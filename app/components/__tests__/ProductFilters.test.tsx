import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductFilters } from '../ProductFilters';
import { useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ProductFilters', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  const initialValues = {
    category: 'Electronics',
    search: 'test',
    minPrice: '10',
    maxPrice: '100',
  };

  it('renders all form elements with initial values', () => {
    render(<ProductFilters initialValues={initialValues} />);

    expect(screen.getByPlaceholderText('Search products...')).toHaveValue('test');
    expect(screen.getByRole('combobox')).toHaveValue('Electronics');
    expect(screen.getByPlaceholderText('Min')).toHaveValue(10);
    expect(screen.getByPlaceholderText('Max')).toHaveValue(100);
    expect(screen.getByRole('button', { name: 'Apply Filters' })).toBeInTheDocument();
  });

  it('updates form fields when initialValues change', () => {
    const { rerender } = render(<ProductFilters initialValues={initialValues} />);

    const newValues = {
      category: 'Books',
      search: 'new search',
      minPrice: '20',
      maxPrice: '200',
    };

    rerender(<ProductFilters initialValues={newValues} />);

    expect(screen.getByPlaceholderText('Search products...')).toHaveValue('new search');
    expect(screen.getByRole('combobox')).toHaveValue('Books');
    expect(screen.getByPlaceholderText('Min')).toHaveValue(20);
    expect(screen.getByPlaceholderText('Max')).toHaveValue(200);
  });

  it('submits form with all filters', () => {
    render(<ProductFilters initialValues={initialValues} />);

    const form = screen.getByRole('form', { name: /product filters/i });
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith('/?search=test&category=Electronics&minPrice=10&maxPrice=100');
  });

  it('submits form with partial filters', () => {
    render(<ProductFilters initialValues={{}} />);

    fireEvent.change(screen.getByPlaceholderText('Search products...'), {
      target: { value: 'laptop' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Electronics' },
    });

    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith('/?search=laptop&category=Electronics');
  });

  it('does not include "All" category in URL', async () => {
    render(<ProductFilters initialValues={{ category: 'All' }} />);

    const form = screen.getByRole('form', { name: /product filters/i });
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith('/?');
  });

  it('does not include empty filters in URL', () => {
    render(<ProductFilters initialValues={{}} />);

    fireEvent.change(screen.getByPlaceholderText('Min'), {
      target: { value: '50' },
    });

    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith('/?minPrice=50');
  });

  it('does not include "All" category in URL', () => {
    render(<ProductFilters initialValues={{ category: 'All' }} />);

    fireEvent.submit(screen.getByRole('form'));

    expect(mockPush).toHaveBeenCalledWith('/?');
  });

  it('handles price range inputs correctly', () => {
    render(<ProductFilters initialValues={{}} />);

    fireEvent.change(screen.getByPlaceholderText('Min'), {
      target: { value: '20' },
    });
    fireEvent.change(screen.getByPlaceholderText('Max'), {
      target: { value: '200' },
    });

    expect(screen.getByPlaceholderText('Min')).toHaveValue(20);
    expect(screen.getByPlaceholderText('Max')).toHaveValue(200);
  });

  it('matches snapshot with initial values', () => {
    const { asFragment } = render(<ProductFilters initialValues={initialValues} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty initial values', () => {
    const { asFragment } = render(<ProductFilters initialValues={{}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});