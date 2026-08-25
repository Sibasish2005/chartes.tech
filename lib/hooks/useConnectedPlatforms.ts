"use client";

import { useEffect, useState } from "react";

export function useConnectedPlatforms() {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchConnected() {
      try {
        const res = await fetch("/api/social/connected");
        if (!res.ok) return;

        const data = await res.json();
        if (isMounted && Array.isArray(data.connected)) {
          setConnectedPlatforms(data.connected);
        }
      } catch (err) {
        console.error("Error loading connected platforms:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchConnected();

    return () => {
      isMounted = false;
    };
  }, []);

  return { connectedPlatforms, loading };
}
