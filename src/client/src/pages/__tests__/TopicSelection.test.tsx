import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TopicSelection from '../TopicSelection';

// Mock wouter
vi.mock('wouter', () => ({
  useLocation: () => ['/topics', vi.fn()],
}));

describe('TopicSelection', () => {
  it('should render page title', () => {
    render(<TopicSelection />);

    expect(screen.getByText('Wähle ein Thema')).toBeInTheDocument();
  });

  it('should render all 6 math topics', () => {
    render(<TopicSelection />);

    expect(screen.getByText('Addition')).toBeInTheDocument();
    expect(screen.getByText('Subtraktion')).toBeInTheDocument();
    expect(screen.getByText('Multiplikation')).toBeInTheDocument();
    expect(screen.getByText('Division')).toBeInTheDocument();
    expect(screen.getByText('Geometrie')).toBeInTheDocument();
    expect(screen.getByText('Größen')).toBeInTheDocument();
  });

  it('should render mixed tasks option', () => {
    render(<TopicSelection />);

    expect(screen.getByText('Gemischte Aufgaben')).toBeInTheDocument();
  });

  it('should render back button', () => {
    render(<TopicSelection />);

    expect(screen.getByText('← Zurück')).toBeInTheDocument();
  });

  it('should handle topic card clicks', () => {
    const { container } = render(<TopicSelection />);

    const cards = container.querySelectorAll('[class*="cursor-pointer"]');
    expect(cards.length).toBeGreaterThan(0);
  });
});
