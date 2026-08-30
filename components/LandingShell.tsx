"use client";

import { useEffect, useState } from "react";
import { WalletProvider } from "@/lib/store";
import {
  ENTER_APP_EVENT,
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
 * One route, two experiences.
 *
 * From `lg` up this is a phantom.com-shaped marketing page — sticky nav, one
 * big rounded hero card with the live wallet sitting in it as the art, then
 * the sections and a column footer. Both halves are always on screen.
 *
 * Phones get the same page in one column, and step into the wallet through
 * "Enter app". `entered` only ever *adds* the wallet; hiding the landing is
 * done in CSS off `<html data-view="app">`, which the pre-paint script in
 * layout.tsx sets too — so launching from the home screen goes straight to the
 * wallet with no marketing page flashing past on the way.
 */
export function Landing() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Already "app" means the pre-paint script found a standalone launch.
    if (document.documentElement.getAttribute("data-view") === "app") {
      setEntered(true);
    }
    const onEnter = () => setEntered(true);
    window.addEventListener(ENTER_APP_EVENT, onEnter);
    return () => window.removeEventListener(ENTER_APP_EVENT, onEnter);
  }, []);

  return (
    <WalletProvider>
      {/* Lavender ground everywhere the landing shows. Only a phone that has
          entered the app goes black, and there the wallet paints it anyway. */}
      <div
        className={`relative min-h-dvh lg:bg-fw-ground ${
          entered ? "bg-black" : "bg-fw-ground"
        }`}
      >
        <Scene />
        <LandingTopBar />

        <LandingHero>
          {/* On phones the wallet is absent until you ask for it; on desktop
              it is the hero's art and always mounted. */}
          <div className={entered ? "contents" : "hidden lg:contents"}>
            <PhoneFrame>
              <WalletApp />
            </PhoneFrame>
          </div>
        </LandingHero>

        <LandingSections />
        <LandingFooter />
      </div>
      <RegisterSW />
    </WalletProvider>
  );
}
