"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check auth only on client side
    const token = localStorage.getItem('token');

    // Paths that are accessible without login
    const publicPaths = ['/', '/login', '/register', '/snippet', '/privacy'];
    const isPublicPath = publicPaths.includes(pathname);

    // Auth-only paths (redirect to dashboard if already logged in)
    const authOnlyPaths = ['/login', '/register'];
    const isAuthOnlyPath = authOnlyPaths.includes(pathname);

    if (!token && !isPublicPath) {
      // Don't render and redirect to login
      setShouldRender(false);
      router.push('/login');
    } else if (token && isAuthOnlyPath) {
      // Don't render and redirect to dashboard (only for login/register pages)
      setShouldRender(false);
      router.push('/dashboard');
    } else {
      // Allow rendering
      setShouldRender(true);
    }
  }, [pathname, router]);

  // Show nothing until auth check allows rendering
  if (!shouldRender) return null;

  return <>{children}</>;
}
