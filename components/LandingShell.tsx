"use client";

import { WalletProvider } from "@/lib/store";
import {
  LandingFooter,
  LandingHero,
  LandingSections,
  LandingTopBar,
} from "./Landing";
import { PhoneFrame } from "./PhoneFrame";
import { Scene } from "./Scene";
import { RegisterSW } from "./RegisterSW";
import { WalletApp } from "./WalletApp";

/**
 * One route, two experiences. Phones get nothing but the wallet — every
 * landing piece below is `hidden lg:…`, and LandingHero collapses to
 * `display: contents` so the phone frame still fills the screen.
 *
 * From `lg` up this is a phantom.com-shaped marketing page: sticky nav, one
 * big rounded hero card with the live wallet sitting in it as the art, then
 * the sections and a column footer underneath. It scrolls now — it used to be
 * a single locked viewport — so Scene is fixed rather than absolute, and the
 * top bar is sticky rather than pinned.
 */
export function Landing() {
  return (
    <WalletProvider>
      <div className="relative min-h-dvh bg-black lg:bg-fw-ground">
        <Scene />
        <LandingTopBar />

        <LandingHero>
          <PhoneFrame>
            <WalletApp />
          </PhoneFrame>
        </LandingHero>

        <LandingSections />
        <LandingFooter />
      </div>
      <RegisterSW />
    </WalletProvider>
  );
}
