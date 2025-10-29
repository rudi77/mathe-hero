import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DojoTopicSelection from '../DojoTopicSelection';

// Mock wouter
const mockSetLocation = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/dojo', mockSetLocation],
}));

describe('DojoTopicSelection', () => {
  beforeEach(() => {
    mockSetLocation.mockClear();
  });

  it('should render page title with dojo emoji', () => {
    render(<DojoTopicSelection />);

    expect(screen.getByText(/Trainings-Dojo/)).toBeInTheDocument();
  });

  it('should render subtitle about pressure-free practice', () => {
    render(<DojoTopicSelection />);

    expect(screen.getByText('Übe Mathe ohne Belohnungsdruck')).toBeInTheDocument();
  });

  it('should render all 6 math topics', () => {
    render(<DojoTopicSelection />);

    expect(screen.getByText('Addition')).toBeInTheDocument();
    expect(screen.getByText('Subtraktion')).toBeInTheDocument();
    expect(screen.getByText('Multiplikation')).toBeInTheDocument();
    expect(screen.getByText('Division')).toBeInTheDocument();
    expect(screen.getByText('Geometrie')).toBeInTheDocument();
    expect(screen.getByText('Größen')).toBeInTheDocument();
  });

  it('should not render mixed tasks option', () => {
    render(<DojoTopicSelection />);

    expect(screen.queryByText('Gemischte Aufgaben')).not.toBeInTheDocument();
  });

  it('should render back button', () => {
    render(<DojoTopicSelection />);

    expect(screen.getByText('← Zurück')).toBeInTheDocument();
  });

  it('should navigate to home when back button is clicked', () => {
    render(<DojoTopicSelection />);

    const backButton = screen.getByText('← Zurück');
    fireEvent.click(backButton);

    expect(mockSetLocation).toHaveBeenCalledWith('/');
  });

  it('should navigate to practice page with topic when card is clicked', () => {
    render(<DojoTopicSelection />);

    const additionCard = screen.getByText('Addition').closest('[role="button"]');
    expect(additionCard).toBeInTheDocument();

    if (additionCard) {
      fireEvent.click(additionCard);
      expect(mockSetLocation).toHaveBeenCalledWith('/dojo/practice?topic=addition');
    }
  });

  it('should handle keyboard navigation on topic cards', () => {
    render(<DojoTopicSelection />);

    const subtractionCard = screen.getByText('Subtraktion').closest('[role="button"]');
    expect(subtractionCard).toBeInTheDocument();

    if (subtractionCard) {
      fireEvent.keyDown(subtractionCard, { key: 'Enter' });
      expect(mockSetLocation).toHaveBeenCalledWith('/dojo/practice?topic=subtraction');
    }
  });
});
