import type { Metadata } from "next";
import { Bricolage_Grotesque, Familjen_Grotesk, Martian_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--bk-display", display: "swap" });
const body = Familjen_Grotesk({ subsets: ["latin"], variable: "--bk-body", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--bk-mono", display: "swap" });

export const metadata: Metadata = {
  title: "larp wallet brand kit",
  description: "Mark, header, share card, favicon and palette for larp wallet.",
  robots: { index: false, follow: false },
};

const CSS = '\n.bk{--ink:#ffffff;--panel:#f6f3ff;--panel2:#efe9ff;--line:#e7e2f5;--gold:#c9962b;--gold-deep:#a8702f;--violet:#7c5cf0;--violet-deep:#5029bd;--tx:#15101f;--mu:#7d7593;\nbackground:var(--ink);color:var(--tx);font-family:var(--bk-body),system-ui,sans-serif;font-size:17px;line-height:1.6;min-height:100vh;-webkit-font-smoothing:antialiased;}\n.bk *{box-sizing:border-box;}\n.bk .wrap{max-width:1080px;margin:0 auto;padding:64px 28px 120px;}\n.bk .eyebrow{font-family:var(--bk-mono),monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin:0 0 18px;}\n.bk h1{font-family:var(--bk-display),Georgia,serif;font-weight:800;font-size:clamp(40px,7vw,74px);letter-spacing:-.035em;line-height:1.02;margin:0 0 16px;text-wrap:balance;}\n.bk h1 em{font-style:normal;color:var(--gold);}\n.bk .lede{font-size:20px;color:var(--mu);max-width:62ch;margin:0;}\n.bk section{margin-top:88px;}\n.bk h2{font-family:var(--bk-display),Georgia,serif;font-weight:700;font-size:30px;letter-spacing:-.02em;margin:0 0 10px;}\n.bk h2 .num{font-family:var(--bk-mono),monospace;font-size:12px;color:var(--violet);margin-right:12px;vertical-align:6px;}\n.bk .sub{color:var(--mu);margin:0 0 28px;max-width:66ch;}\n.bk .rule{height:1px;background:var(--line);border:0;margin:0 0 28px;}\n.bk .marks{display:flex;flex-direction:column;gap:18px;}\n.bk .mark{display:grid;grid-template-columns:190px 1fr;gap:28px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:22px;}\n.bk .mark.picked{border-color:#c9962b55;background:linear-gradient(180deg,#ffffff,#f6f3ff);}\n.bk .mark-art img{width:100%;border-radius:14px;display:block;}\n.bk .mark h3{font-family:var(--bk-display),Georgia,serif;font-size:21px;margin:0 0 8px;letter-spacing:-.01em;}\n.bk .mark p{margin:0 0 8px;}\n.bk .note{color:var(--mu);font-size:15px;}\n.bk .badge{color:#2a1c05;font-family:var(--bk-mono),monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;background:var(--gold);border-radius:99px;padding:3px 9px;margin-left:10px;vertical-align:3px;}\n.bk .scale{display:flex;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap;}\n.bk .scale img{border-radius:4px;}\n.bk .slabel{font-family:var(--bk-mono),monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mu);margin-right:4px;}\n.bk figure{margin:0 0 26px;}\n.bk figure img{width:100%;border-radius:16px;border:1px solid var(--line);display:block;}\n.bk figcaption{font-family:var(--bk-mono),monospace;font-size:11px;color:var(--mu);margin-top:10px;letter-spacing:.05em;}\n.bk .tab{display:inline-flex;align-items:center;gap:9px;background:var(--panel2);border:1px solid var(--line);border-radius:10px 10px 0 0;padding:9px 18px 9px 13px;font-size:14px;}\n.bk table{width:100%;border-collapse:collapse;font-size:16px;}\n.bk td,.bk th{text-align:left;padding:13px 12px;border-bottom:1px solid var(--line);}\n.bk th{font-family:var(--bk-mono),monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--mu);font-weight:400;}\n.bk .dm{font-family:var(--bk-mono),monospace;font-size:14px;}\n.bk .mu{color:var(--mu);}\n.bk .sw{display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--line);}\n.bk .chip{width:52px;height:52px;border-radius:12px;flex:none;box-shadow:inset 0 0 0 1px rgba(20,16,31,0.10);}\n.bk .sw b{font-weight:600;display:block;}\n.bk .sw .dm{margin-right:12px;color:var(--gold);}\n.bk pre{background:var(--panel2);border:1px solid var(--line);border-radius:14px;padding:20px;overflow-x:auto;font-family:var(--bk-mono),monospace;font-size:12.5px;line-height:1.9;color:#4a4160;margin:0;}\n.bk .callout{border-left:3px solid var(--gold);background:#c9962b14;border-radius:0 12px 12px 0;padding:16px 20px;margin-top:24px;}\n.bk .callout b{color:var(--gold);}\n.bk a{color:var(--violet);}\n.bk a:focus-visible{outline:2px solid var(--violet);outline-offset:3px;border-radius:3px;}\n@media (max-width:720px){.bk .mark{grid-template-columns:1fr;}.bk .mark-art img{max-width:200px;}}\n';

export default function BrandPage() {
  return (
    <div className={`bk ${display.variable} ${body.variable} ${mono.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <p className="eyebrow">brand kit &middot; larpwallet.online</p>
        <h1>Everything <em>fake</em> needs to look real.</h1>
        <p className="lede">A gold ghost on a violet ground. Mark, header, share card and favicon
        for larp wallet, matched to the app that&rsquo;s already shipped.</p>

        <section>
          <h2><span className="num">01</span>The mark</h2>
          <p className="sub">A solid-gold ghost on a violet tile. Favicon, app icon, avatar, top bar.
          Same shape everywhere, just smaller.</p>
          <hr className="rule" />
          <div className="marks">
        <article className="mark picked">
          <div className="mark-art"><img src="/brand/ghost-badge.png" alt="Gold ghost" /></div>
          <div>
            <h3>Gold ghost<span className="badge">the mark</span></h3>
            <p>Cast in gold, still see-through where it counts. The photo itself is the mark, not a
            redraw of it.</p>
            <p className="note">Shipped: favicon, app icon, avatar and the mark in the top bar.</p>
            <div className="scale"><span className="slabel">at real size</span>
              <img src="/brand/ghost-badge.png" width={48} height={48} alt="" />
              <img src="/brand/ghost-badge.png" width={32} height={32} alt="" />
              <img src="/brand/ghost-badge.png" width={16} height={16} alt="" />
            </div>
          </div>
        </article>
          </div>
        </section>

        <section>
          <h2><span className="num">02</span>Header &amp; share card</h2>
          <p className="sub">Link previews and the profile banner, both on the lavender ground with the
          gold lockup centred so the avatar never covers it.</p>
          <hr className="rule" />
          <figure><img src="/brand/header.png" alt="X header" />
            <figcaption>header.png, 1500&times;500. Lockup is centred so the avatar never covers it.</figcaption></figure>
          <figure><img src="/brand/og.png" alt="Open Graph card" />
            <figcaption>og.png, 1200&times;630. Link preview for X, Discord, Telegram, iMessage.</figcaption></figure>
        </section>

        <section>
          <h2><span className="num">03</span>Favicon</h2>
          <p className="sub">The same photo, downsampled. Still reads as a ghost at 16px.</p>
          <hr className="rule" />
          <div className="tab"><img src="/favicon-96x96.png" width={16} height={16} alt="" /> larp wallet</div>
          <div className="scale" style={{ marginTop: 22 }}>
            <span className="slabel">16 / 32 / 96</span>
            <img src="/favicon-96x96.png" width={16} height={16} alt="" />
            <img src="/favicon-96x96.png" width={32} height={32} alt="" />
            <img src="/favicon-96x96.png" width={96} height={96} alt="" />
          </div>
        </section>

        <section>
          <h2><span className="num">04</span>Palette</h2>
          <p className="sub">Two hues off the mark: brushed gold for the ghost and every primary action,
          lilac violet for the accents, over a lavender ground. The gradient runs gold &rarr; violet &rarr; gold
          and flows. None of it appears inside the wallet: that screen keeps Phantom&rsquo;s purple so the
          screenshots still match.</p>
          <hr className="rule" />
        <div className="sw"><div className="chip" style={{background:"#ffe4a0"}} /><div><b>gold light</b><span className="dm">#ffe4a0</span><span className="mu">gradient top stop, highlights</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#f4c64e"}} /><div><b>gold</b><span className="dm">#f4c64e</span><span className="mu">the ghost, primary buttons, links</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#c9962b"}} /><div><b>gold deep</b><span className="dm">#c9962b</span><span className="mu">the ghost&rsquo;s lower body, pressed states</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#a78bfa"}} /><div><b>violet</b><span className="dm">#a78bfa</span><span className="mu">secondary accent, step numbers</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#947de0"}} /><div><b>violet deep</b><span className="dm">#947de0</span><span className="mu">the tile behind the mark, sampled off the photo</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#f5f2ff"}} /><div><b>ground</b><span className="dm">#f5f2ff</span><span className="mu">the lavender the landing sits on</span></div></div>
        <div className="sw"><div className="chip" style={{background:"#3c315b"}} /><div><b>ink</b><span className="dm">#3c315b</span><span className="mu">body copy and headings on the ground</span></div></div>
        </section>


        <section>
          <h2><span className="num">05</span>Files</h2>
          <p className="sub">Every asset is live at these paths. Right-click to save.</p>
          <hr className="rule" />
          <table>
            <tbody>
              <tr><th>file</th><th>size</th><th>use</th></tr>
            <tr><td className="dm"><a href="/brand/ghost-badge.png">ghost-badge.png</a></td><td className="mu dm">1024x1024</td><td className="mu">the mark on its violet ground</td></tr>
            <tr><td className="dm"><a href="/brand/ghost-mark.png">ghost-mark.png</a></td><td className="mu dm">1024x1024</td><td className="mu">the mark, cut out, transparent</td></tr>
            <tr><td className="dm"><a href="/brand/pfp.png">pfp.png</a></td><td className="mu dm">400x400</td><td className="mu">profile picture, X / Discord / Telegram</td></tr>
            <tr><td className="dm"><a href="/brand/header.png">header.png</a></td><td className="mu dm">1500x500</td><td className="mu">X / Twitter banner</td></tr>
            <tr><td className="dm"><a href="/brand/og.png">og.png</a></td><td className="mu dm">1200x630</td><td className="mu">link preview card</td></tr>
            <tr><td className="dm"><a href="/favicon.ico">favicon.ico</a></td><td className="mu dm">multi-res</td><td className="mu">favicon, any size</td></tr>
            <tr><td className="dm"><a href="/apple-touch-icon.png">apple-touch-icon.png</a></td><td className="mu dm">180x180</td><td className="mu">iOS home screen</td></tr>
            <tr><td className="dm"><a href="/icon-512.png">icon-512.png</a></td><td className="mu dm">512x512</td><td className="mu">PWA install icon</td></tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
