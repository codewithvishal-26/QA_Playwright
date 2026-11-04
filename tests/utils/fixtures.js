const base = require("@playwright/test");

exports.customTest = base.test.extend({
   authenticatePage: async ({ page }, use) => {
      const email = "testuser1787810623872@test.com";
      const password = "Strong@123";

      await page.goto("https://rahulshettyacademy.com/client");
      await page.locator("#userEmail").fill(email);
      await page.locator("#userPassword").fill(password);
      await page.locator("[value='Login']").click();
      await page.waitForLoadState("networkidle");
      await use(page);
   },
});