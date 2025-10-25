import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from '../NotFound';

// Mock wouter
const mockSetLocation = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/', mockSetLocation],
}));

describe('NotFound', () => {
  it('should render 404 page', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<NotFound />);

    expect(
      screen.getByText(/Sorry, the page you are looking for doesn't exist/)
    ).toBeInTheDocument();
  });

  it('should render go home button', () => {
    render(<NotFound />);

    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('should navigate home when button is clicked', () => {
    render(<NotFound />);

    const homeButton = screen.getByText('Go Home');
    fireEvent.click(homeButton);

    expect(mockSetLocation).toHaveBeenCalledWith('/');
  });
});
