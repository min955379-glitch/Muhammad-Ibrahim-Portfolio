import { expect, test } from "@playwright/test";

const SLUGS = [
  "my-english-practice",
  "dailymb-quiz-helper",
  "blue-peak-store",
  "town-fitness-point",
  "reviewnudge-saas",
  "terrastep",
  "genvexa-mental-maths-arhms",
];

test.describe("case studies", () => {
  for (const slug of SLUGS) {
    test(`/projects/${slug} renders`, async ({ page }) => {
      const response = await page.goto(`/projects/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("unknown slug returns the 404 page", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/out of orbit/i)).toBeVisible();
  });
});
