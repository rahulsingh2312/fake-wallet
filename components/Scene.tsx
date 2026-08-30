"use client";

/**
 * Ambient backdrop for the desktop landing: two slow blooms and a faint grid.
 * Colours come from CSS vars (--scene-*, in globals.css) so ThemeToggle's
 * dark mode repaints this for free. The wallet keeps its own black screen,
 * so nothing here touches it. Desktop only, and it never takes pointer events.
 */
export function Scene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden lg:block"
    >
      {/* blooms */}
      <div
        className="absolute -left-[14vw] top-[-18vh] h-[62vw] w-[62vw] rounded-full opacity-[0.8] blur-[100px] [animation:ph-float-a_26s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(closest-side, var(--scene-bloom-a), transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[16vw] bottom-[-24vh] h-[58vw] w-[58vw] rounded-full opacity-[0.7] blur-[110px] [animation:ph-float-b_32s_ease-in-out_infinite]"
        style={{
          background: "radial-gradient(closest-side, var(--scene-bloom-b), transparent 70%)",
        }}
      />

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "linear-gradient(var(--scene-grid) 1px, transparent 1px), linear-gradient(90deg, var(--scene-grid) 1px, transparent 1px)",
          backgroundSize: "74px 74px",
          maskImage:
            "radial-gradient(ellipse 100% 72% at 50% 42%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 72% at 50% 42%, #000 35%, transparent 78%)",
        }}
      />

      {/* edge treatment: warm falloff on white, deepening vignette in dark mode */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 82% 68% at 50% 45%, transparent 40%, var(--scene-edge) 100%)",
        }}
      />
    </div>
  );
}
