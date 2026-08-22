"use client";

/**
 * Ambient backdrop for the desktop landing: two slow blooms and a faint grid,
 * tuned for the white page so the paper does not read as dead space. The
 * wallet keeps its own black screen, so nothing here touches it.
 * Desktop only, and it never takes pointer events.
 */
export function Scene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {/* blooms */}
      <div
        className="absolute -left-[14vw] top-[-18vh] h-[62vw] w-[62vw] rounded-full opacity-[0.75] blur-[100px] [animation:ph-float-a_26s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.20), transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[16vw] bottom-[-24vh] h-[58vw] w-[58vw] rounded-full opacity-[0.7] blur-[110px] [animation:ph-float-b_32s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(45,212,191,0.16), transparent 70%)",
        }}
      />

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,16,25,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(20,16,25,0.045) 1px, transparent 1px)",
          backgroundSize: "74px 74px",
          maskImage:
            "radial-gradient(ellipse 100% 72% at 50% 42%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 72% at 50% 42%, #000 35%, transparent 78%)",
        }}
      />

      {/* paper warmth at the edges, so pure white never meets the viewport edge */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 82% 68% at 50% 45%, transparent 45%, rgba(124,58,237,0.07) 100%)",
        }}
      />
    </div>
  );
}
