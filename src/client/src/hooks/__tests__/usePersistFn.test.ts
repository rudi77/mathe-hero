import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePersistFn } from '../usePersistFn';

describe('usePersistFn', () => {
  it('should return a persistent function reference', () => {
    const fn = vi.fn();
    const { result, rerender } = renderHook(() => usePersistFn(fn));

    const firstRef = result.current;
    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it('should call the latest function when invoked', () => {
    let counter = 0;
    const fn1 = vi.fn(() => counter++);
    const { result, rerender } = renderHook(
      ({ fn }) => usePersistFn(fn),
      { initialProps: { fn: fn1 } }
    );

    result.current();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(counter).toBe(1);

    const fn2 = vi.fn(() => counter++);
    rerender({ fn: fn2 });

    result.current();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(1); // fn1 should not be called again
    expect(counter).toBe(2);
  });

  it('should forward arguments correctly', () => {
    const fn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const { result } = renderHook(() => usePersistFn(fn));

    const output = result.current(42, 'test');

    expect(fn).toHaveBeenCalledWith(42, 'test');
    expect(output).toBe('42-test');
  });

  it('should return function return value', () => {
    const fn = vi.fn(() => 'test-value');
    const { result } = renderHook(() => usePersistFn(fn));

    const output = result.current();

    expect(output).toBe('test-value');
  });

  it('should handle functions with no arguments', () => {
    const fn = vi.fn(() => 'no-args');
    const { result } = renderHook(() => usePersistFn(fn));

    const output = result.current();

    expect(fn).toHaveBeenCalled();
    expect(output).toBe('no-args');
  });

  it('should handle functions with multiple arguments', () => {
    const fn = vi.fn((a: number, b: number, c: number) => a + b + c);
    const { result } = renderHook(() => usePersistFn(fn));

    const output = result.current(1, 2, 3);

    expect(fn).toHaveBeenCalledWith(1, 2, 3);
    expect(output).toBe(6);
  });

  it('should preserve function context (this)', () => {
    const obj = {
      value: 42,
      method: function () {
        return this.value;
      },
    };

    const { result } = renderHook(() => usePersistFn(obj.method));

    const output = result.current.call(obj);

    expect(output).toBe(42);
  });
});
