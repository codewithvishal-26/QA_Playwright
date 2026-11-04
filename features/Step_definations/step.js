const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../../tests/utils/Loginpage');
const { DashboardPage } = require('../../tests/utils/DashboardPage');
const { CartPage } = require('../../tests/utils/CartPage');
const { CheckoutPage } = require('../../tests/utils/CheckoutPage');

Given('I log in with email {string} and password {string}', async function (email, password) {
	this.loginPage = new LoginPage(this.page);
	this.dashboardPage = new DashboardPage(this.page);

	await this.loginPage.goTo();
	await this.loginPage.validLogin(email, password);
	await this.page.waitForLoadState('networkidle');
});

When('I search for {string} and add it to the cart', async function (productName) {
	await this.dashboardPage.searchProductAddCart(productName);
});

When('I open the cart', async function () {
	this.cartPage = new CartPage(this.page);
	await this.dashboardPage.goToCart();
});

Then('I should see {string} in the cart', async function (productName) {
	const isInCart = await this.cartPage.verifyProductInCart(productName);
	expect(isInCart).toBeTruthy();
});

When('I proceed to checkout and select {string} as the country', async function (country) {
	await this.cartPage.goToCheckout();
	this.checkoutPage = new CheckoutPage(this.page);
	await this.checkoutPage.selectCountry(country);
});

Then('the checkout email should match {string}', async function (email) {
	const emailMatches = await this.checkoutPage.verifyEmail(email);
	expect(emailMatches).toBeTruthy();
});

When('I place the order', async function () {
	await this.checkoutPage.placeOrder();
});

Then('I should see the order confirmation message {string}', async function (message) {
	const thankYouText = await this.checkoutPage.getThankYouMessage();
	expect(thankYouText).toContain(message);
});

Then('I should see the error message {string}', async function (message) {
	await expect(this.page.getByText(message)).toBeVisible();
});