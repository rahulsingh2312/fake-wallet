import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export const VerifiedBadge = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="#ab9ff2" d="M22.79 12C22.79 12.67 22.42 13.39 22.15 14.02C21.88 14.65 21.41 15.17 21.16 15.79C20.9 16.41 20.86 17.11 20.61 17.75C20.35 18.39 20.11 19.15 19.63 19.63C19.15 20.11 18.39 20.35 17.75 20.61C17.11 20.86 16.41 20.9 15.79 21.16C15.17 21.41 14.65 21.88 14.02 22.15C13.39 22.42 12.67 22.79 12 22.79C11.33 22.79 10.61 22.42 9.98 22.15C9.35 21.88 8.83 21.41 8.21 21.16C7.59 20.9 6.89 20.86 6.25 20.61C5.61 20.35 4.85 20.11 4.37 19.63C3.89 19.15 3.65 18.39 3.39 17.75C3.14 17.11 3.1 16.41 2.84 15.79C2.59 15.17 2.12 14.65 1.85 14.02C1.58 13.39 1.21 12.67 1.21 12C1.21 11.33 1.58 10.61 1.85 9.98C2.12 9.35 2.59 8.83 2.84 8.21C3.1 7.59 3.14 6.89 3.39 6.25C3.65 5.61 3.89 4.85 4.37 4.37C4.85 3.89 5.61 3.65 6.25 3.39C6.89 3.14 7.59 3.1 8.21 2.84C8.83 2.59 9.35 2.12 9.98 1.85C10.61 1.58 11.33 1.21 12 1.21C12.67 1.21 13.39 1.58 14.02 1.85C14.65 2.12 15.17 2.59 15.79 2.84C16.41 3.1 17.11 3.14 17.75 3.39C18.39 3.65 19.15 3.89 19.63 4.37C20.11 4.85 20.35 5.61 20.61 6.25C20.86 6.89 20.9 7.59 21.16 8.21C21.41 8.83 21.88 9.35 22.15 9.98C22.42 10.61 22.79 11.33 22.79 12Z" />
    <path
      d="M8.1 12 L10.8 14.7 L15.9 9.3"
      fill="none"
      stroke="#000"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M9 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
    <path
      d="M16.5 16.5L21 21"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export const DotsIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

/** Phantom's QR-ish "Receive" glyph */
export const QrIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="7.5" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="2" />
    <circle cx="16.5" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="2" />
    <circle cx="7.5" cy="16.5" r="2.6" stroke="currentColor" strokeWidth="2" />
    <path
      d="M14 15h2M18 15h2M14 18.5h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const SendIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M20.5 3.5L3.8 10.2c-.9.35-.85 1.65.07 1.94l6.3 1.98 1.98 6.3c.29.92 1.59.97 1.94.07L20.5 3.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M12 15V4m0 0L8 8m4-4l4 4"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

export const CopyIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <rect
      x="8.5"
      y="8.5"
      width="11"
      height="11"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M15.5 5.5a3 3 0 00-3-3h-6a4 4 0 00-4 4v6a3 3 0 003 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const PersonIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="2" />
    <path
      d="M4.5 20c.9-3.8 3.9-5.8 7.5-5.8s6.6 2 7.5 5.8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ChatIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H9l-5 3.5v-14z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M12 20.3l-1.5-1.35C5.4 14.36 2 11.28 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.78-3.4 6.86-8.5 11.45L12 20.3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7v5.2l3.4 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GearIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
    <path
      d="M19.4 13.5a7.6 7.6 0 000-3l1.9-1.4-2-3.4-2.2.9a7.6 7.6 0 00-2.6-1.5L14.2 2h-4l-.3 2.4a7.6 7.6 0 00-2.6 1.5l-2.2-.9-2 3.4 1.9 1.4a7.6 7.6 0 000 3l-1.9 1.4 2 3.4 2.2-.9a7.6 7.6 0 002.6 1.5l.3 2.4h4l.3-2.4a7.6 7.6 0 002.6-1.5l2.2.9 2-3.4-1.9-1.4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 11v5.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="7.8" r="1.2" fill="currentColor" />
  </svg>
);

export const CashIcon = (p: P) => (
  <svg viewBox="0 0 28 20" fill="none" {...p}>
    <rect
      x="1"
      y="1"
      width="26"
      height="18"
      rx="3"
      fill="#3f3f46"
      stroke="#52525b"
      strokeWidth="1.5"
    />
    <circle cx="14" cy="10" r="4.4" fill="#18181b" />
    <circle cx="5.5" cy="10" r="1.1" fill="#a1a1aa" />
    <circle cx="22.5" cy="10" r="1.1" fill="#a1a1aa" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M4 6.5h16M9.5 6.5V4.8A1.8 1.8 0 0111.3 3h1.4a1.8 1.8 0 011.8 1.8v1.7M6.5 6.5l.9 12.2A2.2 2.2 0 009.6 21h4.8a2.2 2.2 0 002.2-2.3l.9-12.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
