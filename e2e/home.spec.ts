import { expect, test } from "@playwright/test";

const SECTIONS = [
  "live-sites",
  "projects",
  "mobile-apks",
  "services",
  "studio-3d",
  "skills",
  "arcade",
  "about",
  "contact",
];

test.describe("home page", () => {
  test("renders the hero with a single-row header", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const header = page.locator("header");
    await expect(header).toBeVisible();

    // The header bar must stay on one line: logo and actions share a row.
    const logo = header.locator("a[aria-label*='home']").first();
    const hireMe = header.getByRole("link", { name: /hire me/i }).first();
    if (await hireMe.isVisible()) {
      const logoBox = await logo.boundingBox();
      const hireBox = await hireMe.boundingBox();
      expect(logoBox).not.toBeNull();
      expect(hireBox).not.toBeNull();
      // Same vertical band => one row.
      expect(
        Math.abs((logoBox!.y + logoBox!.height / 2) - (hireBox!.y + hireBox!.height / 2)),
      ).toBeLessThan(24);
    }
  });

  test("every section anchor exists", async ({ page }) => {
    await page.goto("/");
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("no horizontal overflow at any viewport", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(600);

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
      };
    });

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test("hero CTAs are present and full width on mobile", async ({ page }, testInfo) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /explore live websites/i }).first();
    await expect(cta).toBeVisible();

    if (testInfo.project.name.startsWith("mobile")) {
      const box = await cta.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(viewport!.width * 0.7);
    }
  });

  test("external links use safe rel attributes", async ({ page }) => {
    await page.goto("/");
    const unsafe = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[target="_blank"]')).filter(
        (link) => !(link.getAttribute("rel") ?? "").includes("noopener"),
      ).length,
    );
    expect(unsafe).toBe(0);
  });
});
