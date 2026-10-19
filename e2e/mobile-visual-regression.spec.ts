import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PNG } from "pngjs";

/** Contrast is checked by axe across the page and against sampled screenshot pixels
 * for the dark hero/card. This deliberately tests the *rendered* page, not tokens alone. */
function luminance([r, g, b]: number[]) {
  const linear = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(fg: number[], bg: number[]) {
  const a = luminance(fg), b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const targets = [
  { name: "hero headline", selector: "#top h1" },
  { name: "hero subtitle", selector: "#top p.max-w-prose" },
  { name: "availability badge", selector: "#top .rounded-full .font-mono" },
  { name: "tech chip", selector: "#top ul li:first-child" },
  { name: "card heading", selector: "#top .glass-strong h2" },
  { name: "stat number", selector: "#top .glass-strong .grid.grid-cols-2 > div:first-child > p:first-child" },
  { name: "stat label", selector: "#top .glass-strong .grid.grid-cols-2 > div:first-child > p:nth-child(2)" },
  { name: "PKT label", selector: '#top .glass-strong .eyebrow:has-text("Local time")' },
  { name: "based-in label", selector: '#top .glass-strong .eyebrow:has-text("Based in")' },
  { name: "scroll hint", selector: '#top a[href="#live-sites"]:has-text("SCROLL")' },
];

test("mobile-visual-regression: 390px contrast, overflow, header and bottom bar", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "390px regression is run once in the mobile project");
  test.setTimeout(120_000);
  await page.goto("/");
  await page.locator("#top h1").waitFor();
  await page.waitForTimeout(1500);

  const header = await page.locator("header").first().boundingBox();
  const badge = await page.locator("#top .section-shell .rounded-full").first().boundingBox();
  expect(header && badge && badge.y >= header.y + header.height - 1, "hero must start below the header").toBeTruthy();

  const table: { name: string; ratio: number }[] = [];
  for (const target of targets) {
    const item = page.locator(target.selector).first();
    if (!(await item.count())) continue;
    await item.scrollIntoViewIfNeeded();
    const box = await item.boundingBox();
    if (!box) continue;
    const color = await item.evaluate((el) => getComputedStyle(el).color);
    const rgb = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    if (rgb.length !== 3) continue;
    // Sample just outside the text glyphs, inside the same dark surface.
    const sampleX = Math.max(0, Math.min(389, Math.round(box.x + Math.min(4, box.width / 2))));
    const sampleY = Math.max(0, Math.min(843, Math.round(box.y + box.height + 3)));
    const png = PNG.sync.read(await page.screenshot());
    const offset = (sampleY * png.width + sampleX) * 4;
    const ratio = contrast(rgb, [...png.data.subarray(offset, offset + 3)]);
    table.push({ name: target.name, ratio: Number(ratio.toFixed(2)) });
    expect(ratio, `${target.name}: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      target.name === "hero headline" || target.name === "card heading" ? 3 : 4.5,
    );
  }
  console.log("Hero/card sampled contrast (foreground vs screenshot background):", table);

  const axe = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  expect(axe.violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(", ")}: ${n.failureSummary}`))).toEqual([]);

  // Check the entire long page, not just the first viewport.
  for (const id of ["live-sites", "projects", "mobile-apks", "services", "studio-3d", "skills", "arcade", "about", "contact"]) {
    const top = await page.evaluate((anchor) => {
      const section = document.getElementById(anchor)!;
      section.scrollIntoView({ behavior: "instant", block: "start" });
      return section.getBoundingClientRect().top;
    }, id);
    expect(top, `${id} must not land under the fixed header`).toBeGreaterThanOrEqual(header!.height + 12);
  }
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += 720) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }

  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  const bar = page.locator(".mobile-action-bar");
  await expect(bar).toBeVisible();
  const buttons = await bar.locator("a, button").all();
  expect(buttons).toHaveLength(3);
  const rectangles = await Promise.all(buttons.map((button) => button.boundingBox()));
  for (let i = 0; i < rectangles.length; i++) {
    const current = rectangles[i]!;
    expect(current.height).toBeGreaterThanOrEqual(52);
    if (i) expect(current.x).toBeGreaterThanOrEqual(rectangles[i - 1]!.x + rectangles[i - 1]!.width + 11);
  }
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(bar).toBeHidden();
});
