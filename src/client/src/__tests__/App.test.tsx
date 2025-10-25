import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

// Mock all page components
vi.mock('@/pages/Styling', () => ({
  default: () => <div>Styling Page</div>,
}));

vi.mock('@/pages/TopicSelection', () => ({
  default: () => <div>Topic Selection Page</div>,
}));

vi.mock('@/pages/MathTask', () => ({
  default: () => <div>Math Task Page</div>,
}));

vi.mock('@/pages/NotFound', () => ({
  default: () => <div>Not Found Page</div>,
}));

// Mock AppContext
vi.mock('@/contexts/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useApp: () => ({
    stylingItems: [],
    userProgress: null,
    characterState: { appliedItems: [] },
    isLoading: false,
  }),
}));

// Mock ThemeContext
vi.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock wouter for routing
vi.mock('wouter', async () => {
  const actual = await vi.importActual('wouter');
  return {
    ...actual,
    useLocation: () => ['/', vi.fn()],
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('should render with all providers', () => {
    const { container } = render(<App />);
    // Just verify the app renders successfully with all providers
    expect(container.firstChild).toBeTruthy();
  });
});
