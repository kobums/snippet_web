"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authRepository } from '@/core/di/authInstances';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const publicPaths = ['/', '/login', '/register', '/verify', '/snippet', '/privacy'];
    const isPublicPath = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
    const authOnlyPaths = ['/login', '/register', '/verify'];
    const isAuthOnlyPath = authOnlyPaths.includes(pathname);

    const token = localStorage.getItem('token');

    if (!token) {
      if (!isPublicPath) {
        router.replace('/login');
      } else {
        setShouldRender(true);
      }
      return;
    }

    // Token exists: validate with server for auto-login
    authRepository.getMe()
      .then(() => {
        if (isAuthOnlyPath) {
          router.replace('/dashboard');
        } else {
          setShouldRender(true);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        if (!isPublicPath) {
          router.replace('/login');
        } else {
          setShouldRender(true);
        }
      });
  }, [pathname, router]);

  if (!shouldRender) return null;

  return <>{children}</>;
}
