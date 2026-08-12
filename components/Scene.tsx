"use client";

/**
 * Ambient backdrop for the desktop landing: two slow aurora blooms, a faint
 * grid, and a grain layer so the flat black does not read as dead space.
 * Desktop only, and it never takes pointer events.
 */
export function Scene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {/* aurora */}
      <div
        className="absolute -left-[14vw] top-[-18vh] h-[62vw] w-[62vw] rounded-full opacity-[0.5] blur-[100px] [animation:ph-float-a_26s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(171,159,242,0.30), transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[16vw] bottom-[-24vh] h-[58vw] w-[58vw] rounded-full opacity-[0.42] blur-[110px] [animation:ph-float-b_32s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(33,222,127,0.16), transparent 70%)",
        }}
      />

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "74px 74px",
          maskImage:
            "radial-gradient(ellipse 100% 72% at 50% 42%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 72% at 50% 42%, #000 35%, transparent 78%)",
        }}
      />

      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.28] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")",
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 82% 68% at 50% 45%, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </div>
  );
}
