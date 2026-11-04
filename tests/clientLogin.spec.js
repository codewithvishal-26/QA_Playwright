const { test, expect } = require('@playwright/test');

test.describe.serial('Register then login', () => {
    let registeredEmail;

    test('Register new user', async ({ page }) => {
        registeredEmail = `testuser${Date.now()}@test.com`;

        await page.goto("https://rahulshettyacademy.com/client/#/auth/register");
        await page.getByPlaceholder("First Name").fill("Vishal");
        await page.getByPlaceholder("Last Name").fill("Chandrabanshi");
        await page.getByPlaceholder("email@example.com").fill(registeredEmail);
        await page.getByPlaceholder("enter your number").fill("9876543210");
        await page.locator("select[formcontrolname='occupation']").selectOption({ label: "Engineer" });
        await page.locator("input[formcontrolname='gender'][value='Male']").check();
        await page.getByPlaceholder("Passsword", { exact: true }).fill("Strong@123");
        await page.getByPlaceholder("Confirm Passsword").fill("Strong@123");
        await page.locator("input[type='checkbox']").check();

        await page.getByRole('button', { name: 'Register' }).click();

        // Success screen shows a heading, not an ".alert-success" element
        await expect(page.getByRole('heading', { name: 'Account Created Successfully' })).toBeVisible();
    });

    test('Login and get product titles', async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
        await page.locator("#userEmail").fill(registeredEmail);
        await page.locator("#userPassword").fill("Strong@123");
        await page.locator("input[value='Login']").click();

        // Product titles are level-5 headings on this dashboard
        const productTitles = page.getByRole('heading', { level: 5 });
        await productTitles.first().waitFor();

        const firstProductTitle = await productTitles.first().textContent();
        console.log("First product title:", firstProductTitle.trim());

        // Bonus: get all product titles
        const allTitles = await productTitles.allTextContents();
        console.log("All product titles:", allTitles.map(t => t.trim()));
    });
});