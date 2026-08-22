import type { Metadata } from "next";
import { Bricolage_Grotesque, Familjen_Grotesk, Martian_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--bk-display", display: "swap" });
const body = Familjen_Grotesk({ subsets: ["latin"], variable: "--bk-body", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--bk-mono", display: "swap" });

export const metadata: Metadata = {
  title: "fakewallet brand kit",
  description: "Marks, header, share card, favicon and palette for fakewallet.",
  robots: { index: false, follow: false },
};

const CSS = '\n.bk{--ink:#FFFFFF;--panel:#FBFAFF;--panel2:#F4F1FE;--line:#E7E2F5;--v200:#7C3AED;--v500:#8B5CF6;--mint:#0D9488;--tx:#141019;--mu:#6B6478;\nbackground:var(--ink);color:var(--tx);font-family:var(--bk-body),system-ui,sans-serif;font-size:17px;line-height:1.6;min-height:100vh;-webkit-font-smoothing:antialiased;}\n.bk *{box-sizing:border-box;}\n.bk .wrap{max-width:1080px;margin:0 auto;padding:64px 28px 120px;}\n.bk .eyebrow{font-family:var(--bk-mono),monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--mint);margin:0 0 18px;}\n.bk h1{font-family:var(--bk-display),Georgia,serif;font-weight:800;font-size:clamp(40px,7vw,74px);letter-spacing:-.035em;line-height:1.02;margin:0 0 16px;text-wrap:balance;}\n.bk h1 em{font-style:normal;color:var(--v200);}\n.bk .lede{font-size:20px;color:var(--mu);max-width:62ch;margin:0;}\n.bk section{margin-top:88px;}\n.bk h2{font-family:var(--bk-display),Georgia,serif;font-weight:700;font-size:30px;letter-spacing:-.02em;margin:0 0 10px;}\n.bk h2 .num{font-family:var(--bk-mono),monospace;font-size:12px;color:var(--v500);margin-right:12px;vertical-align:6px;}\n.bk .sub{color:var(--mu);margin:0 0 28px;max-width:66ch;}\n.bk .rule{height:1px;background:var(--line);border:0;margin:0 0 28px;}\n.bk .marks{display:flex;flex-direction:column;gap:18px;}\n.bk .mark{display:grid;grid-template-columns:190px 1fr;gap:28px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:22px;}\n.bk .mark.picked{border-color:#0D948855;background:linear-gradient(180deg,#FBFAFF,#F1FDFA);}\n.bk .mark-art img{width:100%;border-radius:14px;display:block;}\n.bk .mark h3{font-family:var(--bk-display),Georgia,serif;font-size:21px;margin:0 0 8px;letter-spacing:-.01em;}\n.bk .mark p{margin:0 0 8px;}\n.bk .note{color:var(--mu);font-size:15px;}\n.bk .badge{color:#FFFFFF;font-family:var(--bk-mono),monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;background:var(--mint);border-radius:99px;padding:3px 9px;margin-left:10px;vertical-align:3px;}\n.bk .scale{display:flex;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap;}\n.bk .scale img{border-radius:4px;}\n.bk .slabel{font-family:var(--bk-mono),monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mu);margin-right:4px;}\n.bk figure{margin:0 0 26px;}\n.bk figure img{width:100%;border-radius:16px;border:1px solid var(--line);display:block;}\n.bk figcaption{font-family:var(--bk-mono),monospace;font-size:11px;color:var(--mu);margin-top:10px;letter-spacing:.05em;}\n.bk .tab{display:inline-flex;align-items:center;gap:9px;background:var(--panel2);border:1px solid var(--line);border-radius:10px 10px 0 0;padding:9px 18px 9px 13px;font-size:14px;}\n.bk table{width:100%;border-collapse:collapse;font-size:16px;}\n.bk td,.bk th{text-align:left;padding:13px 12px;border-bottom:1px solid var(--line);}\n.bk th{font-family:var(--bk-mono),monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--mu);font-weight:400;}\n.bk .dm{font-family:var(--bk-mono),monospace;font-size:14px;}\n.bk .mu{color:var(--mu);}\n.bk .pill{font-family:var(--bk-mono),monospace;font-size:11px;padding:3px 10px;border-radius:99px;white-space:nowrap;}\n.bk .pill.open{background:#0D948814;color:var(--mint);border:1px solid #0D948840;}\n.bk .pill.taken{background:#6B647812;color:var(--mu);border:1px solid var(--line);}\n.bk .sw{display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--line);}\n.bk .chip{width:52px;height:52px;border-radius:12px;flex:none;box-shadow:inset 0 0 0 1px rgba(20,16,25,0.12);}\n.bk .sw b{font-weight:600;display:block;}\n.bk .sw .dm{margin-right:12px;color:var(--v200);}\n.bk pre{background:var(--panel2);border:1px solid var(--line);border-radius:14px;padding:20px;overflow-x:auto;font-family:var(--bk-mono),monospace;font-size:12.5px;line-height:1.9;color:#3B3550;margin:0;}\n.bk ol.steps{padding-left:0;list-style:none;counter-reset:s;margin:0;}\n.bk ol.steps li{counter-increment:s;padding:14px 0 14px 46px;position:relative;border-bottom:1px solid var(--line);}\n.bk ol.steps li::before{content:counter(s);position:absolute;left:0;top:14px;font-family:var(--bk-mono),monospace;font-size:11px;width:26px;height:26px;border-radius:8px;background:var(--v500);color:#fff;display:grid;place-items:center;}\n.bk .callout{border-left:3px solid var(--v500);background:#8B5CF60D;border-radius:0 12px 12px 0;padding:16px 20px;margin-top:24px;}\n.bk .callout b{color:var(--v200);}\n.bk a{color:var(--mint);}\n.bk a:focus-visible{outline:2px solid var(--mint);outline-offset:3px;border-radius:3px;}\n@media (max-width:720px){.bk .mark{grid-template-columns:1fr;}.bk .mark-art img{max-width:200px;}}\n';

export default function BrandPage() {
  return (
    <div className={`bk ${display.variable} ${body.variable} ${mono.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <p className="eyebrow">brand kit &middot; fakewallet.fun</p>
        <h1>Everything <em>fake</em> needs to look real.</h1>
        <p className="lede">A mark, a header, a share card and a favicon for fakewallet — plus the
        domain, checked and open. Built dark to match the app that&rsquo;s already shipped.</p>

        <section>
          <h2><span className="num">01</span>The mark</h2>
          <p className="sub">He drops the ghost — that shape belongs to Phantom, and it is the one asset that
          shouldn&rsquo;t follow this onto its own domain.</p>
          <hr className="rule" />
          <div className="marks">
        <article className="mark picked">
          <div className="mark-art"><img src="/brand/cat-badge.svg" alt="Pixelcat" /></div>
          <div>
            <h3>Pixelcat<span className="badge">picked</span></h3>
            <p>He is holding a card he has no intention of giving back. Iridescent coat, bright eyes, and a few pixels still coming loose behind his ear — the balance is not real, and he knows it.</p>
            <p className="note">Shipped: favicon, app icon, avatar and the mark in the top bar.</p>
            <div className="scale"><span className="slabel">at real size</span>
              <img src="/brand/cat-badge.svg" width={48} height={48} alt="" />
              <img src="/brand/cat-badge.svg" width={32} height={32} alt="" />
              <img src="/brand/cat-badge.svg" width={16} height={16} alt="" />
            </div>
          </div>
        </article>
          </div>
        </section>

        <section>
          <h2><span className="num">02</span>Header &amp; share card</h2>
          <p className="sub">The site ships zero Open Graph tags today, so every link posted anywhere
          renders as a bare grey box. This fixes that.</p>
          <hr className="rule" />
          <figure><img src="/brand/header.png" alt="X header" />
            <figcaption>header.png &mdash; 1500&times;500. Lockup is centred so the avatar never covers it.</figcaption></figure>
          <figure><img src="/brand/og.png" alt="Open Graph card" />
            <figcaption>og.png &mdash; 1200&times;630. Link preview for X, Discord, Telegram, iMessage.</figcaption></figure>
        </section>

        <section>
          <h2><span className="num">03</span>Favicon</h2>
          <p className="sub">Chunkier pixels than the full mark, so it survives at 16px.</p>
          <hr className="rule" />
          <div className="tab"><img src="/brand/icon.svg" width={16} height={16} alt="" /> fakewallet</div>
          <div className="scale" style={{ marginTop: 22 }}>
            <span className="slabel">16 / 32 / 96</span>
            <img src="/brand/icon.svg" width={16} height={16} alt="" />
            <img src="/brand/icon.svg" width={32} height={32} alt="" />
            <img src="/brand/icon.svg" width={96} height={96} alt="" />
          </div>
        </section>

        <section>
          <h2><span className="num">04</span>Palette</h2>
          <p className="sub">One gradient, the exact stops from the &ldquo;Run it up&rdquo; button on sol.copycat.my.
          It is pastel by design, so it needs a dark ground to read — which is why every mark and icon sits on a
          #171320 tile. On white it is deepened along the same hue sequence rather than swapped for other colours.
          It never appears inside the wallet: that screen keeps Phantom&rsquo;s purple so the screenshots still match.</p>
          <hr className="rule" />
        <div className="sw"><div className="chip" style={{background:"#b6f2d8"}} /><div><b>stop 1</b><span className="dm">#b6f2d8</span><span className="mu">mint — 0% and 100%</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#cfe6fb"}} /><div><b>stop 2</b><span className="dm">#cfe6fb</span><span className="mu">ice blue — 17% / 83%</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#ded0fa"}} /><div><b>stop 3</b><span className="dm">#ded0fa</span><span className="mu">lilac — 34% / 66%</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#f8cfe9"}} /><div><b>stop 4</b><span className="dm">#f8cfe9</span><span className="mu">rose — 50%, the centre</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#171320"}} /><div><b>tile</b><span className="dm">#171320</span><span className="mu">the dark ground every mark sits on</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#141019"}} /><div><b>ink</b><span className="dm">#141019</span><span className="mu">headings and body on paper</span></div></div>
        </section>


        <section>
          <h2><span className="num">05</span>Files</h2>
          <p className="sub">Every asset is live at these paths — right-click to save.</p>
          <hr className="rule" />
          <table>
            <tbody>
              <tr><th>file</th><th>size</th><th>use</th></tr>
            <tr><td className="dm"><a href="/brand/cat-badge.svg">cat-badge.svg</a></td><td className="mu dm">vector</td><td className="mu">the logo on its tile</td></tr>
            <tr><td className="dm"><a href="/brand/cat-mark.svg">cat-mark.svg</a></td><td className="mu dm">vector</td><td className="mu">the logo, transparent</td></tr>
            <tr><td className="dm"><a href="/brand/pfp.png">pfp.png</a></td><td className="mu dm">400x400</td><td className="mu">profile picture — X, Discord, Telegram</td></tr>
            <tr><td className="dm"><a href="/brand/step-1.svg">step-1.svg</a></td><td className="mu dm">vector</td><td className="mu">3D step art — install</td></tr>
            <tr><td className="dm"><a href="/brand/step-2.svg">step-2.svg</a></td><td className="mu dm">vector</td><td className="mu">3D step art — tap</td></tr>
            <tr><td className="dm"><a href="/brand/step-3.svg">step-3.svg</a></td><td className="mu dm">vector</td><td className="mu">3D step art — wealth</td></tr>
            <tr><td className="dm"><a href="/brand/header.png">header.png</a></td><td className="mu dm">1500x500</td><td className="mu">X / Twitter banner</td></tr>
            <tr><td className="dm"><a href="/brand/og.png">og.png</a></td><td className="mu dm">1200x630</td><td className="mu">link preview card</td></tr>
            <tr><td className="dm"><a href="/brand/icon.svg">icon.svg</a></td><td className="mu dm">vector</td><td className="mu">favicon, any size</td></tr>
            <tr><td className="dm"><a href="/brand/apple-touch-icon.png">apple-touch-icon.png</a></td><td className="mu dm">180x180</td><td className="mu">iOS home screen</td></tr>
            <tr><td className="dm"><a href="/brand/icon-512.png">icon-512.png</a></td><td className="mu dm">512x512</td><td className="mu">PWA install icon</td></tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
