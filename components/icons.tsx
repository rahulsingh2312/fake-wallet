import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export const VerifiedBadge = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      fill="#ab9ff2"
      d="M12 1.5l2.4 1.75 2.94-.24 1.1 2.74 2.6 1.4-.5 2.9 1.7 2.43-1.98 2.2.17 2.95-2.86.75-1.6 2.48-2.82-.9-2.82.9-1.6-2.48-2.86-.75.17-2.95L1.06 12.5l1.7-2.43-.5-2.9 2.6-1.4 1.1-2.74 2.94.24L12 1.5z"
    />
    <path
      fill="#000"
      d="M10.9 15.6l-3.1-3.1 1.3-1.3 1.8 1.8 4.2-4.2 1.3 1.3-5.5 5.5z"
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
