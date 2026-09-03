import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('inicial', 350));
    expect(result.current).toBe('inicial');
  });

  it('no actualiza el valor antes de que expire el delay', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 350),
      { initialProps: { value: 'inicial' } },
    );

    rerender({ value: 'nuevo' });
    vi.advanceTimersByTime(200);

    expect(result.current).toBe('inicial');
  });

  it('actualiza el valor después del delay', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 350),
      { initialProps: { value: 'inicial' } },
    );

    rerender({ value: 'nuevo' });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current).toBe('nuevo');
  });

  it('reinicia el timer si el valor cambia antes de que expire', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 350),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });
    vi.advanceTimersByTime(200);
    rerender({ value: 'c' });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current).toBe('c');
  });

  it('utiliza 350ms como delay por defecto', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value),
      { initialProps: { value: 'inicial' } },
    );

    rerender({ value: 'nuevo' });

    act(() => {
      vi.advanceTimersByTime(349);
    });
    expect(result.current).toBe('inicial');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('nuevo');
  });
});
