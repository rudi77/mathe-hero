import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Styling from '../Styling';
import { createUserProgress, createInitialTestItems, createCharacterState } from '@/test/fixtures';

// Mock dependencies
vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()],
}));

// Create mock function outside to access in tests
const mockRefreshUserProgress = vi.fn();

vi.mock('@/contexts/AppContext', () => ({
  useApp: () => ({
    stylingItems: createInitialTestItems(),
    userProgress: createUserProgress(),
    characterState: createCharacterState(),
    updateCharacterState: vi.fn(),
    refreshUserProgress: mockRefreshUserProgress,
    isLoading: false, // DB is initialized
  }),
}));

describe('Styling', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockRefreshUserProgress.mockClear();
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
});
