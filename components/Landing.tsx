"use client";

import { useEffect, useRef, useState } from "react";
import { TourButton } from "./Tour";

const THEME_KEY = "larp-phantom:theme";

const URL = "larpwallet.online";

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

/** Smooth-scroll to one of the section anchors, for the nav and the CTAs. */
function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------- primitives ------------------------------ */

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

/**
 * Fades a block up the first time it crosses into view. The landing used to be
 * one fixed screen where everything could animate on load; it scrolls now, so
 * anything below the fold has to wait its turn or the animation is over before
 * you get there. Unobserves after firing — these never replay.
 */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-in");
        io.unobserve(el);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Raised card on the lavender ground. phantom's cards are flat cream with a
 * hairline, not the drop-shadowed glass the old landing used. */
function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-fw-line bg-fw-paper transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

/** Sun/moon toggle for the landing's light/dark theme. Writes data-theme on
 * <html> and localStorage; the inline script in layout.tsx applies a saved
 * choice before paint so there's no light-then-dark flash. Sits where
 * phantom.com puts its search button. */
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
      className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-fw-paper text-fw-ink transition-colors hover:text-fw-violet"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
          <circle cx="12" cy="12" r="4.5" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
        </svg>
      )}
    </button>
  );
}

/** X and Telegram — icons only, no accounts exist yet so they don't link
 * anywhere. Muted and non-navigating on purpose, same "not live yet" language
 * as the $LARP contract-address row. */
function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-[14px] text-fw-mute ${className}`}>
      <span title="coming soon" className="cursor-default opacity-60 transition-opacity hover:opacity-90">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
        </svg>
      </span>
      <span title="coming soon" className="cursor-default opacity-60 transition-opacity hover:opacity-90">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
          <path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.9.9l-5.2-3.9-2.5 2.4c-.3.3-.5.5-1 .5l.3-5.1L18 5.9c.5-.4-.1-.6-.7-.3L6.3 12.5 1.2 11c-1.1-.3-1.1-1.1.2-1.6L20.5 2.6c.9-.3 1.7.2 1.4 1.7Z" />
        </svg>
      </span>
    </span>
  );
}

/** Chevron on the nav's dropdown-looking items. They don't drop down — there's
 * nothing to put in them — they just scroll. */
function Chev() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" className="mt-[1px] opacity-70">
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Cream pill, phantom's primary button shape. */
function Pill({
  onClick,
  children,
  tone = "lilac",
  className = "",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  tone?: "lilac" | "violet";
  className?: string;
}) {
  const tones = {
    lilac: "bg-fw-lilac text-[#3c315b] hover:bg-[#d3cefd]",
    violet: "bg-fw-violet text-[#241450] hover:brightness-[1.04]",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-[10px] rounded-full px-[26px] py-[15px] ph-sm font-medium transition-all duration-200 active:scale-[0.985] ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

/** The domain, one tap away. Keeps the gold gradient — it's the one piece of
 * our own brand that survives the phantom paint job. */
function CopyDomain({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyText(`https://${URL}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      onClick={copy}
      className={`fw-btn-grad inline-flex items-center gap-[10px] rounded-full px-[24px] py-[15px] ph-sm font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <span className="font-mono">{copied ? "copied" : URL}</span>
      <span className="text-[#2a1c05]/50">{copied ? "✓" : "copy"}</span>
    </button>
  );
}

/* ---------------------------------- nav ---------------------------------- */

const NAV = [
  { label: "Features", to: "tools", chev: true },
  { label: "Cope", to: "security", chev: true },
  { label: "Explore", to: "money", chev: false },
  { label: "Company", to: "get-started", chev: true },
];

/**
 * phantom.com's nav: wordmark hard left, a floating white pill of links dead
 * centre, utilities hard right. Sticky rather than absolute now that the page
 * scrolls under it.
 */
export function LandingTopBar() {
  return (
    <header className="pointer-events-none sticky top-0 z-30 hidden items-center justify-between gap-[20px] px-[20px] py-[16px] font-display lg:flex">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="pointer-events-auto flex shrink-0 items-center gap-[9px] text-[19px] font-bold tracking-[-0.03em] text-fw-ink"
      >
        <GhostMark size={28} />
        larpwallet<span className="fw-grad-text -ml-[7px]">.</span>
      </button>

      <nav className="pointer-events-auto flex items-center gap-[4px] rounded-full bg-fw-paper px-[10px] py-[7px] ph-sm text-fw-ink">
        {NAV.map((n) => (
          <button
            key={n.label}
            onClick={() => goTo(n.to)}
            className="flex items-center gap-[5px] rounded-full px-[16px] py-[9px] transition-colors hover:bg-fw-ground"
          >
            {n.label}
            {n.chev && <Chev />}
          </button>
        ))}
        <TourButton className="rounded-full px-[16px] py-[9px] transition-colors hover:bg-fw-ground" label="Support" />
      </nav>

      <span className="pointer-events-auto flex shrink-0 items-center gap-[10px]">
        <span className="ph-sm italic text-fw-mute">deeply unofficial</span>
        <ThemeToggle />
        <Pill tone="violet" onClick={() => goTo("get-started")} className="!px-[24px] !py-[12px]">
          Download
        </Pill>
      </span>
    </header>
  );
}

/* ---------------------------------- hero --------------------------------- */

/**
 * phantom.com opens on one big rounded card inset from the page edges, with
 * flat overlapping circles behind cream type. Same shape here, except the
 * right half of the card is the real wallet — the product is the art.
 *
 * `contents` at base and a real box only from `lg` keeps phones on the old
 * deal: no landing at all, the wallet fills the screen.
 */
export function LandingHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="contents lg:block lg:px-[20px]">
      <div className="contents lg:relative lg:isolate lg:grid lg:min-h-[calc(100dvh-96px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-[clamp(24px,3.5vw,72px)] lg:overflow-hidden lg:rounded-[32px] lg:bg-fw-night lg:px-[clamp(32px,4.4vw,76px)] lg:py-[44px]">
        <HeroArt />

        <div className="hidden font-display lg:flex lg:min-w-0 lg:flex-col lg:items-start">
          <span className="reveal reveal-1 ph-lead text-[#e9e4ff]/70">
            the money app that&rsquo;ll take you screenshots
          </span>

          <h1 className="reveal reveal-2 ph-h2 mt-[18px] text-fw-cream">
            Your home for larping,
            <br />
            to crack, to charge KOL fee,
            <br />
            and sell courses
          </h1>

          <div className="reveal reveal-4 mt-[34px] flex flex-wrap items-center gap-[12px]">
            <Pill onClick={() => goTo("get-started")}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" className="-ml-[3px]">
                <rect x="6" y="2" width="12" height="20" rx="3.4" />
              </svg>
              Download larp wallet
            </Pill>
            <CopyDomain />
          </div>

          <p className="reveal reveal-5 ph-body mt-[26px] max-w-[440px] text-[#e9e4ff]/70">
            pixel-perfect wallet ui. live jupiter prices. the gains are fake,
            the screenshot isn&rsquo;t.
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

/** Flat overlapping circles, phantom's hero-art vocabulary, in our palette.
 * Hard-edged on purpose — the old landing's blurred blooms read as generic
 * SaaS gradient; these read as phantom. */
function HeroArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block">
      <div className="absolute -left-[18vw] -top-[26vh] h-[78vh] w-[78vh] rounded-full bg-[#3a2472]" />
      <div className="absolute -bottom-[52vh] left-[4vw] h-[72vh] w-[72vh] rounded-full bg-[#5b3fd0]/85" />
      <div className="absolute -right-[6vw] -top-[22vh] h-[64vh] w-[64vh] rounded-full bg-[#2b1b58]" />
      <div className="absolute -bottom-[30vh] -right-[10vw] h-[58vh] w-[58vh] rounded-full bg-[#c9962b]/25" />
      <div className="absolute right-[30vw] bottom-[-14vh] h-[34vh] w-[34vh] rounded-full bg-[#1f7a5a]/35" />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "74px 74px",
          maskImage: "radial-gradient(ellipse 90% 80% at 40% 50%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 40% 50%, #000 30%, transparent 80%)",
        }}
      />
    </div>
  );
}

/** Same circle vocabulary as the hero, sized to a short panel and scrimmed so
 * text stays legible over it. */
function PanelArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-[12%] -top-[70%] h-[220%] w-[52%] rounded-full bg-[#3a2472]" />
      <div className="absolute -bottom-[90%] right-[6%] h-[200%] w-[46%] rounded-full bg-[#5b3fd0]/55" />
      <div className="absolute -right-[10%] -top-[40%] h-[150%] w-[34%] rounded-full bg-[#c9962b]/12" />
      <div className="absolute inset-0 bg-fw-night/55" />
    </div>
  );
}

/* -------------------------------- sections ------------------------------- */

/** Section heading in phantom's shape: eyebrow, then a big 64px line where
 * one word carries the accent colour. */
function SectionHead({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <span className="ph-xs font-mono uppercase tracking-[0.2em] text-fw-mute">
        {eyebrow}
      </span>
      <h2 className="ph-h2 mt-[16px] max-w-[15ch] text-fw-ink">{children}</h2>
    </Reveal>
  );
}

/** Solid gold-on-violet glyphs — filled shapes read cleaner than thin
 * outlines at this size, so every icon is one shape plus a shaded overlay
 * rather than a stack of hairline strokes. The tile is #947de0, sampled
 * straight off the logo photo's own background, so it matches exactly. */
function StepIcon({ kind }: { kind: IconKind }) {
  return (
    <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] bg-[#947de0] text-[#f4c64e] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:scale-[1.08]">
      <Glyph kind={kind} />
    </span>
  );
}

type IconKind = "phone" | "tap" | "wealth" | "chart" | "cope" | "perps" | "chat";

function Glyph({ kind }: { kind: IconKind }) {
  switch (kind) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <rect x="6" y="2" width="12" height="20" rx="4" fill="currentColor" />
          <rect x="7.6" y="4.6" width="8.8" height="13.2" rx="1.4" fill="black" opacity="0.16" />
          <circle cx="12" cy="19.3" r="1.05" fill="black" opacity="0.32" />
        </svg>
      );
    case "tap":
      return (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <circle cx="9.5" cy="14.5" r="6" fill="currentColor" />
          <circle cx="9.5" cy="14.5" r="6" fill="black" opacity="0.08" />
          <circle cx="17" cy="7.2" r="2.3" fill="currentColor" opacity="0.6" />
          <circle cx="20.3" cy="11.6" r="1.4" fill="currentColor" opacity="0.35" />
        </svg>
      );
    case "wealth":
      return (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <circle cx="12" cy="12" r="9.5" fill="currentColor" />
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="black" strokeOpacity="0.16" strokeWidth="1.3" />
          <circle cx="12" cy="12" r="6.7" fill="none" stroke="black" strokeOpacity="0.16" strokeWidth="1" />
          <ellipse cx="9" cy="8.3" rx="3" ry="1.7" fill="white" opacity="0.28" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <rect x="3" y="13" width="4.4" height="8" rx="1.4" fill="currentColor" opacity="0.55" />
          <rect x="9.8" y="8" width="4.4" height="13" rx="1.4" fill="currentColor" opacity="0.8" />
          <rect x="16.6" y="3" width="4.4" height="18" rx="1.4" fill="currentColor" />
        </svg>
      );
    case "cope":
      return (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <circle cx="12" cy="12" r="9.5" fill="currentColor" />
          <circle cx="8.8" cy="10" r="1.3" fill="black" opacity="0.4" />
          <circle cx="15.2" cy="10" r="1.3" fill="black" opacity="0.4" />
          <path d="M8.4 16.6a4.6 4.6 0 0 1 7.2 0" fill="none" stroke="black" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "perps":
      return (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <path d="M3 17.5 9.2 11l3.6 3.4L21 5.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.6 5.6H21v5.3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <path d="M4 4h16a1.6 1.6 0 0 1 1.6 1.6v9.6A1.6 1.6 0 0 1 20 16.8H9.4L4.8 20.4A.7.7 0 0 1 3.7 19.8V5.6A1.6 1.6 0 0 1 4 4Z" fill="currentColor" />
          <rect x="6.6" y="8" width="10.8" height="1.7" rx="0.85" fill="black" opacity="0.28" />
          <rect x="6.6" y="11.4" width="7" height="1.7" rx="0.85" fill="black" opacity="0.28" />
        </svg>
      );
  }
}

const TOOLS: { icon: IconKind; t: string; d: string }[] = [
  { icon: "wealth", t: "Balances", d: "type any number. it's yours the moment you stop typing." },
  { icon: "chart", t: "Trending", d: "live jupiter prices, so the chart still moves while you screenshot it." },
  { icon: "cope", t: "Cope Markets", d: "take a position on your own comeback. nobody is filling it." },
  { icon: "perps", t: "Perps", d: "positions you never opened. losses you never took. size unlimited." },
  { icon: "chat", t: "Group Chat Terminal", d: "one screenshot, straight to where it actually counts." },
];

const MONEY: { t: string; d: string }[] = [
  { t: "Crack", d: "a number goes up. you did that. nobody can prove otherwise." },
  { t: "Charge KOL fee", d: "the portfolio is the pitch deck. the pitch deck is the portfolio." },
  { t: "Sell courses", d: "module one: how to get this exact screenshot. module two: there is no module two." },
];

const SECURITY: { t: string; d: string }[] = [
  { t: "Self-larped", d: "no keys, no seed phrase, no wallet connect. there is nothing here to drain." },
  { t: "0/7 support", d: "nobody is coming. that's the same as the real thing, to be fair." },
  { t: "Scam detection", d: "detects one (1) scam, reliably, every time you open it." },
  { t: "No ledger", d: "nothing to lose in a house fire. the numbers regenerate on reload." },
];

export function LandingSections() {
  return (
    <div className="hidden font-display lg:block">
      {/* ── tools ── */}
      <section id="tools" className="scroll-mt-[96px] px-[clamp(32px,5vw,84px)] pt-[140px]">
        <SectionHead eyebrow="larping">
          Larping tools for <span className="text-fw-violet">everyone</span>
        </SectionHead>

        <Reveal>
          <div className="no-scrollbar mt-[44px] flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-[10px]">
            {TOOLS.map((t) => (
              <div key={t.t} className="w-[326px] shrink-0 snap-start">
                <Card className="group h-full p-[26px] hover:-translate-y-[4px] hover:border-fw-violet/45">
                  <StepIcon kind={t.icon} />
                  <h3 className="ph-h5 mt-[22px] text-fw-ink">{t.t}</h3>
                  <p className="ph-body mt-[10px] text-fw-mute">{t.d}</p>
                </Card>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── money ── */}
      <section id="money" className="scroll-mt-[96px] px-[clamp(32px,5vw,84px)] pt-[150px]">
        <SectionHead eyebrow="move money">
          Crack, Charge, &amp; <span className="text-fw-violet">Sell</span>
        </SectionHead>

        <Reveal delay={80}>
          <p className="ph-lead mt-[20px] max-w-[560px] text-fw-mute">
            one home for money you do not have. move it, flex it, and charge
            for the privilege of watching.
          </p>
        </Reveal>

        <div className="mt-[44px] grid grid-cols-3 gap-[18px]">
          {MONEY.map((m, i) => (
            <Reveal key={m.t} delay={i * 80}>
              <Card className="h-full p-[28px]">
                <span className="ph-xs font-mono tabular-nums text-fw-violet">
                  0{i + 1}
                </span>
                <h3 className="ph-h4 mt-[14px] text-fw-ink">{m.t}</h3>
                <p className="ph-body mt-[10px] text-fw-mute">{m.d}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── security ── */}
      <section id="security" className="scroll-mt-[96px] px-[clamp(32px,5vw,84px)] pt-[150px]">
        <SectionHead eyebrow="your security">
          Controlled by you, believed by{" "}
          <span className="text-fw-violet">them</span>
        </SectionHead>

        <div className="mt-[44px] grid grid-cols-2 gap-[18px]">
          {SECURITY.map((s, i) => (
            <Reveal key={s.t} delay={i * 70}>
              <Card className="h-full p-[28px]">
                <h3 className="ph-h5 text-fw-ink">{s.t}</h3>
                <p className="ph-body mt-[10px] text-fw-mute">{s.d}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── callout ── */}
      <section className="px-[clamp(32px,5vw,84px)] pt-[150px]">
        <Reveal>
          <p className="ph-h3 mx-auto max-w-[24ch] text-center text-fw-ink">
            Trusted by a community of{" "}
            <span className="fw-grad-text font-medium">0 verified</span> users.
            It&rsquo;s less than a wallet.
          </p>
        </Reveal>
      </section>

      {/* ── get started ── */}
      <section id="get-started" className="scroll-mt-[96px] px-[clamp(32px,5vw,84px)] pt-[150px]">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[32px] bg-fw-night px-[clamp(32px,4.4vw,76px)] py-[72px]">
            <PanelArt />
            <span className="ph-xs font-mono uppercase tracking-[0.2em] text-[#e9e4ff]/50">
              get started.
            </span>
            <h2 className="ph-h2 mt-[16px] max-w-[13ch] text-fw-cream">
              Download larp wallet.
            </h2>

            <ol className="mt-[46px] grid grid-cols-3 gap-[18px]">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="group rounded-[24px] border border-white/10 bg-fw-night/70 p-[24px] backdrop-blur-sm transition-colors hover:border-fw-violet/45"
                >
                  <StepIcon kind={s.icon} />
                  <span className="mt-[20px] flex items-baseline gap-[9px]">
                    <span className="ph-xs font-mono tabular-nums text-fw-violet">
                      {s.n}
                    </span>
                    <span className="ph-h5 text-fw-cream">{s.t}</span>
                  </span>
                  <p className="ph-body mt-[8px] text-[#e9e4ff]/55">{s.d}</p>
                </li>
              ))}
            </ol>

            <div className="mt-[36px] flex flex-wrap items-center gap-[12px]">
              <CopyDomain />
              <span className="ph-sm text-[#e9e4ff]/45">
                open it on your phone. that&rsquo;s the whole install.
              </span>
            </div>
          </div>
        </Reveal>

        {/* $LARP */}
        <Reveal delay={80}>
          <Card className="mt-[18px] flex items-center gap-[16px] p-[24px]">
            <span className="fw-grad-text ph-h5 font-bold">$LARP</span>
            <span className="flex flex-1 items-center gap-[10px] rounded-[12px] border border-dashed border-fw-line bg-fw-ground px-[14px] py-[11px] font-mono ph-xs text-fw-mute">
              <span>contract address</span>
              <span className="ml-auto shrink-0 italic text-fw-mute/70">
                coming soon
              </span>
            </span>
          </Card>
        </Reveal>
      </section>
    </div>
  );
}

const STEPS: { n: string; icon: IconKind; t: string; d: string }[] = [
  { n: "01", icon: "phone", t: "add to home screen", d: "goes fullscreen, no browser bars." },
  { n: "02", icon: "tap", t: "hit + at the bottom right", d: "or tap the balance 5x fast, if you like secrets." },
  { n: "03", icon: "wealth", t: "type any number", d: "or paste a solana mint, jupiter fills the rest." },
];

/* --------------------------------- footer -------------------------------- */

const FOOTER: { head: string; items: { t: string; href?: string; onClick?: string }[] }[] = [
  {
    head: "Product",
    items: [
      { t: "Download", onClick: "get-started" },
      { t: "Brand kit", href: "/brand" },
      { t: "How it works", onClick: "tools" },
      { t: "Feature requests" },
    ],
  },
  {
    head: "Resources",
    items: [
      { t: "Explore", onClick: "money" },
      { t: "Cope", onClick: "security" },
      { t: "Blog" },
      { t: "Docs" },
      { t: "Taxes" },
    ],
  },
  {
    head: "Company",
    items: [{ t: "About" }, { t: "Careers" }, { t: "Press kit", href: "/brand" }, { t: "Merch" }],
  },
];

export function LandingFooter() {
  return (
    <footer className="hidden px-[clamp(32px,5vw,84px)] pb-[56px] pt-[150px] font-display lg:block">
      <Reveal>
        <div className="grid grid-cols-[1.4fr_repeat(3,1fr)_auto] gap-[24px] border-t border-fw-line pt-[44px]">
          <div>
            <span className="flex items-center gap-[9px] text-[19px] font-bold tracking-[-0.03em] text-fw-ink">
              <GhostMark size={28} />
              larpwallet<span className="fw-grad-text -ml-[7px]">.</span>
            </span>
            <p className="ph-body mt-[14px] max-w-[30ch] text-fw-mute">
              a ui clone. not affiliated with any wallet, and definitely not
              with the one it looks like.
            </p>
          </div>

          {FOOTER.map((col) => (
            <div key={col.head}>
              <span className="ph-xs font-mono uppercase tracking-[0.16em] text-fw-mute">
                {col.head}
              </span>
              <ul className="mt-[16px] flex flex-col gap-[10px] ph-sm text-fw-ink-2">
                {col.items.map((it) => (
                  <li key={it.t}>
                    {it.href ? (
                      <a href={it.href} className="transition-colors hover:text-fw-violet">
                        {it.t}
                      </a>
                    ) : it.onClick ? (
                      <button
                        onClick={() => goTo(it.onClick!)}
                        className="transition-colors hover:text-fw-violet"
                      >
                        {it.t}
                      </button>
                    ) : (
                      <span title="coming soon" className="cursor-default text-fw-mute/60">
                        {it.t}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <span className="ph-xs font-mono uppercase tracking-[0.16em] text-fw-mute">
              Socials
            </span>
            <SocialIcons className="mt-[16px]" />
          </div>
        </div>

        <div className="mt-[44px] flex items-center justify-between border-t border-fw-line pt-[22px] ph-xs text-fw-mute">
          <span>© larp wallet 2026 · no keys, no wallet connect, no real money.</span>
          <span className="font-mono italic">larp it till u make it</span>
        </div>
      </Reveal>
    </footer>
  );
}
