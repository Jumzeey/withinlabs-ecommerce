import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCartButton } from '../AddToCartButton';

// Mock the CartContext and its hook
jest.mock('../../context/CartContext', () => ({
  useCart: () => ({
    addToCart: jest.fn(),
  }),
}));

describe('AddToCartButton', () => {
  const productId = '12345';

  it('renders button with text "Add to Cart"', () => {
    render(<AddToCartButton productId={productId} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('calls addToCart with the correct productId when clicked', () => {
    const mockAddToCart = jest.fn();

    // Override mock implementation for this test
    jest.mocked(require('../context/CartContext').useCart).mockReturnValue({
      addToCart: mockAddToCart,
    });

    render(<AddToCartButton productId={productId} />);
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith(productId);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });
});
