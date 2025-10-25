import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useComposition } from '../useComposition';

describe('useComposition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with isComposing as false', () => {
    const { result } = renderHook(() => useComposition());

    expect(result.current.isComposing()).toBe(false);
  });

  it('should set isComposing to true on composition start', () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionStart(event);
    });

    expect(result.current.isComposing()).toBe(true);
  });

  it('should set isComposing to false after composition end with delay', () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionStart(event);
    });

    expect(result.current.isComposing()).toBe(true);

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionEnd(event);
    });

    // Should still be true immediately after compositionEnd
    expect(result.current.isComposing()).toBe(true);

    // After timeout, should be false
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.isComposing()).toBe(false);
  });

  it('should call original onCompositionStart if provided', () => {
    const mockOnCompositionStart = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onCompositionStart: mockOnCompositionStart })
    );

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionStart(event);
    });

    expect(mockOnCompositionStart).toHaveBeenCalledTimes(1);
  });

  it('should call original onCompositionEnd if provided', () => {
    const mockOnCompositionEnd = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onCompositionEnd: mockOnCompositionEnd })
    );

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionEnd(event);
    });

    expect(mockOnCompositionEnd).toHaveBeenCalledTimes(1);
  });

  it('should block Enter key propagation during composition', () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionStart(event);
    });

    const mockStopPropagation = vi.fn();
    act(() => {
      const keyEvent = {
        key: 'Enter',
        shiftKey: false,
        stopPropagation: mockStopPropagation,
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      result.current.onKeyDown(keyEvent);
    });

    expect(mockStopPropagation).toHaveBeenCalled();
  });

  it('should block Escape key propagation during composition', () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionStart(event);
    });

    const mockStopPropagation = vi.fn();
    act(() => {
      const keyEvent = {
        key: 'Escape',
        shiftKey: false,
        stopPropagation: mockStopPropagation,
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      result.current.onKeyDown(keyEvent);
    });

    expect(mockStopPropagation).toHaveBeenCalled();
  });

  it('should not block Shift+Enter during composition', () => {
    const mockOriginalOnKeyDown = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onKeyDown: mockOriginalOnKeyDown })
    );

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionStart(event);
    });

    const mockStopPropagation = vi.fn();
    act(() => {
      const keyEvent = {
        key: 'Enter',
        shiftKey: true,
        stopPropagation: mockStopPropagation,
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      result.current.onKeyDown(keyEvent);
    });

    expect(mockStopPropagation).not.toHaveBeenCalled();
    expect(mockOriginalOnKeyDown).toHaveBeenCalled();
  });

  it('should call original onKeyDown when not composing', () => {
    const mockOnKeyDown = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onKeyDown: mockOnKeyDown })
    );

    act(() => {
      const keyEvent = {
        key: 'Enter',
        shiftKey: false,
        stopPropagation: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      result.current.onKeyDown(keyEvent);
    });

    expect(mockOnKeyDown).toHaveBeenCalled();
  });

  it('should allow other keys during composition', () => {
    const mockOnKeyDown = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onKeyDown: mockOnKeyDown })
    );

    act(() => {
      const event = {} as React.CompositionEvent<HTMLInputElement>;
      result.current.onCompositionStart(event);
    });

    const mockStopPropagation = vi.fn();
    act(() => {
      const keyEvent = {
        key: 'a',
        shiftKey: false,
        stopPropagation: mockStopPropagation,
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      result.current.onKeyDown(keyEvent);
    });

    expect(mockStopPropagation).not.toHaveBeenCalled();
    expect(mockOnKeyDown).toHaveBeenCalled();
  });

  it('should clear previous timers when composition starts again', () => {
    const { result } = renderHook(() => useComposition());

    // Start and end composition
    act(() => {
      result.current.onCompositionStart({} as React.CompositionEvent<HTMLInputElement>);
      result.current.onCompositionEnd({} as React.CompositionEvent<HTMLInputElement>);
    });

    // Start composition again before timers complete
    act(() => {
      result.current.onCompositionStart({} as React.CompositionEvent<HTMLInputElement>);
    });

    // Should still be composing
    expect(result.current.isComposing()).toBe(true);

    // Complete the timers
    act(() => {
      vi.runAllTimers();
    });

    // Should still be composing (because we started again)
    expect(result.current.isComposing()).toBe(true);
  });
});
