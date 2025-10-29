import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  it('should render subtitle prompting to choose topic', () => {
    render(<DojoTopicSelection />);

    expect(screen.getByText('Wähle ein Thema:')).toBeInTheDocument();
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

  it('should show subtopics when a main topic is clicked', () => {
    render(<DojoTopicSelection />);

    const multiplicationCard = screen.getByText('Multiplikation').closest('[role="button"]');
    expect(multiplicationCard).toBeInTheDocument();

    if (multiplicationCard) {
      fireEvent.click(multiplicationCard);

      // Should show subtopic selection header
      expect(screen.getByText('Wähle einen Bereich:')).toBeInTheDocument();
      expect(screen.getByText('✖️ Multiplikation')).toBeInTheDocument();

      // Should show multiplication subtopics
      expect(screen.getByText('Einmaleins 1-5')).toBeInTheDocument();
      expect(screen.getByText('Einmaleins 6-10')).toBeInTheDocument();
      expect(screen.getByText('Gemischte Aufgaben')).toBeInTheDocument();

      // Should NOT show other main topics anymore
      expect(screen.queryByText('Addition')).not.toBeInTheDocument();
      expect(screen.queryByText('Subtraktion')).not.toBeInTheDocument();
    }
  });

  it('should navigate back to main topics when back button is clicked from subtopics', () => {
    render(<DojoTopicSelection />);

    // Click on a main topic to show subtopics
    const additionCard = screen.getByText('Addition').closest('[role="button"]');
    if (additionCard) {
      fireEvent.click(additionCard);

      // Verify we're in subtopic view
      expect(screen.getByText('➕ Addition')).toBeInTheDocument();
      expect(screen.getByText('Bis 100')).toBeInTheDocument();

      // Click back button
      const backButton = screen.getByText('← Zurück');
      fireEvent.click(backButton);

      // Should be back to main topics
      expect(screen.getByText('🥋 Trainings-Dojo')).toBeInTheDocument();
      expect(screen.getByText('Wähle ein Thema:')).toBeInTheDocument();
      expect(screen.getByText('Addition')).toBeInTheDocument();
      expect(screen.getByText('Multiplikation')).toBeInTheDocument();

      // Should NOT show subtopics anymore
      expect(screen.queryByText('Bis 100')).not.toBeInTheDocument();
    }
  });

  it('should navigate to practice page with subtopic when subtopic is clicked', () => {
    render(<DojoTopicSelection />);

    // Click on multiplication to show subtopics
    const multiplicationCard = screen.getByText('Multiplikation').closest('[role="button"]');
    if (multiplicationCard) {
      fireEvent.click(multiplicationCard);

      // Click on a subtopic
      const subtopicCard = screen.getByText('Einmaleins 1-5').closest('[role="button"]');
      expect(subtopicCard).toBeInTheDocument();

      if (subtopicCard) {
        fireEvent.click(subtopicCard);
        expect(mockSetLocation).toHaveBeenCalledWith(
          '/dojo/practice?subtopic=multiplication_times_1_5'
        );
      }
    }
  });

  it('should handle keyboard navigation on subtopic cards', () => {
    render(<DojoTopicSelection />);

    // Click on division to show subtopics
    const divisionCard = screen.getByText('Division').closest('[role="button"]');
    if (divisionCard) {
      fireEvent.click(divisionCard);

      // Use keyboard on subtopic
      const subtopicCard = screen.getByText('Geteilt durch 2-5').closest('[role="button"]');
      expect(subtopicCard).toBeInTheDocument();

      if (subtopicCard) {
        fireEvent.keyDown(subtopicCard, { key: 'Enter' });
        expect(mockSetLocation).toHaveBeenCalledWith('/dojo/practice?subtopic=division_by_2_5');
      }
    }
  });

  it('should show all subtopics for addition topic', () => {
    render(<DojoTopicSelection />);

    const additionCard = screen.getByText('Addition').closest('[role="button"]');
    if (additionCard) {
      fireEvent.click(additionCard);

      expect(screen.getByText('Bis 100')).toBeInTheDocument();
      expect(screen.getByText('Bis 1000')).toBeInTheDocument();
      expect(screen.getByText('Mit Übertrag')).toBeInTheDocument();
    }
  });

  it('should show all subtopics for geometry topic', () => {
    render(<DojoTopicSelection />);

    const geometryCard = screen.getByText('Geometrie').closest('[role="button"]');
    if (geometryCard) {
      fireEvent.click(geometryCard);

      expect(screen.getByText('Formen erkennen')).toBeInTheDocument();
      expect(screen.getByText('Ecken und Kanten zählen')).toBeInTheDocument();
    }
  });
});
