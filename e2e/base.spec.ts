import { test, expect } from "@playwright/test";

test.describe("spicy wod", () => {
  test("the index page should work", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Spicy Wod")).toHaveCount(2);
    const signUpButton = page.getByRole("link", { name: /sign up/i });
    await signUpButton.click();
    await page.getByRole("textbox", { name: /email/i }).fill("test@test.com");
    await page.getByRole("textbox", { name: /password/i }).fill("password");
    await page
      .getByRole("textbox", { name: /confirm password/i })
      .fill("password");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page.getByText("Sign up successful")).toBeVisible();
  });
});
