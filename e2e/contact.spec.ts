import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("rejects an empty submit and shows field errors", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: /send project brief/i }).click();

    await expect(page.getByText(/please enter your name/i)).toBeVisible();
    await expect(
      page.getByText(/please add a little more detail/i),
    ).toBeVisible();
  });

  test("sends a valid brief and shows the success state", async ({ page }) => {
    await page.goto("/#contact");

    await page.getByLabel(/your name/i).fill("Playwright Tester");
    await page
      .getByLabel(/your email or whatsapp/i)
      .fill("tester@example.com");
    await page.getByLabel(/project details/i).fill(
      "We need a Next.js storefront with a Supabase admin portal and Cash on Delivery.",
    );

    await page.getByRole("button", { name: /send project brief/i }).click();

    await expect(page.getByText(/brief received/i)).toBeVisible({ timeout: 15_000 });
  });

  test("quick contact links point at the right destinations", async ({ page }) => {
    await page.goto("/#contact");

    await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute(
      "href",
      "+923485581969",
    );
    await expect(page.locator('a[href^="wa.me"]').first()).toBeVisible();
  });
});
