import { test as base, Page } from '@playwright/test';

export const customTest = base.extend<{ authenticatePage: Page }>({
  authenticatePage: async ({ page }, use) => {
    const email = 'testuser1787810623872@test.com';
    const password = 'Strong@123';

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    await use(page);
  },
});