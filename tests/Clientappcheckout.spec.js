const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./utils/Loginpage');
const { DashboardPage } = require('./utils/DashboardPage');
const { CartPage } = require('./utils/Cartpage');
const { CheckoutPage } = require('./utils/Checkoutpage');

// Vishal has created a new branch to check the pull request

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
    const isInCart = await cartPage.verifyProductInCart(productName);
    expect(isInCart).toBeTruthy();

    // ---- Checkout ----
    await cartPage.goToCheckout();
    await checkoutPage.selectCountry('India');

    const emailMatches = await checkoutPage.verifyEmail(email);
    expect(emailMatches).toBeTruthy();

    await checkoutPage.placeOrder();

    const thankYouText = await checkoutPage.getThankYouMessage();
    expect(thankYouText).toContain('Thankyou for the order');
});