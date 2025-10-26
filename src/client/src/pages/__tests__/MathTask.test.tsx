import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MathTask from '../MathTask';
import { createUserProgress, createStylingItem } from '@/test/fixtures';
import { mathEngine } from '@/lib/mathEngine';
import { rewardManager } from '@/lib/rewardManager';
import { db } from '@/lib/db';

// Mock dependencies
const mockSetLocation = vi.fn();
const mockGetDifficultyForTopic = vi.fn(() => 1);
const mockSetDifficultyForTopic = vi.fn().mockResolvedValue(undefined);
const mockUpdateUserProgress = vi.fn().mockResolvedValue(undefined);
const mockRefreshStylingItems = vi.fn().mockResolvedValue(undefined);
const mockRefreshUserProgress = vi.fn().mockResolvedValue(undefined);

vi.mock('wouter', () => ({
  useLocation: () => ['/math', mockSetLocation],
}));

vi.mock('@/contexts/AppContext', () => ({
  useApp: () => ({
    userProgress: createUserProgress(),
    getDifficultyForTopic: mockGetDifficultyForTopic,
    setDifficultyForTopic: mockSetDifficultyForTopic,
    updateUserProgress: mockUpdateUserProgress,
    refreshStylingItems: mockRefreshStylingItems,
    refreshUserProgress: mockRefreshUserProgress,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MathTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location.search
    delete (window as any).location;
    (window as any).location = { search: '?topic=addition' };

    // Mock mathEngine
    vi.spyOn(mathEngine, 'generateProblem').mockReturnValue({
      question: '5 + 3 = ?',
      correctAnswer: '8',
      type: 'calculation',
      topic: 'addition',
      difficulty: 1,
    });
    vi.spyOn(mathEngine, 'checkAnswer').mockReturnValue(true);
    vi.spyOn(mathEngine, 'adjustDifficulty').mockReturnValue(1);

    // Mock rewardManager
    vi.spyOn(rewardManager, 'checkAndUnlockRewards').mockResolvedValue(null);
    vi.spyOn(rewardManager, 'getProgressToNextUnlock').mockReturnValue(1);
    vi.spyOn(rewardManager, 'getUnlockThreshold').mockReturnValue(5);

    // Mock db
    vi.spyOn(db, 'getUserProgress').mockResolvedValue(createUserProgress());
  });

  it('should render loading state initially', () => {
    vi.spyOn(mathEngine, 'generateProblem').mockReturnValue(null as any);
    const { getByText } = render(<MathTask />);
    expect(getByText('Lädt...')).toBeInTheDocument();
  });

  it('should render math problem after loading', async () => {
    const { findByText } = render(<MathTask />);

    const question = await findByText('5 + 3 = ?');
    expect(question).toBeInTheDocument();
  });

  it('should render back button and navigate on click', async () => {
    const { findByText } = render(<MathTask />);

    const backButton = await findByText('← Zurück zur Themenauswahl');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(mockSetLocation).toHaveBeenCalledWith('/topics');
  });

  it('should render progress indicator', async () => {
    const { findByText } = render(<MathTask />);

    const progressText = await findByText(/Fortschritt zum nächsten Item:/);
    expect(progressText).toBeInTheDocument();
    expect(await findByText('1 / 5')).toBeInTheDocument();
  });

  it('should render stats display', async () => {
    const { findByText } = render(<MathTask />);

    expect(await findByText('Richtig')).toBeInTheDocument();
    expect(await findByText('Serie')).toBeInTheDocument();
  });

  it('should handle correct answer submission', async () => {
    const { findByPlaceholderText, findByText } = render(<MathTask />);

    const input = await findByPlaceholderText('Deine Antwort...');
    const submitButton = await findByText('Antwort prüfen ✓');

    fireEvent.change(input, { target: { value: '8' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUserProgress).toHaveBeenCalled();
    });
  });

  it('should handle incorrect answer submission', async () => {
    vi.spyOn(mathEngine, 'checkAnswer').mockReturnValue(false);

    const { findByPlaceholderText, findByText } = render(<MathTask />);

    const input = await findByPlaceholderText('Deine Antwort...');
    const submitButton = await findByText('Antwort prüfen ✓');

    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUserProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          correctAnswersStreak: 0,
        })
      );
    });
  });

  it('should display multiple-choice options for geometry problems', async () => {
    vi.spyOn(mathEngine, 'generateProblem').mockReturnValue({
      question: 'Wie viele Ecken hat ein Quadrat?',
      correctAnswer: '4',
      type: 'multipleChoice',
      topic: 'geometry',
      difficulty: 1,
      options: ['2', '3', '4', '5'],
    });

    const { findByText } = render(<MathTask />);

    expect(await findByText('2')).toBeInTheDocument();
    expect(await findByText('3')).toBeInTheDocument();
    expect(await findByText('4')).toBeInTheDocument();
    expect(await findByText('5')).toBeInTheDocument();
  });

  it('should handle reward unlocking', async () => {
    const mockReward = createStylingItem({ id: 'reward-1', name: 'Test Reward' });
    vi.spyOn(rewardManager, 'checkAndUnlockRewards').mockResolvedValue(mockReward);

    const { findByPlaceholderText, findByText } = render(<MathTask />);

    const input = await findByPlaceholderText('Deine Antwort...');
    const submitButton = await findByText('Antwort prüfen ✓');

    fireEvent.change(input, { target: { value: '8' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRefreshStylingItems).toHaveBeenCalled();
    });
  });

  it('should extract topic from URL params', async () => {
    (window as any).location = { search: '?topic=subtraction' };

    render(<MathTask />);

    await waitFor(() => {
      expect(mathEngine.generateProblem).toHaveBeenCalledWith('subtraction', 1);
    });
  });

  it('should disable submit button while submitting', async () => {
    const { findByPlaceholderText, findByText } = render(<MathTask />);

    const input = await findByPlaceholderText('Deine Antwort...');
    const submitButton = await findByText('Antwort prüfen ✓');

    fireEvent.change(input, { target: { value: '8' } });

    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    // Button should be disabled during submission
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should generate new problem after correct answer', async () => {
    vi.useFakeTimers();

    const { findByPlaceholderText, findByText } = render(<MathTask />);

    const input = await findByPlaceholderText('Deine Antwort...');
    const submitButton = await findByText('Antwort prüfen ✓');

    const initialCallCount = mathEngine.generateProblem.mock.calls.length;

    fireEvent.change(input, { target: { value: '8' } });
    fireEvent.click(submitButton);

    // Fast-forward time for the setTimeout
    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mathEngine.generateProblem.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    vi.useRealTimers();
  });

  it('should navigate to Styling page when reward modal is closed', async () => {
    const mockReward = createStylingItem({ id: 'reward-1', name: 'Test Reward' });
    vi.spyOn(rewardManager, 'checkAndUnlockRewards').mockResolvedValue(mockReward);

    const { findByPlaceholderText, findByText } = render(<MathTask />);

    const input = await findByPlaceholderText('Deine Antwort...');
    const submitButton = await findByText('Antwort prüfen ✓');

    // Submit correct answer to unlock reward
    fireEvent.change(input, { target: { value: '8' } });
    fireEvent.click(submitButton);

    // Wait for reward notification to appear
    await waitFor(() => {
      expect(screen.getByText('🎉 Glückwunsch! 🎉')).toBeInTheDocument();
    });

    // Close the reward notification
    const closeButton = screen.getByText('Super! 🎨');
    fireEvent.click(closeButton);

    // Verify navigation to Styling page
    await waitFor(() => {
      expect(mockSetLocation).toHaveBeenCalledWith('/');
    });
  });
});
