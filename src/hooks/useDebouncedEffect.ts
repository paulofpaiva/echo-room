import { useEffect, useRef } from "react";

/**
 * Runs a callback with the current value after the value has stayed unchanged
 * for `delay` ms. Useful for debouncing search: trigger search when user
 * stops typing.
 */
export function useDebouncedEffect<T>(value: T, delay: number, onDebounced: (v: T) => void) {
  const onDebouncedRef = useRef(onDebounced);
  onDebouncedRef.current = onDebounced;

  useEffect(() => {
    const t = setTimeout(() => {
      onDebouncedRef.current(value);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);
}
