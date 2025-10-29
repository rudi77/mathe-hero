import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DojoPractice from '../DojoPractice';

// Mock wouter
const mockSetLocation = vi.fn();
let mockLocation = '/dojo/practice?topic=addition';

vi.mock('wouter', () => ({
  useLocation: () => [mockLocation, mockSetLocation],
}));

describe('DojoPractice', () => {
  beforeEach(() => {
    mockSetLocation.mockClear();
    mockLocation = '/dojo/practice?topic=addition';
  });

  it('should render page title with dojo emoji', () => {
    render(<DojoPractice />);

    expect(screen.getByText(/Addition/)).toBeInTheDocument();
  });

  it('should display correct topic name from query param', () => {
    mockLocation = '/dojo/practice?topic=subtraction';
    render(<DojoPractice />);

    expect(screen.getByText(/Subtraktion/)).toBeInTheDocument();
  });

  it('should render back button to dojo', () => {
    render(<DojoPractice />);

    expect(screen.getByText('← Zurück zum Dojo')).toBeInTheDocument();
  });

  it('should navigate to dojo when back button is clicked', () => {
    render(<DojoPractice />);

    const backButton = screen.getByText('← Zurück zum Dojo');
    fireEvent.click(backButton);

    expect(mockSetLocation).toHaveBeenCalledWith('/dojo');
  });

  it('should render placeholder content', () => {
    render(<DojoPractice />);

    expect(screen.getByText('Übungen kommen bald!')).toBeInTheDocument();
    expect(screen.getByText(/Die Übungsfunktion wird in der nächsten Story implementiert/)).toBeInTheDocument();
  });

  it('should render return button in placeholder', () => {
    render(<DojoPractice />);

    const returnButton = screen.getByText('Zurück zur Themenauswahl');
    expect(returnButton).toBeInTheDocument();

    fireEvent.click(returnButton);
    expect(mockSetLocation).toHaveBeenCalledWith('/dojo');
  });

  it('should handle all topic types correctly', () => {
    const topics = [
      { param: 'addition', name: 'Addition' },
      { param: 'subtraction', name: 'Subtraktion' },
      { param: 'multiplication', name: 'Multiplikation' },
      { param: 'division', name: 'Division' },
      { param: 'geometry', name: 'Geometrie' },
      { param: 'sizes', name: 'Größen' },
    ];

    topics.forEach((topic) => {
      mockLocation = `/dojo/practice?topic=${topic.param}`;
      const { unmount } = render(<DojoPractice />);
      expect(screen.getByText(new RegExp(topic.name))).toBeInTheDocument();
      unmount();
    });
  });
});
