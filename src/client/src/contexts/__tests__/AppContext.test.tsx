import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '../AppContext';
import { db } from '@/lib/db';
import { createUserProgress, createStylingItems, createCharacterState } from '@/test/fixtures';
import { initialStylingItems, initialUserProgress } from '@/lib/initialData';

// Mock db
vi.mock('@/lib/db', () => ({
  db: {
    init: vi.fn(),
    getAllStylingItems: vi.fn(),
    getUserProgress: vi.fn(),
    getCharacterState: vi.fn(),
    saveStylingItems: vi.fn(),
    saveUserProgress: vi.fn(),
    saveCharacterState: vi.fn(),
    clearAllData: vi.fn(),
  },
}));

// Mock initialData
vi.mock('@/lib/initialData', () => ({
  initialStylingItems: [],
  initialUserProgress: {
    id: 1,
    difficultyLevelAddition: 1,
    difficultyLevelSubtraction: 1,
    difficultyLevelMultiplication: 1,
    difficultyLevelDivision: 1,
    difficultyLevelGeometry: 1,
    difficultyLevelSizes: 1,
    correctAnswersStreak: 0,
    totalCorrectAnswers: 0,
    totalIncorrectAnswers: 0,
    lastSessionDate: new Date().toISOString(),
  },
}));

// Test component that uses the context
function TestComponent() {
  const { isLoading, stylingItems, userProgress, characterState } = useApp();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="items-count">{stylingItems.length}</div>
      <div data-testid="user-progress">{userProgress?.id}</div>
      <div data-testid="character-state">{characterState.appliedItems.length}</div>
    </div>
  );
}

// Test component for resetGame
function ResetTestComponent() {
  const { resetGame, stylingItems, userProgress, characterState } = useApp();
  const [resetCalled, setResetCalled] = React.useState(false);

  const handleReset = async () => {
    await resetGame();
    setResetCalled(true);
  };

  return (
    <div>
      <button onClick={handleReset} data-testid="reset-button">
        Reset
      </button>
      <div data-testid="reset-called">{resetCalled ? 'yes' : 'no'}</div>
      <div data-testid="items-count">{stylingItems.length}</div>
      <div data-testid="user-progress-id">{userProgress?.id}</div>
      <div data-testid="character-items">{characterState.appliedItems.length}</div>
    </div>
  );
}

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.init).mockResolvedValue();
    vi.mocked(db.getAllStylingItems).mockResolvedValue([]);
    vi.mocked(db.getUserProgress).mockResolvedValue(undefined);
    vi.mocked(db.getCharacterState).mockResolvedValue(undefined);
    vi.mocked(db.saveStylingItems).mockResolvedValue();
    vi.mocked(db.saveUserProgress).mockResolvedValue();
    vi.mocked(db.saveCharacterState).mockResolvedValue();
    vi.mocked(db.clearAllData).mockResolvedValue();
  });

  it('should initialize database on mount', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await waitFor(() => {
      expect(db.init).toHaveBeenCalled();
    });
  });

  it('should load initial data when database is empty', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await waitFor(() => {
      expect(db.saveStylingItems).toHaveBeenCalled();
      expect(db.saveUserProgress).toHaveBeenCalled();
    });
  });

  it('should load existing data from database', async () => {
    const mockItems = createStylingItems(3);
    const mockProgress = createUserProgress();
    const mockCharState = createCharacterState();

    vi.mocked(db.getAllStylingItems).mockResolvedValue(mockItems);
    vi.mocked(db.getUserProgress).mockResolvedValue(mockProgress);
    vi.mocked(db.getCharacterState).mockResolvedValue(mockCharState);

    const { findByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const itemsCount = await findByTestId('items-count');
    expect(itemsCount.textContent).toBe('3');
  });

  it('should provide context values to children', async () => {
    const { queryByText, findByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Initially loading
    expect(queryByText('Loading...')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check context values are provided
    const itemsCount = await findByTestId('items-count');
    expect(itemsCount).toBeInTheDocument();
  });

  it('should handle initialization errors gracefully', async () => {
    vi.mocked(db.init).mockRejectedValue(new Error('DB Error'));

    const { queryByText } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('should throw error when useApp is used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useApp must be used within an AppProvider');

    spy.mockRestore();
  });

  describe('resetGame', () => {
    it('should clear all data and restore initial state', async () => {
      const mockItems = createStylingItems(5);
      const mockProgress = createUserProgress({ totalCorrectAnswers: 10 });
      const mockCharState = createCharacterState({ appliedItems: [{ itemId: 'test', position: { x: 50, y: 50 }, scale: 1, rotation: 0 }] });

      vi.mocked(db.getAllStylingItems).mockResolvedValue(mockItems);
      vi.mocked(db.getUserProgress).mockResolvedValue(mockProgress);
      vi.mocked(db.getCharacterState).mockResolvedValue(mockCharState);

      render(
        <AppProvider>
          <ResetTestComponent />
        </AppProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('items-count').textContent).toBe('5');
      });

      // Click reset button
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);

      // Wait for reset to complete
      await waitFor(() => {
        expect(db.clearAllData).toHaveBeenCalled();
        expect(db.saveStylingItems).toHaveBeenCalledWith(initialStylingItems);
        expect(db.saveUserProgress).toHaveBeenCalledWith(initialUserProgress);
        expect(db.saveCharacterState).toHaveBeenCalledWith({ appliedItems: [] });
      });
    });

    it('should refresh state after reset', async () => {
      const mockItems = createStylingItems(3);
      vi.mocked(db.getAllStylingItems)
        .mockResolvedValueOnce(mockItems) // Initial load
        .mockResolvedValueOnce(initialStylingItems); // After reset

      vi.mocked(db.getUserProgress)
        .mockResolvedValueOnce(createUserProgress({ totalCorrectAnswers: 5 }))
        .mockResolvedValueOnce(initialUserProgress);

      vi.mocked(db.getCharacterState)
        .mockResolvedValueOnce(createCharacterState({ appliedItems: [{ itemId: 'test', position: { x: 50, y: 50 }, scale: 1, rotation: 0 }] }))
        .mockResolvedValueOnce({ id: 1, appliedItems: [] });

      render(
        <AppProvider>
          <ResetTestComponent />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('items-count').textContent).toBe('3');
      });

      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(db.getAllStylingItems).toHaveBeenCalledTimes(2); // Initial + refresh
        expect(db.getUserProgress).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });

    it('should handle errors during reset', async () => {
      vi.mocked(db.clearAllData).mockRejectedValue(new Error('Reset failed'));

      render(
        <AppProvider>
          <ResetTestComponent />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reset-button')).toBeInTheDocument();
      });

      const resetButton = screen.getByTestId('reset-button');
      
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(async () => {
        fireEvent.click(resetButton);
        await waitFor(() => {
          expect(screen.getByTestId('reset-called').textContent).toBe('yes');
        });
      }).rejects.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
