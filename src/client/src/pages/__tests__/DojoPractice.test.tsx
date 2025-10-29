import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DojoPractice from '../DojoPractice';
import { MathEngine } from '@/lib/mathEngine';
import * as dojoSubtopics from '@/types/dojoSubtopics';

// Mock wouter
const mockSetLocation = vi.fn();
let mockLocation = '/dojo/practice?subtopic=multiplication_times_1_5';

vi.mock('wouter', () => ({
  useLocation: () => [mockLocation, mockSetLocation],
}));

// Spy on dojoSubtopics module
vi.mock('@/types/dojoSubtopics', async () => {
  const actual = await vi.importActual<typeof dojoSubtopics>('@/types/dojoSubtopics');
  return {
    ...actual,
    getSubtopicById: vi.fn(actual.getSubtopicById),
  };
});

// Mock MathEngine - needs to be defined outside to be accessible
let mockMathEngineInstance: any;

vi.mock('@/lib/mathEngine', () => {
  return {
    MathEngine: vi.fn().mockImplementation(function(this: any) {
      return mockMathEngineInstance;
    }),
  };
});

describe('DojoPractice', () => {
  const mockSubtopic = {
    id: 'multiplication_times_1_5',
    topicId: 'multiplication' as const,
    name: 'Einmaleins 1-5',
    description: '1×1 bis 5×10',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 5,
      constraints: { maxMultiplier: 5 },
    },
  };

  const mockProblem = {
    id: 'test-1',
    topic: 'multiplication' as const,
    question: '3 × 4 = ?',
    correctAnswer: 12,
    difficulty: 3,
    type: 'calculation' as const,
  };

  const mockMultipleChoiceProblem = {
    id: 'test-2',
    topic: 'geometry' as const,
    question: 'Wie viele Ecken hat ein Dreieck?',
    correctAnswer: 3,
    options: [2, 3, 4],
    difficulty: 2,
    type: 'multipleChoice' as const,
  };

  beforeEach(() => {
    mockSetLocation.mockClear();
    mockLocation = '/dojo/practice?subtopic=multiplication_times_1_5';

    // Reset MathEngine mock instance
    mockMathEngineInstance = {
      generateProblem: vi.fn().mockReturnValue(mockProblem),
      checkAnswer: vi.fn(),
      adjustDifficulty: vi.fn(),
    };

    // Mock getSubtopicById to return mockSubtopic
    vi.mocked(dojoSubtopics.getSubtopicById).mockReturnValue(mockSubtopic);
  });

  describe('Problem Generation', () => {
    it('generates problem based on subtopic parameters', () => {
      render(<DojoPractice />);

      expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledWith(
        'multiplication',
        expect.any(Number)
      );
      expect(screen.getByText('3 × 4 = ?')).toBeInTheDocument();
    });

    it('uses difficulty within subtopic range', () => {
      render(<DojoPractice />);

      const calledDifficulty = mockMathEngineInstance.generateProblem.mock.calls[0][1];
      expect(calledDifficulty).toBeGreaterThanOrEqual(1);
      expect(calledDifficulty).toBeLessThanOrEqual(5);
    });

    it('handles missing subtopic gracefully', () => {
      vi.mocked(dojoSubtopics.getSubtopicById).mockReturnValue(undefined);

      render(<DojoPractice />);

      expect(screen.getByText('Lädt...')).toBeInTheDocument();
    });

    it('displays subtopic name and description', () => {
      render(<DojoPractice />);

      expect(screen.getByText(/Einmaleins 1-5/)).toBeInTheDocument();
      expect(screen.getByText(/1×1 bis 5×10/)).toBeInTheDocument();
    });
  });

  describe('Answer Checking', () => {
    it('shows correct feedback for correct answer', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Richtig!/i)).toBeInTheDocument();
      });

      expect(mockMathEngineInstance.checkAnswer).toHaveBeenCalledWith(mockProblem, '12');
    });

    it('shows incorrect feedback for wrong answer', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(false);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Die richtige Antwort ist 12/i)).toBeInTheDocument();
      });
    });

    it('handles multiple choice problems', async () => {
      mockMathEngineInstance.generateProblem.mockReturnValue(mockMultipleChoiceProblem);
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      expect(screen.getByText('Wie viele Ecken hat ein Dreieck?')).toBeInTheDocument();

      const option3Button = screen.getByRole('button', { name: '3' });
      fireEvent.click(option3Button);

      await waitFor(() => {
        expect(mockMathEngineInstance.checkAnswer).toHaveBeenCalledWith(mockMultipleChoiceProblem, '3');
        expect(screen.getByText(/Richtig!/i)).toBeInTheDocument();
      });
    });

    it('supports Enter key for submission', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(mockMathEngineInstance.checkAnswer).toHaveBeenCalled();
      });
    });
  });

  describe('Streak Counter', () => {
    it('starts with streak of 0', () => {
      render(<DojoPractice />);

      const streakElement = screen.getByText('Serie').previousElementSibling;
      expect(streakElement?.textContent).toBe('0');
    });

    it('increments streak on correct answer', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const streakElement = screen.getByText('Serie').previousElementSibling;
        expect(streakElement?.textContent).toBe('1');
      });
    });

    it('resets streak on incorrect answer', async () => {
      mockMathEngineInstance.checkAnswer
        .mockReturnValueOnce(true) // First answer correct
        .mockReturnValueOnce(false); // Second answer incorrect

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      // First correct answer
      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const streakElement = screen.getByText('Serie').previousElementSibling;
        expect(streakElement?.textContent).toBe('1');
      });

      // Wait for new problem to generate
      await waitFor(() => {
        expect(input).toHaveValue(null);
      }, { timeout: 3000 });

      // Second incorrect answer
      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const streakElement = screen.getByText('Serie').previousElementSibling;
        expect(streakElement?.textContent).toBe('0');
      });
    });

    it('resets streak on skip', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      // Get a correct answer first to increment streak
      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const streakElement = screen.getByText('Serie').previousElementSibling;
        expect(streakElement?.textContent).toBe('1');
      });

      // Wait for the problem to auto-generate (2000ms delay)
      await waitFor(() => {
        expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledTimes(2);
      }, { timeout: 3000 });

      // Now click skip button
      const skipButton = screen.getByText('Nächste Aufgabe →');
      fireEvent.click(skipButton);

      // Streak should reset to 0
      await waitFor(() => {
        const streakElement = screen.getByText('Serie').previousElementSibling;
        expect(streakElement?.textContent).toBe('0');
      });
    });
  });

  describe('Total Solved Counter', () => {
    it('starts with total solved of 0', () => {
      render(<DojoPractice />);

      const totalElement = screen.getByText('Gelöst').previousElementSibling;
      expect(totalElement?.textContent).toBe('0');
    });

    it('increments total solved on correct answers', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const totalElement = screen.getByText('Gelöst').previousElementSibling;
        expect(totalElement?.textContent).toBe('1');
      });
    });

    it('does not increment total solved on incorrect answers', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(false);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const totalElement = screen.getByText('Gelöst').previousElementSibling;
        expect(totalElement?.textContent).toBe('0');
      });
    });

    it('does not increment total solved on skip', async () => {
      render(<DojoPractice />);

      const skipButton = screen.getByText('Nächste Aufgabe →');
      fireEvent.click(skipButton);

      await waitFor(() => {
        const totalElement = screen.getByText('Gelöst').previousElementSibling;
        expect(totalElement?.textContent).toBe('0');
      });
    });
  });

  describe('Skip Button', () => {
    it('generates new problem on skip', async () => {
      render(<DojoPractice />);

      // Should be called once on mount
      expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledTimes(1);

      const skipButton = screen.getByText('Nächste Aufgabe →');
      fireEvent.click(skipButton);

      // Should be called again after skip
      await waitFor(() => {
        expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledTimes(2);
      });
    });

    it('clears input and feedback on skip', async () => {
      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      fireEvent.change(input, { target: { value: '12' } });

      const skipButton = screen.getByText('Nächste Aufgabe →');
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(input).toHaveValue(null);
      });
    });

    it('is disabled while processing answer', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');
      const skipButton = screen.getByText('Nächste Aufgabe →');

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(submitButton);

      // Skip button should be disabled while processing
      expect(skipButton).toBeDisabled();
    });
  });

  describe('Exit Functionality', () => {
    it('navigates to /dojo on exit button click', () => {
      render(<DojoPractice />);

      const exitButton = screen.getByText('Beenden');
      fireEvent.click(exitButton);

      expect(mockSetLocation).toHaveBeenCalledWith('/dojo');
    });

    it('navigates to /dojo on back button click', () => {
      render(<DojoPractice />);

      const backButton = screen.getByText('← Zurück zum Dojo');
      fireEvent.click(backButton);

      expect(mockSetLocation).toHaveBeenCalledWith('/dojo');
    });
  });

  describe('Auto-generate Next Problem', () => {
    it('auto-generates next problem after correct answer', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(true);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      // Initial call on mount
      expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledTimes(1);

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(submitButton);

      // Should generate new problem after delay
      await waitFor(() => {
        expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledTimes(2);
      }, { timeout: 3000 });
    });

    it('does not auto-generate after incorrect answer', async () => {
      mockMathEngineInstance.checkAnswer.mockReturnValue(false);

      render(<DojoPractice />);

      const input = screen.getByPlaceholderText('Deine Antwort...');
      const submitButton = screen.getByText('Antwort prüfen ✓');

      // Initial call on mount
      expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledTimes(1);

      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.click(submitButton);

      // Wait a bit to ensure no auto-generation happens
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Should still be 1 (only initial call)
      expect(mockMathEngineInstance.generateProblem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Info Note', () => {
    it('displays dojo mode information', () => {
      render(<DojoPractice />);

      expect(screen.getByText(/Dojo-Modus: Dein Fortschritt wird nicht gespeichert/i)).toBeInTheDocument();
    });
  });
});
