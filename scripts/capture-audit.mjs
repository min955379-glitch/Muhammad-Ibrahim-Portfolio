import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const baseURL = process.argv[2] ?? 'http://127.0.0.1:3000';
const phase = process.argv[3] ?? 'after';
const folder = `screenshots/${phase}`;
mkdirSync(folder, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'] });
const report = [];
for (const width of [360, 390, 430, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 }, deviceScaleFactor: 1, hasTouch: width < 800, isMobile: width < 800 });
  await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.waitForTimeout(3200);
  const metrics = await page.evaluate(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const badge = document.querySelector('#top .section-shell .rounded-full')?.getBoundingClientRect();
    const ctas = [...document.querySelectorAll('#top .btn')].map((el) => {
      const box = el.getBoundingClientRect();
      return { width: box.width, height: box.height, text: el.textContent?.trim(), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
    });
    return { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, headerHeight: header?.height, badgeTop: badge?.top, headerBottom: header?.bottom, ctas };
  });
  report.push(metrics);
  await page.screenshot({ path: `${folder}/${phase}-${width}-hero.png` });
  if (width === 390) {
    await page.locator('#top .glass-strong').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${folder}/${phase}-390-profile.png` });
    await page.locator('#live-sites').scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    await page.screenshot({ path: `${folder}/${phase}-390-live-sites.png` });
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${folder}/${phase}-390-bottom-bar.png` });
  }
  await page.close();
}
await browser.close();
writeFileSync(`${folder}/metrics.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
