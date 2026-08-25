"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  Briefcase,
  ShieldCheck,
  Camera,
  Users,
  Unlink,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface PlatformConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  connected: boolean;
  connectUrl: string;
  iconName: "linkedin" | "google" | "instagram" | "facebook";
  badge: string;
  badgeColor: string;
}

interface ConnectedAccountsGridProps {
  initialPlatforms: PlatformConfig[];
}

export default function ConnectedAccountsGrid({
  initialPlatforms,
}: ConnectedAccountsGridProps) {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(initialPlatforms);
  const [targetDisconnect, setTargetDisconnect] = useState<PlatformConfig | null>(
    null
  );
  const [disconnecting, setDisconnecting] = useState(false);

  function getIcon(iconName: PlatformConfig["iconName"]) {
    switch (iconName) {
      case "linkedin":
        return Briefcase;
      case "google":
        return ShieldCheck;
      case "instagram":
        return Camera;
      case "facebook":
        return Users;
      default:
        return Briefcase;
    }
  }

  async function handleConfirmDisconnect() {
    if (!targetDisconnect) return;

    setDisconnecting(true);
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
    } catch (error) {
      console.error("Disconnect error:", error);
      alert("Failed to disconnect account. Please try again.");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {platforms.map((platform) => {
          const IconComponent = getIcon(platform.iconName);
          return (
            <div
              key={platform.id}
              className="bg-white rounded-2xl border border-[#EAE3D9] p-5 lg:p-6 shadow-xs flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Monochrome Lucide Icon Container */}
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] flex items-center justify-center text-neutral-800 shadow-xs">
                      <IconComponent className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-neutral-900">
                        {platform.name}
                      </h2>
                      <p className="text-[11px] text-neutral-500 font-medium">
                        {platform.tagline}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${platform.badgeColor}`}
                  >
                    {platform.badge}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {platform.description}
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#EAE3D9]/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      platform.connected ? "bg-neutral-900" : "bg-neutral-300"
                    }`}
                  />
                  <span className="text-[11px] font-medium text-neutral-600">
                    {platform.connected ? "Connected" : "Not connected"}
                  </span>
                </div>

                {platform.id === "google" ? (
                  platform.connected ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] text-neutral-800 text-xs font-medium border border-[#EAE3D9]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Active Sign-in</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
                      Email Sign-in
                    </span>
                  )
                ) : platform.connected ? (
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] text-neutral-800 text-xs font-medium border border-[#EAE3D9]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Connected</span>
                    </div>

                    {/* Disconnect Button for Social Media accounts */}
                    <button
                      type="button"
                      onClick={() => setTargetDisconnect(platform)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-neutral-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                      title={`Disconnect ${platform.name}`}
                    >
                      <Unlink className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                ) : platform.connectUrl === "#" ? (
                  <button
                    disabled
                    className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-400 text-xs font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <a
                    href={platform.connectUrl}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs group"
                  >
                    <span>Connect Account</span>
                    <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disconnect Confirmation Dialog */}
      <Dialog
        open={!!targetDisconnect}
        onOpenChange={(open) => {
          if (!open && !disconnecting) setTargetDisconnect(null);
        }}
      >
        <DialogContent className="bg-white border border-[#EAE3D9] shadow-lg rounded-2xl p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              Disconnect {targetDisconnect?.name}?
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 leading-relaxed pt-1">
              Are you sure you want to disconnect your {targetDisconnect?.name} account? Automated publishing to this channel will be paused until you re-authorize.
            </DialogDescription>
          </DialogHeader>

          {targetDisconnect && (
            <div className="my-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#EAE3D9] flex items-center justify-center text-neutral-800 shrink-0">
                <Unlink className="w-4 h-4 text-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900">
                  {targetDisconnect.name}
                </p>
                <p className="text-[11px] text-neutral-500">
                  Will unlink stored access tokens and credentials
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={disconnecting}
              onClick={() => setTargetDisconnect(null)}
              className="px-4 py-2 rounded-full border border-[#EAE3D9] text-xs font-medium text-neutral-700 hover:bg-[#FAF8F5]"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={disconnecting}
              onClick={handleConfirmDisconnect}
              className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-all shadow-xs flex items-center gap-1.5"
            >
              {disconnecting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Disconnecting...</span>
                </>
              ) : (
                <span>Disconnect</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
