"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check auth only on client side
    const token = localStorage.getItem('token');
    
    // Paths that are accessible without login
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!token && !isPublicPath) {
      // Redirect to login if user isn't logged in and tries to access a protected page
      router.push('/login');
    } else if (token && isPublicPath) {
      // Redirect to home if user is already logged in and tries to access login/register
      router.push('/');
    }
  }, [pathname, router]);

  // Optionally, show a generic loading state before auth check is complete
  if (!mounted) return null;

  return <>{children}</>;
}
