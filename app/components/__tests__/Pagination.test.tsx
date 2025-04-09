import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';
import * as NextNavigation from 'next/navigation'; // Import Next.js navigation module

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Pagination', () => {
  const mockRouterPush = jest.fn();
  const mockRouter = {
    push: mockRouterPush,
  };

  beforeEach(() => {
    (NextNavigation.useRouter as jest.Mock).mockReturnValue(mockRouter);
    (NextNavigation.useSearchParams as jest.Mock).mockReturnValue({
      toString: () => '',
      get: () => null,
    });
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Pagination currentPage={1} totalPages={5} />);
    // Change this to match actual text in your component
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders pagination buttons correctly', () => {
    // Mocking `useSearchParams`
    (NextNavigation.useSearchParams as jest.Mock).mockReturnValue({
      toString: () => '?page=1',
      get: (key: string) => (key === 'page' ? '1' : null),
    });

    render(<Pagination currentPage={1} totalPages={5} />);

    // Check if the "Previous" button is not visible (since we're on page 1)
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();

    // Check that page numbers are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    // Check if "Next" button is present
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('highlights the current page number', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    // Check that the current page is highlighted
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-blue-500 text-white');
  });

  it('does not render pagination when there is only one page', () => {
    render(<Pagination currentPage={1} totalPages={1} />);

    // Ensure no pagination is rendered
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('navigates to the previous page when the "Previous" button is clicked', () => {
    // Mock the return value of `useSearchParams` with page 2
    (NextNavigation.useSearchParams as jest.Mock).mockReturnValue({
      toString: () => '?page=2',
      get: (key: string) => (key === 'page' ? '2' : null),
    });

    render(<Pagination currentPage={2} totalPages={5} />);

    // Find and click the "Previous" button
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);

    // Assert that router.push was called with the correct URL
    expect(mockRouterPush).toHaveBeenCalledWith('?page=1');
  });

  it('navigates to the next page when the "Next" button is clicked', () => {
    // Mock the return value of `useSearchParams` with page 3
    (NextNavigation.useSearchParams as jest.Mock).mockReturnValue({
      toString: () => '?page=3',
      get: (key: string) => (key === 'page' ? '3' : null),
    });

    render(<Pagination currentPage={3} totalPages={5} />);

    // Find and click the "Next" button
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Assert that router.push was called with the correct URL
    expect(mockRouterPush).toHaveBeenCalledWith('?page=4');
  });
});