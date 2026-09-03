import { useState, useEffect } from 'react';

/**
 * Retrasa la actualización de un valor hasta que el usuario
 * deje de escribir por el tiempo especificado.
 *
 * @param value   - Valor a debounce
 * @param delay   - Tiempo de espera en ms (default: 350ms)
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
