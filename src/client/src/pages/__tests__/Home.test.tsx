import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../Home';

describe('Home', () => {
  it('should render example page', () => {
    render(<Home />);

    expect(screen.getByText('Example Page')).toBeInTheDocument();
  });

  it('should render example button', () => {
    render(<Home />);

    expect(screen.getByText('Example Button')).toBeInTheDocument();
  });
});
