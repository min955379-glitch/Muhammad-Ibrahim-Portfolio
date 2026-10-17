import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("mobile menu opens and links to every section", async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("mobile"),
      "Mobile-only behaviour",
    );

    await page.goto("/");
    const toggle = page.getByRole("button", { name: /menu|close/i }).first();
    await toggle.click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();

    for (const id of [
      "live-sites",
      "projects",
      "mobile-apks",
      "services",
      "studio-3d",
      "skills",
      "arcade",
      "about",
      "contact",
    ]) {
      await expect(menu.locator(`a[href="#${id}"]`)).toHaveCount(1);
    }

    // Tap targets are at least 44px tall.
    const small = await menu.locator("a").evaluateAll((nodes) =>
      nodes
        .map((node) => node.getBoundingClientRect().height)
        .filter((height) => height > 0 && height < 44).length,
    );
    expect(small).toBe(0);
  });

  test("command palette opens with the keyboard shortcut", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: /command palette/i });
    await expect(dialog).toBeVisible();

    await page.getByRole("textbox", { name: /search commands/i }).fill("contact");
    await expect(
      page.getByRole("option", { name: /go to contact/i }),
    ).toBeVisible();
  });

  test("desktop nav scrolls to a section", async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("desktop"),
      "Desktop-only behaviour",
    );

    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Skills" })
      .click();

    await expect(page.locator("#skills")).toBeInViewport({ timeout: 10_000 });
  });
});
