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

  // Subtopic tests
  it('should display subtopic name when subtopic query param is provided', () => {
    mockLocation = '/dojo/practice?subtopic=multiplication_times_1_5';
    render(<DojoPractice />);

    expect(screen.getByText(/Einmaleins 1-5/)).toBeInTheDocument();
  });

  it('should display subtopic description when available', () => {
    mockLocation = '/dojo/practice?subtopic=addition_up_to_100';
    render(<DojoPractice />);

    expect(screen.getByText(/Addition mit Zahlen bis 100/)).toBeInTheDocument();
  });

  it('should display subtopic name for geometry subtopic', () => {
    mockLocation = '/dojo/practice?subtopic=geometry_shape_recognition';
    render(<DojoPractice />);

    // The name appears in the title
    expect(screen.getByRole('heading', { name: /Formen erkennen/ })).toBeInTheDocument();
    // The description appears as paragraph
    expect(screen.getByText(/Geometrische Formen erkennen und benennen/)).toBeInTheDocument();
  });

  it('should display subtopic name for division with remainder', () => {
    mockLocation = '/dojo/practice?subtopic=division_with_remainder';
    render(<DojoPractice />);

    expect(screen.getByText(/Mit Rest/)).toBeInTheDocument();
    expect(screen.getByText(/Division mit Rest/)).toBeInTheDocument();
  });

  it('should display subtopic name for sizes time', () => {
    mockLocation = '/dojo/practice?subtopic=sizes_time';
    render(<DojoPractice />);

    expect(screen.getByText(/Zeit \(min, h\)/)).toBeInTheDocument();
    expect(screen.getByText(/Zeit ablesen und umrechnen/)).toBeInTheDocument();
  });

  it('should handle unknown subtopic gracefully', () => {
    mockLocation = '/dojo/practice?subtopic=unknown_subtopic';
    render(<DojoPractice />);

    // Should not crash, displays fallback
    expect(screen.getByText(/Unbekannt/)).toBeInTheDocument();
  });

  it('should prioritize subtopic param over topic param', () => {
    mockLocation = '/dojo/practice?topic=addition&subtopic=multiplication_times_1_5';
    render(<DojoPractice />);

    // Should display subtopic name, not topic name
    expect(screen.getByText(/Einmaleins 1-5/)).toBeInTheDocument();
    expect(screen.queryByText(/^Addition$/)).not.toBeInTheDocument();
  });
});
