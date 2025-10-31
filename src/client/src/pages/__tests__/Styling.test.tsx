import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Styling from '../Styling';
import { createUserProgress, createInitialTestItems, createCharacterState } from '@/test/fixtures';

// Mock dependencies
vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()],
}));

// Create mock function outside to access in tests
const mockRefreshUserProgress = vi.fn();
const mockResetGame = vi.fn();

vi.mock('@/contexts/AppContext', () => ({
  useApp: () => ({
    stylingItems: createInitialTestItems(),
    userProgress: createUserProgress(),
    characterState: createCharacterState(),
    updateCharacterState: vi.fn(),
    refreshUserProgress: mockRefreshUserProgress,
    resetGame: mockResetGame,
    isLoading: false, // DB is initialized
  }),
}));

describe('Styling', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockRefreshUserProgress.mockClear();
    mockResetGame.mockClear();
    mockResetGame.mockResolvedValue(undefined);
  });

  it('should call refreshUserProgress on mount', () => {
    render(<Styling />);

    expect(mockRefreshUserProgress).toHaveBeenCalledTimes(1);
  });

  it('should render page title', () => {
    render(<Styling />);

    expect(screen.getByText('Mathe-Stylistin')).toBeInTheDocument();
  });

  it('should render math practice button', () => {
    render(<Styling />);

    expect(screen.getByText(/Mathe üben/)).toBeInTheDocument();
  });

  it('should render Trainings-Dojo button', () => {
    render(<Styling />);

    expect(screen.getByText(/Trainings-Dojo/)).toBeInTheDocument();
  });

  it('should render character display section', () => {
    render(<Styling />);

    expect(screen.getByText('Dein Charakter')).toBeInTheDocument();
  });

  it('should render styling items section', () => {
    render(<Styling />);

    expect(screen.getByText('Deine Styling-Items')).toBeInTheDocument();
  });

  it('should render clear all button', () => {
    render(<Styling />);

    expect(screen.getByText('Alles löschen')).toBeInTheDocument();
  });

  it('should render statistics section', () => {
    render(<Styling />);

    expect(screen.getByText('Deine Statistik')).toBeInTheDocument();
    expect(screen.getByText('Richtig')).toBeInTheDocument();
    expect(screen.getByText('Serie')).toBeInTheDocument();
    // "Items" appears both in stats and tab navigation, so just check the section exists
  });

  it('should render items unlocked counter', () => {
    const { container } = render(<Styling />);

    expect(container.textContent).toContain('freigeschaltet');
  });

  it('should render tab navigation', () => {
    render(<Styling />);

    expect(screen.getByText('Alle')).toBeInTheDocument();
    expect(screen.getByText('Farben')).toBeInTheDocument();
    // "Items" appears in both tabs and stats, check other unique tabs
    expect(screen.getByText('Effekte')).toBeInTheDocument();
  });

  it('should render math practice prompt', () => {
    render(<Styling />);

    expect(screen.getByText(/Löse Matheaufgaben/)).toBeInTheDocument();
  });

  describe('Reset Game', () => {
    it('should render reset button in statistics section', () => {
      render(<Styling />);

      expect(screen.getByText('Spiel zurücksetzen')).toBeInTheDocument();
    });

    it('should open confirmation dialog when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<Styling />);

      const resetButton = screen.getByText('Spiel zurücksetzen');
      await user.click(resetButton);

      expect(screen.getByText('Spiel zurücksetzen?')).toBeInTheDocument();
      expect(screen.getByText(/Warnung: Alle Fortschritte gehen verloren!/)).toBeInTheDocument();
    });

    it('should show warning message in dialog', async () => {
      const user = userEvent.setup();
      render(<Styling />);

      const resetButton = screen.getByText('Spiel zurücksetzen');
      await user.click(resetButton);

      expect(screen.getByText(/Dies löscht:/)).toBeInTheDocument();
      expect(screen.getByText(/Alle freigeschalteten Items/)).toBeInTheDocument();
      expect(screen.getByText(/Deinen gesamten Fortschritt/)).toBeInTheDocument();
      expect(screen.getByText(/Deine Charakter-Gestaltung/)).toBeInTheDocument();
      expect(screen.getByText(/Möchtest du wirklich neu anfangen?/)).toBeInTheDocument();
    });

    it('should call resetGame when confirmed', async () => {
      const user = userEvent.setup();
      render(<Styling />);

      const resetButton = screen.getByText('Spiel zurücksetzen');
      await user.click(resetButton);

      const confirmButton = screen.getByText('Zurücksetzen');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockResetGame).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call resetGame when cancelled', async () => {
      const user = userEvent.setup();
      render(<Styling />);

      const resetButton = screen.getByText('Spiel zurücksetzen');
      await user.click(resetButton);

      const cancelButton = screen.getByText('Abbrechen');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Spiel zurücksetzen?')).not.toBeInTheDocument();
      });

      expect(mockResetGame).not.toHaveBeenCalled();
    });

    it('should show loading state during reset', async () => {
      const user = userEvent.setup();
      let resolveReset: () => void;
      const resetPromise = new Promise<void>((resolve) => {
        resolveReset = resolve;
      });
      mockResetGame.mockReturnValue(resetPromise);

      render(<Styling />);

      const resetButton = screen.getByText('Spiel zurücksetzen');
      await user.click(resetButton);

      const confirmButton = screen.getByText('Zurücksetzen');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Zurücksetzen...')).toBeInTheDocument();
      });

      resolveReset!();
      await waitFor(() => {
        expect(screen.queryByText('Zurücksetzen...')).not.toBeInTheDocument();
      });
    });
  });
});
