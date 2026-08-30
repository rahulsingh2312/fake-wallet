"use client";

import { useCallback, useEffect, useState } from "react";
import { CloseIcon, DotsIcon, PlusIcon, ShareIcon } from "./icons";
import { Sheet } from "./ui";

const DISMISS_KEY = "larp-phantom:install-dismissed";

/** Chrome's install event — not in lib.dom yet. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/i.test(ua) || iPadOS) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

/** True when the page is already running as an installed app. */
function runningStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    nav.standalone === true // iOS Safari
  );
}

/**
 * The add-to-home-screen flow, shared by the wallet's banner and the landing's
 * button. Chrome hands us a real `beforeinstallprompt` we can fire; everything
 * else (iOS Safari especially) only gets manual steps, so `help` opens the
 * sheet instead.
 */
export function useInstall() {
  const [standalone, setStandalone] = useState(true); // assume installed until checked
  const [dismissed, setDismissed] = useState(true);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [help, setHelp] = useState(false);
  const platform = typeof window === "undefined" ? "desktop" : detectPlatform();

  useEffect(() => {
    setStandalone(runningStandalone());
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault(); // keep Chrome's own mini-infobar out of the way
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setStandalone(true);
      setHelp(false);
    };

    // Covers the app being launched from the home screen in an existing tab.
    const mq = window.matchMedia("(display-mode: standalone)");
    const onModeChange = () => setStandalone(runningStandalone());

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    mq.addEventListener("change", onModeChange);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      mq.removeEventListener("change", onModeChange);
    };
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode — it just reappears next session */
    }
  }, []);

  const install = useCallback(async () => {
    // Chrome / Edge / Android: fire the real prompt.
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      setDeferred(null);
      if (outcome === "accepted") setStandalone(true);
      return;
    }
    // iOS Safari and anything else: show the manual steps.
    setHelp(true);
  }, [deferred]);

  return { standalone, dismissed, dismiss, install, help, setHelp, platform };
}

/** The dark banner that sits above the wallet's bottom bar. */
export function InstallPrompt() {
  const { standalone, dismissed, dismiss, install, help, setHelp, platform } =
    useInstall();

  if (standalone || dismissed) return null;

  return (
    <>
      <div className="mb-[10px] flex items-center gap-[11px] rounded-[16px] bg-[#191919]/95 px-[14px] py-[11px] backdrop-blur">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.png"
          alt=""
          className="h-[34px] w-[34px] shrink-0 rounded-full"
          draggable={false}
        />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[15px] font-medium">
            Add to Home Screen
          </div>
          <div className="truncate text-[13px] text-ph-mute">
            Opens fullscreen, no browser bars
          </div>
        </div>
        <button
          onClick={install}
          className="shrink-0 rounded-full bg-ph-purple px-[15px] py-[8px] text-[14px] font-bold text-black active:opacity-80"
        >
          Add
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full text-ph-mute active:opacity-60"
        >
          <CloseIcon className="h-[15px] w-[15px]" />
        </button>
      </div>

      <InstallHelpSheet open={help} onClose={() => setHelp(false)} platform={platform} />
    </>
  );
}

/** The manual "here's how" steps, for browsers with no install prompt. */
export function InstallHelpSheet({
  open,
  onClose,
  platform,
}: {
  open: boolean;
  onClose: () => void;
  platform: Platform;
}) {
  return (
    <>
      <Sheet open={open} onClose={onClose}>
        <div className="px-[21px] pb-10 pt-2">
          <h2 className="text-[24px] font-bold tracking-[-0.015em]">
            Add to Home Screen
          </h2>
          <p className="mt-[6px] text-[16px] text-ph-mute">
            {platform === "ios"
              ? "Safari can install this in two taps."
              : "Your browser can install this from its menu."}
          </p>

          <ol className="mt-[22px] flex flex-col gap-[14px]">
            {platform === "ios" ? (
              <>
                <Step n={1} icon={<ShareIcon className="h-[20px] w-[20px]" />}>
                  Tap the <strong className="font-medium">Share</strong> button
                  in Safari&apos;s bottom bar
                </Step>
                <Step n={2} icon={<PlusIcon className="h-[20px] w-[20px]" />}>
                  Scroll down and pick{" "}
                  <strong className="font-medium">Add to Home Screen</strong>
                </Step>
                <Step n={3}>
                  Tap <strong className="font-medium">Add</strong> — it opens
                  fullscreen, with no browser bars
                </Step>
              </>
            ) : (
              <>
                <Step
                  n={1}
                  icon={<DotsIcon className="h-[18px] w-[18px] rotate-90" />}
                >
                  Open your browser&apos;s menu
                </Step>
                <Step n={2} icon={<PlusIcon className="h-[20px] w-[20px]" />}>
                  Choose{" "}
                  <strong className="font-medium">
                    Add to Home screen
                  </strong>{" "}
                  or <strong className="font-medium">Install app</strong>
                </Step>
                <Step n={3}>Confirm, and it installs as its own app</Step>
              </>
            )}
          </ol>

          {platform === "ios" && (
            <p className="mt-[20px] rounded-[14px] bg-[#191919] px-[16px] py-[13px] text-[14px] text-ph-mute">
              This only works in Safari. If you opened this in Chrome, Instagram
              or another in-app browser, reopen the link in Safari first.
            </p>
          )}

          <button
            onClick={onClose}
            className="mt-[22px] w-full rounded-full bg-ph-purple py-[14px] text-[18px] font-medium text-black active:opacity-80"
          >
            Got it
          </button>
        </div>
      </Sheet>
    </>
  );
}

function Step({
  n,
  icon,
  children,
}: {
  n: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-[13px]">
      <span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-full bg-[#232323] text-[15px] font-bold text-ph-purple">
        {n}
      </span>
      <span className="flex-1 text-[16px] leading-snug text-white">
        {children}
      </span>
      {icon && <span className="shrink-0 text-ph-purple">{icon}</span>}
    </li>
  );
}
