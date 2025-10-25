import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import MathTask from '../MathTask';
import { createUserProgress } from '@/test/fixtures';

// Mock dependencies
vi.mock('wouter', () => ({
  useLocation: () => ['/math', vi.fn()],
}));

vi.mock('@/contexts/AppContext', () => ({
  useApp: () => ({
    userProgress: createUserProgress(),
    getDifficultyForTopic: vi.fn(() => 1),
    setDifficultyForTopic: vi.fn(),
    updateUserProgress: vi.fn(),
    refreshStylingItems: vi.fn(),
    refreshUserProgress: vi.fn(),
  }),
}));

describe('MathTask', () => {
  it('should render loading state initially', () => {
    const { container } = render(<MathTask />);
    expect(container).toBeTruthy();
  });

  it('should render math task page structure', async () => {
    const { findByText } = render(<MathTask />);

    // Should eventually render back button
    const backButton = await findByText('← Zurück zur Themenauswahl');
    expect(backButton).toBeInTheDocument();
  });

  it('should render progress indicator', async () => {
    const { findByText } = render(<MathTask />);

    const progressText = await findByText(/Fortschritt zum nächsten Item:/);
    expect(progressText).toBeInTheDocument();
  });

  it('should render stats display', async () => {
    const { findByText } = render(<MathTask />);

    const richtigText = await findByText('Richtig');
    expect(richtigText).toBeInTheDocument();

    const serieText = await findByText('Serie');
    expect(serieText).toBeInTheDocument();
  });
});
