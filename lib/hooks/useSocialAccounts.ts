"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PlatformConfig } from "@/components/accounts/ConnectedAccountsGrid";

export function useSocialAccounts(initialPlatforms: PlatformConfig[]) {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(initialPlatforms);
  const [targetDisconnect, setTargetDisconnect] = useState<PlatformConfig | null>(
    null
  );
  const [disconnecting, setDisconnecting] = useState(false);

  async function handleConfirmDisconnect() {
    if (!targetDisconnect) return;

    setDisconnecting(true);
    const platformName = targetDisconnect.name;

    try {
      const response = await fetch("/api/social/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: targetDisconnect.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      // Optimistically update connected status
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === targetDisconnect.id ? { ...p, connected: false } : p
        )
      );

      setTargetDisconnect(null);
      router.refresh();

      toast.success(`${platformName} Disconnected`, {
        description: `Your ${platformName} account has been unlinked successfully.`,
      });
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error(`Failed to disconnect ${platformName}`, {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setDisconnecting(false);
    }
  }

  function promptDisconnect(platform: PlatformConfig) {
    setTargetDisconnect(platform);
  }

  function cancelDisconnect() {
    if (!disconnecting) {
      setTargetDisconnect(null);
    }
  }

  return {
    platforms,
    targetDisconnect,
    disconnecting,
    promptDisconnect,
    cancelDisconnect,
    handleConfirmDisconnect,
  };
}
