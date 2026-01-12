import { useRef } from "react";

export const useDebounce = <T>(
  func: (value: T) => void,
  delay: number
): ((value: T) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (value: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      func(value);
    }, delay);
  };
};
