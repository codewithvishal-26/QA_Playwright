const base = require('@playwright/test');
require('dotenv').config();

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

const EMAIL = process.env.EVENTHUB_EMAIL;
const PASSWORD = process.env.EVENTHUB_PASSWORD;

/**
 * Extends Playwright's base test with an `authenticatedPage` fixture.
 * Any test that destructures { authenticatedPage } instead of { page }
 * automatically starts already logged into EventHub -- no login steps needed.
 */
exports.test = base.test.extend({
  authenticatedPage: async ({ page }, use) => {
    // ---- Setup: runs before the test body ----
    await page.goto(`${BASE_URL}/login`);

    await page.getByPlaceholder('you@email.com').fill(EMAIL);
    await page.getByLabel('Password').fill(PASSWORD);

    await page.locator('#login-btn').click();

    await base.expect(
      page.getByRole('link', { name: 'Browse Events \u2192' })
    ).toBeVisible();

    // ---- Hand the authenticated page to the test ----
    await use(page);

    // ---- Teardown: runs after the test body (optional cleanup) ----
    // e.g. await page.getByRole('button', { name: 'Logout' }).click();
  },
});

exports.expect = base.expect;