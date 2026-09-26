import { useState, useEffect } from "react";

/**
 * Custom hook to debounce fast-changing state values (e.g. search inputs).
 * Reduces redundant rendering and CPU/network overhead.
 * @param value The value to debounce
 * @param delay Milliseconds to delay update
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
