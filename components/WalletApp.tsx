"use client";

import { useRef, useState } from "react";
import { useWallet } from "@/lib/store";
import type { Token } from "@/lib/types";
import { AccountsSheet } from "./AccountsSheet";
import { AdminScreen } from "./AdminScreen";
import { HomeScreen } from "./HomeScreen";
import { InstallPrompt } from "./InstallPrompt";
import { PlusIcon, SearchIcon } from "./icons";
import { PullToRefresh } from "./PullToRefresh";
import { SideDrawer } from "./SideDrawer";
import { TokenDetail } from "./TokenDetail";
import { TopTabs, type Tab } from "./TopTabs";

export function WalletApp() {
  const { state, account, ready, refreshPrices } = useWallet();
  const [tab, setTab] = useState<Tab>("Home");
  const [drawer, setDrawer] = useState(false);
  const [accounts, setAccounts] = useState(false);
  const [token, setToken] = useState<Token | null>(null);
  const [admin, setAdmin] = useState(false);

  // Second secret door: 5 taps on the search bar (works from any tab).
  const taps = useRef<number[]>([]);
  const onSearchTap = () => {
    const now = Date.now();
    taps.current = [...taps.current, now].filter((t) => now - t < 1500);
    if (taps.current.length >= 5) {
      taps.current = [];
      setAdmin(true);
    }
  };

  // Keep the open token sheet in sync with edits made in the admin screen.
  const liveToken = token
    ? (account.tokens.find((t) => t.id === token.id) ?? null)
    : null;

  return (
    <div
      className={`mx-auto flex min-h-dvh w-full max-w-[520px] flex-col bg-ph-bg transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        // Phantom slides the wallet aside as a rounded card behind the drawer.
        drawer
          ? "origin-right scale-[0.93] overflow-hidden rounded-[26px]"
          : "origin-right scale-100"
      }`}
    >
      <header className="safe-t sticky top-0 z-30 bg-ph-bg">
        <TopTabs
          active={tab}
          onChange={setTab}
          avatar={state.avatar}
          onAvatar={() => setDrawer(true)}
        />
      </header>

      {/* only the content below the tab bar follows the pull */}
      <PullToRefresh onRefresh={refreshPrices}>
        <main className={ready ? "" : "opacity-0"}>
          {tab === "Home" ? (
            <HomeScreen
              onAccounts={() => setAccounts(true)}
              onToken={setToken}
              onSecret={() => setAdmin(true)}
            />
          ) : (
            <Placeholder tab={tab} />
          )}
        </main>
      </PullToRefresh>

      {/* --------------------------- bottom bar ---------------------------- */}
      <div className="safe-b fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[520px] bg-gradient-to-t from-black via-black/85 to-transparent px-[21px] pb-[14px] pt-8">
        <InstallPrompt />
        <div className="flex items-center gap-[15px]">
          <div
            onClick={onSearchTap}
            className="flex h-[46px] flex-1 items-center gap-[10px] rounded-full bg-[#1e1e1e]/95 px-[18px] backdrop-blur"
          >
            <SearchIcon className="h-[19px] w-[19px] text-[#8e9296]" />
            <span className="text-[17px] text-[#8e9296]">Search Phantom</span>
          </div>
          <button
            aria-label="New"
            className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-ph-purple active:opacity-80"
          >
            <PlusIcon className="h-[22px] w-[22px] text-black" />
          </button>
        </div>
      </div>

      <SideDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        onAccounts={() => setAccounts(true)}
      />
      <AccountsSheet
        open={accounts}
        onClose={() => setAccounts(false)}
        onAdd={() => {
          setAccounts(false);
          setAdmin(true);
        }}
      />
      <TokenDetail token={liveToken} onClose={() => setToken(null)} />
      <AdminScreen open={admin} onClose={() => setAdmin(false)} />
    </div>
  );
}

function Placeholder({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-40 text-center">
      <div className="text-[30px] font-bold">{tab}</div>
      <p className="mt-2 max-w-[280px] text-[18px] text-ph-mute-2">
        Nothing here yet — the portfolio lives on the Home tab.
      </p>
    </div>
  );
}
