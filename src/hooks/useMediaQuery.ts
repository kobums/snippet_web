"use client"

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  // SSR 시 false 반환, 클라이언트에서만 실제 값 사용
  return mounted ? matches : false;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)'); // lg breakpoint
}
