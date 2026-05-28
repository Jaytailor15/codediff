"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      window.localStorage.removeItem(key);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  const setStoredValue = useCallback((nextValue: T) => {
    setValue(nextValue);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [isLoaded, key, value]);

  return [value, setStoredValue, isLoaded] as const;
}
