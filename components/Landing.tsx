"use client";

import { useEffect, useState } from "react";
import { TourButton } from "./Tour";

const THEME_KEY = "larp-phantom:theme";

const URL = "larpwallet.fun";

/** Best-effort clipboard write. Modern API first, then a hidden-textarea
 * fallback, since `navigator.clipboard` throws silently outside a secure
 * context (e.g. reviewing over `http://<ip>:port` instead of localhost/https).
 * That used to leave the button stuck on "copy" with no feedback at all. */
async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch {
    /* the text is on screen either way */
  }
}

/** Raised card on the paper background. Used for every block on the page. */
function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-fw-line bg-fw-paper/85 shadow-[0_1px_2px_rgba(20,16,31,0.04),0_18px_36px_-24px_rgba(124,92,246,0.3)] backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

/** The gold ghost, at whatever size the slot needs. */
export function GhostMark({
  size = 30,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/brand/ghost-badge.png"
      alt=""
      width={size}
      height={size}
      className={`rounded-[7px] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/** Sun/moon toggle for the landing's light/dark theme. Writes data-theme on
 * <html> and localStorage; the inline script in layout.tsx applies a saved
 * choice before paint so there's no light-then-dark flash. */
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try {
      window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* the toggle still works for this visit */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "switch to light mode" : "switch to dark mode"}
      className="grid h-[30px] w-[30px] place-items-center rounded-full border border-fw-line text-fw-ink-2 transition-colors hover:text-fw-ink"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <circle cx="12" cy="12" r="4.5" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
        </svg>
      )}
    </button>
  );
}

/** X and Telegram — icons only, no accounts exist yet so they don't link
 * anywhere. Muted and non-navigating on purpose, same "not live yet" language
 * as the $LARP contract-address row. */
function SocialIcons() {
  return (
    <span className="flex items-center gap-[12px] text-fw-mute">
      <span title="coming soon" className="cursor-default opacity-50 transition-opacity hover:opacity-80">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
        </svg>
      </span>
      <span title="coming soon" className="cursor-default opacity-50 transition-opacity hover:opacity-80">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.9.9l-5.2-3.9-2.5 2.4c-.3.3-.5.5-1 .5l.3-5.1L18 5.9c.5-.4-.1-.6-.7-.3L6.3 12.5 1.2 11c-1.1-.3-1.1-1.1.2-1.6L20.5 2.6c.9-.3 1.7.2 1.4 1.7Z" />
        </svg>
      </span>
    </span>
  );
}

/* --------------------------------- left ---------------------------------- */

export function LandingLeft() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyText(`https://${URL}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex max-w-[440px] flex-col items-start font-display">
      <span className="reveal reveal-1 font-mono text-[11px] uppercase tracking-[0.22em] text-fw-mute">
        up only, allegedly
      </span>

      <div className="reveal reveal-2 mt-[26px] flex items-center gap-[16px]">
        <GhostMark size={76} className="rounded-[20px] shadow-[0_10px_24px_-12px_rgba(80,41,189,0.45)]" />
        <h1 className="font-display text-[68px] font-bold leading-[0.86] tracking-[-0.045em] text-fw-ink">
          larp
          <br />
          wallet<span className="fw-grad-text">.</span>
        </h1>
      </div>

      <p className="reveal reveal-3 mt-[26px] font-display text-[27px] leading-[1.22] tracking-[-0.022em] text-fw-ink">
        your portfolio, <em className="fw-grad-text not-italic">exactly</em>{" "}
        <em className="italic">as big as you say it is.</em>
      </p>

      <p className="reveal reveal-4 mt-[17px] text-[16.5px] leading-[1.62] text-fw-mute">
        pixel-perfect wallet ui. live jupiter prices. the gains are fake, the
        screenshot isn&rsquo;t.
      </p>

      <div className="reveal reveal-5 mt-[32px] flex flex-wrap items-center gap-[10px]">
        <button
          onClick={copy}
          className="fw-btn-grad group inline-flex items-center gap-[10px] rounded-full px-[19px] py-[12px] text-[15px] font-medium transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          <span className="font-mono">{copied ? "copied" : URL}</span>
          <span className="text-[#2a1c05]/50">{copied ? "✓" : "copy"}</span>
        </button>
      </div>

      <div className="reveal reveal-6 mt-[22px] w-full max-w-[400px] rounded-[14px] border border-fw-line bg-fw-paper/70 p-[14px] backdrop-blur-xl">
        <span className="fw-grad-text font-mono text-[12px] font-bold not-italic">
          $LARP
        </span>
        <span className="mt-[10px] flex w-full items-center gap-[8px] rounded-[9px] border border-dashed border-fw-line bg-fw-paper-2 px-[10px] py-[8px] font-mono text-[11.5px] text-fw-mute">
          <span>contract address</span>
          <span className="ml-auto shrink-0 italic text-fw-mute/70">coming soon</span>
        </span>
      </div>
    </div>
  );
}

/* --------------------------------- right --------------------------------- */

/** Solid gold-on-violet glyphs — filled shapes read cleaner than thin
 * outlines at this size, so every icon is one shape plus a shaded overlay
 * rather than a stack of hairline strokes. The tile is #947de0, sampled
 * straight off the logo photo's own background, so it matches exactly. */
function StepIcon({ kind }: { kind: "phone" | "tap" | "wealth" }) {
  return (
    <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] bg-[#947de0] text-[#f4c64e] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:scale-[1.08]">
      {kind === "phone" && (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <rect x="6" y="2" width="12" height="20" rx="4" fill="currentColor" />
          <rect x="7.6" y="4.6" width="8.8" height="13.2" rx="1.4" fill="black" opacity="0.16" />
          <circle cx="12" cy="19.3" r="1.05" fill="black" opacity="0.32" />
        </svg>
      )}
      {kind === "tap" && (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <circle cx="9.5" cy="14.5" r="6" fill="currentColor" />
          <circle cx="9.5" cy="14.5" r="6" fill="black" opacity="0.08" />
          <circle cx="17" cy="7.2" r="2.3" fill="currentColor" opacity="0.6" />
          <circle cx="20.3" cy="11.6" r="1.4" fill="currentColor" opacity="0.35" />
        </svg>
      )}
      {kind === "wealth" && (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <circle cx="12" cy="12" r="9.5" fill="currentColor" />
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="black" strokeOpacity="0.16" strokeWidth="1.3" />
          <circle cx="12" cy="12" r="6.7" fill="none" stroke="black" strokeOpacity="0.16" strokeWidth="1" />
          <text
            x="12"
            y="15.6"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="black"
            fillOpacity="0.4"
            fontFamily="Arial, sans-serif"
          >
            $
          </text>
          <ellipse cx="9" cy="8.3" rx="3" ry="1.7" fill="white" opacity="0.28" />
        </svg>
      )}
    </span>
  );
}

const STEPS = [
  { n: "01", icon: "phone" as const, t: "add to home screen", d: "goes fullscreen, no browser bars." },
  { n: "02", icon: "tap" as const, t: "tap the balance 5x fast", d: "no settings button. that's the point." },
  { n: "03", icon: "wealth" as const, t: "type any number", d: "or paste a solana mint, jupiter fills the rest." },
];

export function LandingRight() {
  return (
    <div className="flex max-w-[400px] flex-col font-display">
      <span className="reveal reveal-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fw-mute">
        three steps to generational wealth
      </span>

      <ol className="mt-[22px] flex flex-col gap-[10px]">
        {STEPS.map((s, i) => (
          <li key={s.n} className={`reveal reveal-${i + 4}`}>
            <Card className="group p-[15px] hover:-translate-y-[3px] hover:border-fw-violet/35">
              <div className="flex items-center gap-[14px]">
                <StepIcon kind={s.icon} />
                <span>
                  <span className="flex items-baseline gap-[8px]">
                    <span className="font-mono text-[11px] tabular-nums text-fw-violet">
                      {s.n}
                    </span>
                    <span className="text-[16.5px] font-medium tracking-[-0.012em] text-fw-ink">
                      {s.t}
                    </span>
                  </span>
                  <span className="mt-[4px] block text-[13.5px] leading-[1.55] text-fw-mute">
                    {s.d}
                  </span>
                </span>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <div className="reveal reveal-7 mt-[16px]">
        <Card className="p-[18px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fw-mute">
            the fine print
          </span>
          <p className="mt-[10px] text-[14px] leading-[1.62] text-fw-mute">
            no keys, no wallet connect, no real money. just numbers you
            control.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------- bars --------------------------------- */

export function LandingTopBar() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden items-center justify-between border-b border-fw-line bg-fw-paper/70 px-[38px] py-[18px] font-display backdrop-blur-xl lg:flex">
      <span className="pointer-events-auto flex items-center gap-[9px] text-[17px] font-bold tracking-[-0.03em] text-fw-ink">
        <GhostMark size={26} />
        larpwallet<span className="fw-grad-text -ml-[7px]">.</span>
      </span>
      <nav className="pointer-events-auto flex items-center gap-[22px] text-[14px] text-fw-ink-2">
        <TourButton />
        <a href="/brand" className="transition-colors hover:text-fw-ink">
          brand
        </a>
        <span className="italic text-fw-mute">deeply unofficial</span>
        <SocialIcons />
        <ThemeToggle />
      </nav>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden justify-between px-[38px] py-[24px] font-display text-[12.5px] text-fw-mute/70 lg:flex">
      <span>a ui clone. not affiliated with any wallet.</span>
      <span className="font-mono italic">larp it till u make it</span>
    </footer>
  );
}
