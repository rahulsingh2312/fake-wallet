import { chromium } from 'playwright';
const b = await chromium.launch();
for (const h of [950, 800, 1120]) {
  const p = await b.newPage({ viewport: { width: 1512, height: h }, deviceScaleFactor: 1 });
  await p.goto('http://localhost:3100', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  const r = await p.evaluate(() => {
    const dev = [...document.querySelectorAll('div')].find(e => e.className.includes?.('lg:h-[892px]'))?.getBoundingClientRect();
    const main = document.querySelector('main');
    const acct = main ? [...main.querySelectorAll('button')].find(e => e.textContent.trim().startsWith('larpwallet')) : null;
    const ar = acct?.getBoundingClientRect();
    return {
      deviceTop: dev && Math.round(dev.top), deviceBottom: dev && Math.round(dev.bottom),
      fits: dev ? dev.top >= 0 && dev.bottom <= window.innerHeight : null,
      acct: acct ? { text: acct.textContent.trim(), top: Math.round(ar.top), visible: ar.height > 0 } : 'MISSING',
      scrollX: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(`h=${h}`, JSON.stringify(r));
  if (h === 950) await p.screenshot({ path: 'desk2.png' });
  await p.close();
}
await b.close();
