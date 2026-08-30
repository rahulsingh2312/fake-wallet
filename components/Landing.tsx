"use client";

import { useEffect, useRef, useState } from "react";
import { InstallHelpSheet, useInstall } from "./InstallPrompt";
import { TourButton } from "./Tour";

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

/** Phones open on the landing and step into the wallet from here.
 *
 * The attribute goes on <html> rather than into React state because the
 * pre-paint script in layout.tsx sets the very same one for home-screen
 * launches — one switch, whoever throws it. The event is what tells
 * LandingShell to mount the wallet full-screen. */
export const ENTER_APP_EVENT = "larp:enter-app";

function enterApp() {
  document.documentElement.setAttribute("data-view", "app");
  // The wallet is black; the browser chrome should follow it in.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", "#000000");
  window.dispatchEvent(new Event(ENTER_APP_EVENT));
  window.scrollTo(0, 0);
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
      // A fixed inset, not a percentage. The one-line footer is short enough
      // that a -12% bottom margin sat below it even with the page scrolled all
      // the way down, so it never crossed the threshold and never appeared.
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
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

/** X and Telegram. Both are live accounts now, so these actually go
 * somewhere — they used to be muted "coming soon" placeholders. */
const SOCIALS = [
  {
    name: "X",
    href: "https://x.com/LarpWalletSol",
    path: "M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z",
    size: 16,
  },
  {
    name: "Telegram",
    href: "https://t.me/larpwalletfun",
    path: "M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.9.9l-5.2-3.9-2.5 2.4c-.3.3-.5.5-1 .5l.3-5.1L18 5.9c.5-.4-.1-.6-.7-.3L6.3 12.5 1.2 11c-1.1-.3-1.1-1.1.2-1.6L20.5 2.6c.9-.3 1.7.2 1.4 1.7Z",
    size: 17,
  },
];

function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-[14px] text-fw-mute ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.name}
          className="transition-colors hover:text-fw-violet"
        >
          <svg viewBox="0 0 24 24" width={s.size} height={s.size} fill="currentColor">
            <path d={s.path} />
          </svg>
        </a>
      ))}
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

type NavItem = {
  label: string;
  to: string;
  menu?: { t: string; d: string; to?: string; href?: string }[];
};

const NAV: NavItem[] = [
  {
    label: "Features",
    to: "tools",
    menu: [
      { t: "Balances", d: "any number you like", to: "tools" },
      { t: "Cope Markets", d: "bet on your own comeback", to: "tools" },
      { t: "Perps", d: "losses you never took", to: "tools" },
      { t: "Group chat terminal", d: "one screenshot, straight there", to: "tools" },
    ],
  },
  {
    label: "Cope",
    to: "security",
    menu: [
      { t: "Self-larped", d: "nothing here to drain", to: "security" },
      { t: "0/7 support", d: "nobody is coming", to: "security" },
      { t: "Scam detection", d: "detects one (1) scam", to: "security" },
    ],
  },
  { label: "Explore", to: "money" },
  {
    label: "Company",
    to: "get-started",
    menu: [
      { t: "Brand kit", d: "the mark, the card, the palette", href: "/brand" },
      { t: "Careers", d: "there are no jobs" },
      { t: "Press", d: "nobody has called" },
    ],
  },
];

/**
 * phantom.com's nav items open a floating panel on hover. Ours do the same —
 * there is nothing real to put behind them, so they carry the joke instead,
 * and every row still lands you somewhere on the page.
 *
 * Hover opens it; focus does too, so it is reachable without a mouse.
 */
function NavMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const close = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(close.current);
    setOpen(true);
  };
  // A grace period, or the panel vanishes while the pointer travels to it.
  const hide = () => {
    window.clearTimeout(close.current);
    close.current = window.setTimeout(() => setOpen(false), 130);
  };

  useEffect(() => () => window.clearTimeout(close.current), []);

  if (!item.menu) {
    return (
      <button
        onClick={() => goTo(item.to)}
        className="flex items-center gap-[5px] rounded-full px-[16px] py-[9px] transition-colors hover:bg-fw-ground"
      >
        {item.label}
      </button>
    );
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        onClick={() => goTo(item.to)}
        onFocus={show}
        onBlur={hide}
        aria-expanded={open}
        className={`flex items-center gap-[5px] rounded-full px-[16px] py-[9px] transition-colors ${
          open ? "bg-fw-ground" : "hover:bg-fw-ground"
        }`}
      >
        {item.label}
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <Chev />
        </span>
      </button>

      <div
        className={`absolute left-1/2 top-[calc(100%+10px)] w-[290px] -translate-x-1/2 origin-top rounded-[20px] border border-fw-line bg-fw-paper p-[8px] shadow-[0_20px_50px_-20px_rgba(60,49,91,0.4)] transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-[6px] scale-[0.97] opacity-0"
        }`}
      >
        {item.menu.map((m) =>
          m.href ? (
            <a
              key={m.t}
              href={m.href}
              className="block rounded-[14px] px-[14px] py-[11px] text-left transition-colors hover:bg-fw-ground"
            >
              <span className="block ph-sm font-medium text-fw-ink">{m.t}</span>
              <span className="mt-[2px] block ph-xs text-fw-mute">{m.d}</span>
            </a>
          ) : (
            <button
              key={m.t}
              onClick={() => {
                setOpen(false);
                if (m.to) goTo(m.to);
              }}
              className="block w-full rounded-[14px] px-[14px] py-[11px] text-left transition-colors hover:bg-fw-ground"
            >
              <span className="block ph-sm font-medium text-fw-ink">{m.t}</span>
              <span className="mt-[2px] block ph-xs text-fw-mute">{m.d}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

/**
 * phantom.com's nav: wordmark hard left, a floating white pill of links dead
 * centre, utilities hard right. Sticky rather than absolute now that the page
 * scrolls under it.
 */
export function LandingTopBar() {
  // Transparent over the lavender ground at rest, but the dark hero and
  // get-started panels scroll underneath it — and the wordmark is dark ink, so
  // without a ground of its own it disappears against them.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-landing-view
      className={`pointer-events-none sticky top-0 z-30 flex items-center justify-between gap-[20px] px-[14px] py-[12px] font-display transition-colors duration-200 lg:px-[20px] lg:py-[16px] ${
        scrolled ? "bg-fw-ground/85 backdrop-blur-xl" : ""
      }`}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="pointer-events-auto flex shrink-0 items-center gap-[8px] text-[17px] font-bold tracking-[-0.03em] text-fw-ink lg:gap-[9px] lg:text-[19px]"
      >
        <GhostMark size={27} />
        larpwallet<span className="fw-grad-text -ml-[7px]">.</span>
      </button>

      <nav className="pointer-events-auto relative z-10 hidden items-center gap-[4px] rounded-full bg-fw-paper px-[10px] py-[7px] ph-sm text-fw-ink lg:flex">
        {NAV.map((n) => (
          <NavMenu key={n.label} item={n} />
        ))}
        <TourButton className="rounded-full px-[16px] py-[9px] transition-colors hover:bg-fw-ground" label="Support" />
      </nav>

      <span className="pointer-events-auto flex shrink-0 items-center gap-[10px]">
        <span className="hidden ph-sm italic text-fw-mute lg:inline">
          deeply unofficial
        </span>
        {/* phones get the one action that matters; desktop already has the
            wallet on screen, so its button just scrolls to the install steps.
            The wrappers do the switching — Pill sets its own `inline-flex`,
            which would fight a `hidden` on the button itself. */}
        <span className="flex items-center gap-[8px] lg:hidden">
          <Pill tone="violet" onClick={enterApp} className="!px-[16px] !py-[10px]">
            Enter app
          </Pill>
          <MobileMenu />
        </span>
        <span className="hidden lg:block">
          <Pill tone="violet" onClick={() => goTo("get-started")} className="!px-[24px] !py-[12px]">
            Download
          </Pill>
        </span>
      </span>
    </header>
  );
}

/**
 * phantom.com collapses its whole nav behind a hamburger on phones, so this
 * does the same: the same four sections, plus the socials and the one button
 * that matters. Locks the page behind it while open, and Escape closes it.
 */
function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // The sheet scrolls on its own; the page behind it should not.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const jump = (id: string) => {
    setOpen(false);
    // Let the sheet close and the scroll lock lift before moving the page.
    window.setTimeout(() => goTo(id), 60);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className="grid h-[42px] w-[42px] place-items-center rounded-full bg-fw-paper text-fw-ink"
      >
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
        </svg>
      </button>

      <div
        // `invisible`, not just opacity-0: a transparent-but-present overlay
        // keeps its buttons in the tab order and in hit-testing, so the closed
        // menu was still reachable by keyboard and still swallowed taps.
        className={`fixed inset-0 z-50 bg-fw-ground transition-opacity duration-200 ${
          open ? "opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-[14px] py-[12px]">
          <span className="flex items-center gap-[8px] text-[17px] font-bold tracking-[-0.03em] text-fw-ink">
            <GhostMark size={27} />
            larpwallet<span className="fw-grad-text -ml-[7px]">.</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="grid h-[42px] w-[42px] place-items-center rounded-full bg-fw-paper text-fw-ink"
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-[20px] pt-[18px]">
          {NAV.map((n) => (
            <button
              key={n.label}
              onClick={() => jump(n.to)}
              className="border-b border-fw-line py-[18px] text-left ph-h4 text-fw-ink"
            >
              {n.label}
            </button>
          ))}
          <span className="border-b border-fw-line py-[18px] ph-h4 text-fw-ink">
            <TourButton label="Support" className="ph-h4" />
          </span>
        </nav>

        <div className="px-[20px] pt-[26px]">
          <button
            onClick={() => {
              setOpen(false);
              enterApp();
            }}
            className="w-full rounded-full bg-fw-violet px-[24px] py-[16px] text-[16px] font-medium text-[#241450] active:scale-[0.985]"
          >
            Enter app
          </button>
          <div className="mt-[22px] flex items-center justify-between">
            <SocialIcons />
            <span className="ph-sm italic text-fw-mute">deeply unofficial</span>
          </div>
        </div>
      </div>
    </>
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
      <MobileHero />

      <div className="contents lg:relative lg:isolate lg:grid lg:min-h-[calc(100dvh-96px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-[clamp(24px,3.5vw,72px)] lg:overflow-hidden lg:rounded-[32px] lg:bg-fw-night lg:px-[clamp(32px,4.4vw,76px)] lg:py-[44px]">
        <div className="hidden lg:contents">
          <HeroVideo on="desktop" />
        </div>

        <div className="hidden font-display lg:flex lg:min-w-0 lg:flex-col lg:items-start">
          <span className="reveal reveal-1 ph-lead text-[#e9e4ff]/80 [text-shadow:0_2px_20px_rgba(8,4,22,0.85)]">
            the money app that&rsquo;ll take you screenshots
          </span>

          <h1 className="reveal reveal-2 ph-h2 mt-[18px] text-fw-cream [text-shadow:0_2px_20px_rgba(8,4,22,0.85)]">
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

          <p className="reveal reveal-5 ph-body mt-[26px] max-w-[440px] text-[#e9e4ff]/80 [text-shadow:0_2px_20px_rgba(8,4,22,0.85)]">
            pixel-perfect wallet ui. live jupiter prices. the gains are fake,
            the screenshot isn&rsquo;t.
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

/**
 * The phone version of the hero. phantom.com on mobile is a single column: a
 * tall rounded card carrying the film, the headline sitting on it, and the one
 * button that matters underneath. Same here — except the button enters the
 * wallet rather than sending you to an app store, and the only other thing
 * offered is the home-screen install, because that IS the product on a phone.
 */
function MobileHero() {
  const { standalone, install, help, setHelp, platform } = useInstall();

  return (
    <section data-landing-view className="px-[14px] pb-[8px] font-display lg:hidden">
      <div className="relative isolate flex min-h-[74dvh] flex-col justify-end overflow-hidden rounded-[26px] bg-fw-night px-[22px] pb-[26px] pt-[46px]">
        <HeroVideo on="mobile" />

        <span className="ph-sm text-[#e9e4ff]/85 [text-shadow:0_2px_20px_rgba(8,4,22,0.85)]">
          the money app that&rsquo;ll take you screenshots
        </span>
        <h1 className="ph-h2 mt-[10px] text-fw-cream [text-shadow:0_2px_20px_rgba(8,4,22,0.85)]">
          Your home for larping, to crack, to charge KOL fee, and sell courses
        </h1>

        <div className="mt-[24px] flex flex-col gap-[10px]">
          <button
            onClick={enterApp}
            className="w-full rounded-full bg-fw-lilac px-[24px] py-[16px] text-[16px] font-medium text-[#3c315b] transition-transform duration-200 active:scale-[0.985]"
          >
            Enter app
          </button>

          {!standalone && (
            <button
              onClick={install}
              className="flex w-full items-center justify-center gap-[9px] rounded-full border border-white/20 px-[24px] py-[16px] text-[16px] font-medium text-fw-cream transition-colors active:bg-white/10"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3M8 7l4-4 4 4" />
                <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
              </svg>
              Add to home screen
            </button>
          )}
        </div>

        <p className="ph-sm mt-[16px] text-[#e9e4ff]/70 [text-shadow:0_2px_20px_rgba(8,4,22,0.85)]">
          pixel-perfect wallet ui. live jupiter prices. the gains are fake, the
          screenshot isn&rsquo;t.
        </p>
      </div>

      <InstallHelpSheet open={help} onClose={() => setHelp(false)} platform={platform} />
    </section>
  );
}

/**
 * phantom.com's own hero film, self-hosted rather than hotlinked off their
 * CDN. It is 360x550, so it upscales soft — which is fine, it is abstract
 * gradient work and it reads as ambient wash behind the type, not as detail.
 * Held down by a scrim so the headline always clears it.
 *
 * Honours prefers-reduced-motion by falling back to the poster frame: an
 * autoplaying 16s loop is exactly what that setting is asking us not to do.
 */
function HeroVideo({
  on,
}: {
  /** Which hero this instance belongs to. Both heroes are in the DOM at all
   * times and CSS hides the wrong one — but a display:none <video> still
   * downloads, so the file would land twice, and on phones one of those is
   * 1.1MB spent on a card nobody can see. Only the live one gets a src. */
  on: "mobile" | "desktop";
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const lead = useRef<HTMLVideoElement>(null);
  const echo = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  const [still, setStill] = useState(false);

  // Push the right-hand copy half a loop ahead, so the two sides are never
  // showing the same moment and the overlap reads as one continuous field
  // rather than a reflection. Drift between them is harmless here — that is
  // the point of offsetting rather than mirroring.
  useEffect(() => {
    if (on !== "desktop" || !live) return;
    const b = echo.current;
    if (!b) return;
    const offset = () => {
      if (b.duration && Number.isFinite(b.duration)) b.currentTime = b.duration / 2;
    };
    if (b.readyState >= 1) offset();
    else b.addEventListener("loadedmetadata", offset, { once: true });
    return () => b.removeEventListener("loadedmetadata", offset);
  }, [on, live]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      wrap.current?.querySelectorAll("video").forEach((v) => v.pause());
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setLive(on === "desktop" ? mq.matches : !mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [on]);

  /**
   * Ask for playback rather than relying on the attribute.
   *
   * `src` and `autoPlay` are both withheld until `live`, which only becomes
   * true in an effect — and `autoplay` governs playback at load time, so
   * setting it after React has already made the element is unreliable. Desktop
   * Chrome starts anyway; mobile Safari does not, which is why the film ran on
   * laptops and sat on its poster frame on phones.
   *
   * `muted` is assigned imperatively too: React does not always reflect it to
   * the property, and an unmuted video is refused autoplay outright on iOS.
   * A rejected play() is fine — Low Power Mode refuses regardless, and the
   * poster is a perfectly good still.
   */
  useEffect(() => {
    if (!live || still) return;
    const vids = Array.from(wrap.current?.querySelectorAll("video") ?? []);
    const starts = vids.map((v) => {
      const go = () => {
        v.muted = true;
        void v.play().catch(() => {});
      };
      go();
      v.addEventListener("canplay", go);
      v.addEventListener("loadeddata", go);
      return () => {
        v.removeEventListener("canplay", go);
        v.removeEventListener("loadeddata", go);
      };
    });
    return () => starts.forEach((off) => off());
  }, [live, still]);

  const film = {
    src: live ? "/brand/hero.mp4" : undefined,
    poster: "/brand/hero-poster.jpg",
    autoPlay: live && !still,
    muted: true,
    loop: true,
    playsInline: true,
    // "auto", not "metadata": WebKit will happily sit on a metadata-only load
    // and never start, and this file is the hero — if it is not playing it is
    // not doing its job.
    preload: "auto" as const,
  };

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {on === "desktop" ? (
        // Two overlapping copies, each cover-cropped over about 58% of the
        // card. The film is 360x550 portrait and the card is nearly twice as
        // wide as it is tall, so one copy stretched across the whole thing
        // would crop away about two thirds of the frame; split like this it
        // loses roughly a fifth. The second copy runs half a loop behind the
        // first and the two are feathered into each other, so there is no seam
        // and none of the mirror symmetry that reads as a mistake. All film,
        // no blurred stand-in.
        <>
          <video
            ref={lead}
            {...film}
            className="absolute inset-y-0 left-0 h-full w-[58%] object-cover brightness-[1.3] saturate-[1.2]"
            style={{
              maskImage: "linear-gradient(to right, #000 62%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, #000 62%, transparent 100%)",
            }}
          />
          <video
            ref={echo}
            {...film}
            className="absolute inset-y-0 right-0 h-full w-[58%] object-cover brightness-[1.3] saturate-[1.2]"
            style={{
              maskImage: "linear-gradient(to left, #000 62%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, #000 62%, transparent 100%)",
            }}
          />
        </>
      ) : (
        // A phone card is nearly the film's own shape, so cover barely crops.
        <video {...film} className="h-full w-full object-cover brightness-[1.3] saturate-[1.2]" />
      )}

      <div
        className={
          on === "desktop"
            ? "absolute inset-0 bg-gradient-to-r from-fw-night/80 via-fw-night/35 to-transparent"
            : "absolute inset-0 bg-gradient-to-t from-fw-night/85 via-fw-night/35 to-transparent"
        }
      />
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
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

/**
 * Desktop puts the live wallet in the hero as its art. On a phone that same
 * wallet IS the screen once you tap through, so it can't also sit in the
 * landing — this is a still of it in a device instead, which is on-brand for
 * a thing whose entire output is a screenshot.
 */
function PhonePreview() {
  return (
    <section data-landing-view className="px-[20px] pt-[86px] font-display lg:hidden">
      <Reveal>
        <span className="ph-xs font-mono uppercase tracking-[0.2em] text-fw-mute">
          the whole product
        </span>
        <h2 className="ph-h2 mt-[10px] max-w-[15ch] text-fw-ink">
          It is just a <span className="text-fw-violet">wallet</span>.
        </h2>
        <p className="ph-body mt-[12px] text-fw-mute">
          except the balance is whatever you type, and the prices are real.
        </p>
      </Reveal>

      <Reveal delay={90}>
        <div className="mx-auto mt-[30px] w-[258px]">
          {/* Same titanium rail and 60/50px radii as the real device frame on
              desktop, at the size a phone can actually show. */}
          {/* The rail's gradient runs light at top-left to near-black at
              bottom-right, which against a black screenshot made the right and
              bottom edges vanish — it read as the app spilling out of the
              frame. The screen carries a light hairline of its own now, so the
              boundary is drawn on all four sides regardless of the gradient. */}
          <div className="rounded-[40px] bg-[linear-gradient(158deg,#b4b4bd_0%,#6b6b74_8%,#3a3a42_24%,#2a2a31_50%,#3a3a42_74%,#74747e_92%,#bcbcc6_100%)] p-[7px] shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset,0_1.5px_1px_rgba(255,255,255,0.30)_inset,0_-1px_1px_rgba(0,0,0,0.5)_inset,0_26px_50px_-20px_rgba(60,49,91,0.5)]">
            <div className="relative overflow-hidden rounded-[34px] bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.14)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/app-preview.jpg"
                alt="the larp wallet home screen, showing a portfolio balance"
                width={824}
                height={1742}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <button
          onClick={enterApp}
          className="mx-auto mt-[24px] block rounded-full bg-fw-lilac px-[26px] py-[14px] ph-sm font-medium text-[#3c315b] active:scale-[0.985]"
        >
          Open the real thing
        </button>
      </Reveal>
    </section>
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
      <h2 className="ph-h2 mt-[10px] max-w-[15ch] text-fw-ink md:mt-[16px]">{children}</h2>
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
    <div data-landing-view className="font-display">
      <PhonePreview />

      {/* ── tools ── */}
      <section id="tools" className="scroll-mt-[80px] px-[20px] pt-[86px] md:px-[clamp(32px,5vw,84px)] lg:scroll-mt-[96px] lg:pt-[140px]">
        <SectionHead eyebrow="larping">
          Larping tools for <span className="text-fw-violet">everyone</span>
        </SectionHead>

        <Reveal>
          <div className="no-scrollbar -mx-[20px] mt-[28px] flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-[20px] pb-[10px] md:mx-0 md:mt-[44px] md:gap-[18px] md:px-0">
            {TOOLS.map((t) => (
              <div key={t.t} className="w-[272px] shrink-0 snap-start md:w-[326px]">
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
      <section id="money" className="scroll-mt-[80px] px-[20px] pt-[96px] md:px-[clamp(32px,5vw,84px)] lg:scroll-mt-[96px] lg:pt-[150px]">
        <SectionHead eyebrow="move money">
          Crack, Charge, &amp; <span className="text-fw-violet">Sell</span>
        </SectionHead>

        <Reveal delay={80}>
          <p className="ph-lead mt-[20px] max-w-[560px] text-fw-mute">
            one home for money you do not have. move it, flex it, and charge
            for the privilege of watching.
          </p>
        </Reveal>

        <div className="mt-[28px] grid grid-cols-1 gap-[14px] md:mt-[44px] md:grid-cols-3 md:gap-[18px]">
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
      <section id="security" className="scroll-mt-[80px] px-[20px] pt-[96px] md:px-[clamp(32px,5vw,84px)] lg:scroll-mt-[96px] lg:pt-[150px]">
        <SectionHead eyebrow="your security">
          Controlled by you, believed by{" "}
          <span className="text-fw-violet">them</span>
        </SectionHead>

        <div className="mt-[28px] grid grid-cols-1 gap-[14px] md:mt-[44px] md:grid-cols-2 md:gap-[18px]">
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
      <section className="px-[20px] pt-[96px] md:px-[clamp(32px,5vw,84px)] lg:pt-[150px]">
        <Reveal>
          <p className="ph-h3 mx-auto max-w-[24ch] text-center text-fw-ink">
            Trusted by a community of{" "}
            <span className="fw-grad-text font-medium">0 verified</span> users.
            It&rsquo;s less than a wallet.
          </p>
        </Reveal>
      </section>

      {/* ── get started ── */}
      <section id="get-started" className="scroll-mt-[80px] px-[20px] pt-[96px] md:px-[clamp(32px,5vw,84px)] lg:scroll-mt-[96px] lg:pt-[150px]">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[26px] bg-fw-night px-[22px] py-[44px] md:rounded-[32px] md:px-[clamp(32px,4.4vw,76px)] md:py-[72px]">
            <PanelArt />
            <span className="ph-xs font-mono uppercase tracking-[0.2em] text-[#e9e4ff]/50">
              get started.
            </span>
            <h2 className="ph-h2 mt-[16px] max-w-[13ch] text-fw-cream">
              Download larp wallet.
            </h2>

            <ol className="mt-[30px] grid grid-cols-1 gap-[14px] md:mt-[46px] md:grid-cols-3 md:gap-[18px]">
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
          <Card className="mt-[14px] flex flex-col items-start gap-[12px] p-[20px] md:mt-[18px] md:flex-row md:items-center md:gap-[16px] md:p-[24px]">
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

/** One line of links. The four-column version was a lot of scaffolding for a
 * site with three real destinations. */
const FOOTER_LINKS: { t: string; to?: string; href?: string }[] = [
  { t: "Features", to: "tools" },
  { t: "Explore", to: "money" },
  { t: "Cope", to: "security" },
  { t: "Download", to: "get-started" },
  { t: "Brand kit", href: "/brand" },
];

export function LandingFooter() {
  return (
    <footer
      data-landing-view
      className="px-[20px] pb-[34px] pt-[86px] font-display md:px-[clamp(32px,5vw,84px)] lg:pt-[130px]"
    >
      <Reveal>
        <div className="flex flex-col gap-[18px] border-t border-fw-line pt-[24px] md:flex-row md:items-center md:gap-[26px]">
          <span className="flex shrink-0 items-center gap-[8px] text-[17px] font-bold tracking-[-0.03em] text-fw-ink">
            <GhostMark size={24} />
            larpwallet<span className="fw-grad-text -ml-[6px]">.</span>
          </span>

          <nav className="flex flex-wrap items-center gap-x-[20px] gap-y-[8px] ph-sm text-fw-ink-2">
            {FOOTER_LINKS.map((l) =>
              l.href ? (
                <a key={l.t} href={l.href} className="transition-colors hover:text-fw-violet">
                  {l.t}
                </a>
              ) : (
                <button
                  key={l.t}
                  onClick={() => goTo(l.to!)}
                  className="transition-colors hover:text-fw-violet"
                >
                  {l.t}
                </button>
              )
            )}
          </nav>

          <SocialIcons className="md:ml-auto" />
        </div>

        <p className="mt-[18px] ph-xs text-fw-mute">
          a ui clone. not affiliated with any wallet. no keys, no wallet
          connect, no real money. © larp wallet 2026 &middot;{" "}
          <span className="font-mono italic">larp it till u make it</span>
        </p>
      </Reveal>
    </footer>
  );
}
