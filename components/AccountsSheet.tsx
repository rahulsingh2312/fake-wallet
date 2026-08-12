"use client";

import { usdPrecise } from "@/lib/format";
import { accountTotal, useWallet } from "@/lib/store";
import { CheckIcon, CloseIcon, DotsIcon, PlusIcon, QrIcon } from "./icons";
import { Avatar, Sheet } from "./ui";

export function AccountsSheet({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}) {
  const { state, prices, setActiveAccount } = useWallet();

  return (
    <Sheet open={open} onClose={onClose} full>
      <div className="flex shrink-0 items-center gap-[14px] px-[21px] pb-[14px] pt-[6px]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-[40px] w-[40px] place-items-center rounded-full bg-[#191919] active:opacity-70"
        >
          <CloseIcon className="h-[17px] w-[17px] text-white" />
        </button>
        <h2 className="text-[21px] font-bold">
          Your Accounts
        </h2>
        <button
          onClick={onAdd}
          aria-label="Add account"
          className="ml-auto grid h-[40px] w-[40px] place-items-center rounded-full bg-[#191919] active:opacity-70"
        >
          <PlusIcon className="h-[17px] w-[17px] text-white" />
        </button>
      </div>

      <div className="sheet-scroll no-scrollbar flex-1 overflow-y-auto px-[21px] pb-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+40px)]">
        <div className="flex flex-col gap-[8.3px]">
          {state.accounts.map((a) => {
            const active = a.id === state.activeAccountId;
            return (
              <div
                key={a.id}
                onClick={() => {
                  setActiveAccount(a.id);
                  onClose();
                }}
                className="flex cursor-pointer items-center gap-[14px] rounded-[16px] bg-ph-card px-[20px] h-[67.8px] active:opacity-70"
              >
                <div className="relative">
                  <Avatar emoji={a.emoji} name={a.name} size={40} />
                  {active && (
                    <span className="absolute -bottom-0.5 -right-1 grid h-[17px] w-[17px] place-items-center rounded-full border-[2px] border-ph-card bg-ph-purple">
                      <CheckIcon className="h-[9px] w-[9px] text-black" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[17px] font-medium leading-[1.2]">
                    {a.name}
                  </div>
                  <div className="tnum text-[16.7px] leading-[1.25] text-white">
                    {usdPrecise(accountTotal(a, prices))}
                  </div>
                </div>

                <button
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Receive"
                  className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[12px] bg-[#232323] active:opacity-70"
                >
                  <QrIcon className="h-[20px] w-[20px] text-white" />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  aria-label="More"
                  className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[12px] bg-[#232323] active:opacity-70"
                >
                  <DotsIcon className="h-[17px] w-[17px] text-white" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}
