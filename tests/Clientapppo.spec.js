const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./utils/Loginpage');

test('Client App login using Page Object Model', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goTo();
    await loginPage.validLogin('testuser1787810623872@test.com', 'Strong@123');

    await page.waitForLoadState('networkidle');

    const products = page.locator(".card-body");
    await expect(products.first()).toBeVisible();
});