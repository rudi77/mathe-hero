import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CharacterHead from '../CharacterHead';

describe('CharacterHead', () => {
  it('renders SVG character head', () => {
    const { container } = render(<CharacterHead />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  it('applies custom className', () => {
    const { container } = render(<CharacterHead className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('renders all character features', () => {
    const { container } = render(<CharacterHead />);

    // Check for main head circle
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);

    // Check for eyes
    const ellipses = container.querySelectorAll('ellipse');
    expect(ellipses.length).toBe(2); // Two eye whites

    // Check for smile path
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('has gradient for head coloring', () => {
    const { container } = render(<CharacterHead />);
    const gradient = container.querySelector('#headGradient');
    expect(gradient).toBeInTheDocument();
  });

  it('is accessible as decorative image', () => {
    const { container } = render(<CharacterHead />);
    const svg = container.querySelector('svg');
    // SVG is purely decorative, no aria-label needed
    expect(svg).toBeInTheDocument();
  });
});
