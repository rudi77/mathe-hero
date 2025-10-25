import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Test component that uses the theme context
function TestComponent() {
  const { theme, toggleTheme, switchable } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="switchable">{switchable ? 'yes' : 'no'}</div>
      {toggleTheme && (
        <button onClick={toggleTheme} data-testid="toggle-button">
          Toggle Theme
        </button>
      )}
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear document classes
    document.documentElement.classList.remove('dark');
  });

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within ThemeProvider');

    spy.mockRestore();
  });

  it('should provide default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(screen.getByTestId('switchable').textContent).toBe('no');
  });

  it('should provide default dark theme when specified', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should not provide toggle function when not switchable', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.queryByTestId('toggle-button')).not.toBeInTheDocument();
  });

  it('should provide toggle function when switchable', () => {
    render(
      <ThemeProvider switchable>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  it('should toggle theme from light to dark', () => {
    render(
      <ThemeProvider switchable>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const themeDisplay = screen.getByTestId('theme');

    expect(themeDisplay.textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    fireEvent.click(toggleButton);

    expect(themeDisplay.textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme from dark to light', () => {
    render(
      <ThemeProvider defaultTheme="dark" switchable>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const themeDisplay = screen.getByTestId('theme');

    expect(themeDisplay.textContent).toBe('dark');

    fireEvent.click(toggleButton);

    expect(themeDisplay.textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should persist theme to localStorage when switchable', () => {
    render(
      <ThemeProvider switchable>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');

    fireEvent.click(toggleButton);

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should load theme from localStorage when switchable', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider switchable>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should not persist theme to localStorage when not switchable', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('should apply dark class to document root when dark theme', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class from document root when light theme', () => {
    // Start with dark class
    document.documentElement.classList.add('dark');

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
