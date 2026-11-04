import { test, expect } from '@playwright/test';
import { LoginPage } from './PageObject/Loginpage';
import { DashboardPage } from './PageObject/Dashboardpage';
import { CartPage } from './PageObject/Cartpage';
import { CheckoutPage } from './PageObject/Checkoutpage';

test('Client App full checkout flow using Page Object Model', async ({ page }) => {
  const email = 'testuser1787810623872@test.com';
  const password = 'Strong@123';
  const productName = 'ZARA COAT 3';

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // ---- Login ----
  await loginPage.goTo();
  await loginPage.validLogin(email, password);
  await page.waitForLoadState('networkidle');

  // ---- Search product and add to cart ----
  await dashboardPage.searchProductAddCart(productName);

  // ---- Go to cart and verify product ----
  await dashboardPage.goToCart();
  expect(await cartPage.verifyProductInCart(productName)).toBeTruthy();

  // ---- Checkout ----
  await cartPage.goToCheckout();
  await checkoutPage.selectCountry('India');
  expect(await checkoutPage.verifyEmail(email)).toBeTruthy();

  await checkoutPage.placeOrder();

  const thankYouText = await checkoutPage.getThankYouMessage();
  expect(thankYouText).toContain('Thankyou for the order');
});