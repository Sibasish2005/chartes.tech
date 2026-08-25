"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

interface UseAuthRedirectOptions {
  redirectToIfAuthenticated?: string;
  redirectToIfUnauthenticated?: string;
}

export function useAuthRedirect(options?: UseAuthRedirectOptions) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          if (isMounted) {
            setUser(null);
            setAuthenticated(false);
            setLoading(false);
            if (options?.redirectToIfUnauthenticated) {
              router.push(options.redirectToIfUnauthenticated);
            }
          }
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setUser(data.user);
          setAuthenticated(data.authenticated);
          setLoading(false);

          if (data.authenticated && options?.redirectToIfAuthenticated) {
            window.location.href = options.redirectToIfAuthenticated;
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setAuthenticated(false);
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [options?.redirectToIfAuthenticated, options?.redirectToIfUnauthenticated, router]);

  return { user, loading, authenticated };
}
