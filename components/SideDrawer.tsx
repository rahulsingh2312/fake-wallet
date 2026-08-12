"use client";

import { useEffect } from "react";
import { useWallet } from "@/lib/store";
import {
  ChatIcon,
  ChevronDown,
  ClockIcon,
  CopyIcon,
  GearIcon,
  HeartIcon,
  InfoIcon,
  PersonIcon,
} from "./icons";
import { Avatar } from "./ui";

export function SideDrawer({
  open,
  onClose,
  onAccounts,
}: {
  open: boolean;
  onClose: () => void;
  onAccounts: () => void;
}) {
  const { state, account } = useWallet();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="anim-fade absolute inset-0 bg-black/55" onClick={onClose} />

      <aside className="anim-drawer absolute inset-y-0 left-0 flex w-[75%] max-w-[380px] flex-col bg-black pt-[calc(env(safe-area-inset-top,0px)+var(--status-h,0px)+56px)]">
        <div className="flex items-start justify-between px-[26px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.avatar}
            alt=""
            className="h-[49px] w-[49px] rounded-full bg-ph-purple object-cover"
            draggable={false}
          />
          <button
            aria-label="Copy address"
            className="grid h-[44px] w-[44px] place-items-center rounded-full bg-[#191919] text-white active:opacity-70"
          >
            <CopyIcon className="h-[19px] w-[19px]" />
          </button>
        </div>

        <h1 className="mt-[18px] px-[26px] text-[34px] font-bold tracking-[-0.02em]">
          {state.username}
        </h1>

        <button
          onClick={() => {
            onClose();
            onAccounts();
          }}
          className="mt-[34px] flex items-center gap-[15px] px-[26px] py-[10px] text-left active:opacity-60"
        >
          <Avatar emoji={account.emoji} name={account.name} size={30} />
          <span className="text-[21px] font-medium">{account.name}</span>
          <ChevronDown className="h-[17px] w-[17px] text-white" />
        </button>

        <nav className="mt-[10px] flex flex-col">
          <Item icon={<PersonIcon className="h-[24px] w-[24px]" />} label="Profile" />
          <Item icon={<ChatIcon className="h-[24px] w-[24px]" />} label="Chats" />
          <Item icon={<HeartIcon className="h-[24px] w-[24px]" />} label="Watchlist" />
          <Item icon={<ClockIcon className="h-[24px] w-[24px]" />} label="History" />
        </nav>

        <div className="mt-auto flex flex-col pb-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+34px)]">
          <Item icon={<GearIcon className="h-[24px] w-[24px]" />} label="Settings" />
          <Item
            icon={<InfoIcon className="h-[24px] w-[24px]" />}
            label="Help & Support"
          />
        </div>
      </aside>
    </div>
  );
}

function Item({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-[19px] px-[26px] py-[15px] text-left text-white active:opacity-60">
      <span className="text-white">{icon}</span>
      <span className="text-[21px] font-medium">{label}</span>
    </button>
  );
}
