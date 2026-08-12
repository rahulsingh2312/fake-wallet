"use client";

import { WalletProvider } from "@/lib/store";
import {
  LandingFooter,
  LandingLeft,
  LandingRight,
  LandingTopBar,
} from "./Landing";
import { PhoneFrame } from "./PhoneFrame";
import { Scene } from "./Scene";
import { RegisterSW } from "./RegisterSW";
import { WalletApp } from "./WalletApp";

/**
 * One route, two experiences. Phones get nothing but the wallet. From `lg` up
 * the wallet moves into a device frame and the space either side becomes the
 * landing page.
 */
export function Landing() {
  return (
    <WalletProvider>
      <div className="relative min-h-dvh bg-black lg:grid lg:min-h-dvh lg:place-items-center lg:overflow-hidden">
        <Scene />
        <LandingTopBar />

        <div className="lg:flex lg:items-center lg:gap-[clamp(28px,4.4vw,84px)] lg:px-[38px] lg:py-[66px]">
          <div className="hidden lg:block">
            <LandingLeft />
          </div>

          <PhoneFrame>
            <WalletApp />
          </PhoneFrame>

          <div className="hidden lg:block">
            <LandingRight />
          </div>
        </div>

        <LandingFooter />
      </div>
      <RegisterSW />
    </WalletProvider>
  );
}
