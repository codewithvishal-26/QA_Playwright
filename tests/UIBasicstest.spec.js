const { test, expect } = require('@playwright/test');

test('Browser Playwright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.youtube.com/");
});

test.only('Browser Context-Validating Error login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Correct URL - the login practice page, not the homepage
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    const userName = page.locator('#username');
    const password = page.locator('#password');
    const signIn = page.locator('#signInBtn');

    // First attempt - intentionally wrong username to trigger error
    await userName.fill("rahulshetty");
    await password.fill("Learning@830$3mK2");
    await signIn.click();

    const errorMsg = page.locator("[style*='block']");
    console.log(await errorMsg.textContent());
    await expect(errorMsg).toContainText('Incorrect');

    // Correct the username and retry
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();

    // Define the locator for the course/card titles before using it
    const cardTitles = page.locator(".card-body a");

    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());

    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});