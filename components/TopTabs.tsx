"use client";

const TABS = ["Home", "Trade", "Predict", "Explore", "Earn"] as const;
export type Tab = (typeof TABS)[number];

export function TopTabs({
  active,
  onChange,
  avatar,
  onAvatar,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  avatar: string;
  onAvatar: () => void;
}) {
  return (
    <div className="no-scrollbar flex items-center gap-[9px] overflow-x-auto px-[21px] pb-1 pt-2">
      <button
        onClick={onAvatar}
        aria-label="Open menu"
        className="h-[39px] w-[39px] shrink-0 overflow-hidden rounded-full bg-ph-purple active:opacity-70"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt="Profile"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </button>

      {TABS.map((t) => {
        const on = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`h-[41px] shrink-0 rounded-full px-[15px] text-[16px] font-medium transition-colors active:opacity-70 ${
              on ? "bg-ph-purple text-black" : "bg-[#191919] text-[#8e9296]"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
