const { test, expect } = require('@playwright/test');

test('@QW Security test request intercept', async ({ page }) => {

  // login and reach orders page
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("testuser1787810623872@test.com");
  await page.locator("#userPassword").type("Strong@123");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState('networkidle');
  await page.locator(".card-body b").first().waitFor();

  await page.locator("button[routerlink*='myorders']").click();

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    route => route.continue({
      url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=REPLACE_WITH_ANOTHER_USERS_ORDER_ID'
    })
  );

  await page.locator("button:has-text('View')").first().click();

  await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
});