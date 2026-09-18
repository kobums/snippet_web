"use client"

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '@/stores/useThemeStore';

/**
 * 앱 전체에서 단 하나만 마운트되는 토스트 컨테이너.
 * layout.tsx(body 직속)에 두어 어떤 stacking context에도 갇히지 않게 한다.
 * (AppShell의 <main class="content-layer">는 z-index:1 컨텍스트라, 그 안에 두면
 *  body로 포털된 모달(z-50) 뒤에 토스트가 가려진다.)
 */
export default function AppToaster() {
  const { theme, effectiveDark } = useThemeStore();

  // 스토어를 localStorage 저장값으로 초기화 (AppShell 밖 페이지에서도 테마 반영)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snippet-theme') as 'light' | 'dark' | 'system' | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        useThemeStore.setState({ theme: saved });
      }
    } catch {}
  }, []);

  // theme 구독으로 재렌더 → effectiveDark 재평가
  void theme;
  const isDark = effectiveDark();

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark ? '#1c1c1e' : '#ffffff',
          color: isDark ? '#f0f0f0' : '#1f2937',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          boxShadow: isDark
            ? '0 4px 16px rgba(0,0,0,0.4)'
            : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        },
        success: {
          iconTheme: {
            primary: '#30d158',
            secondary: isDark ? '#1c1c1e' : '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff453a',
            secondary: isDark ? '#1c1c1e' : '#ffffff',
          },
        },
      }}
    />
  );
}
