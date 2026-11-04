const { test, expect } = require('@playwright/test');


test('@Webst Client App login', async ({ page }) => {
    const email = "testuser1787810623872@test.com";
    const password = "Strong@123";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    const count = await products.count();
    for (let i = 0; i < count; ++i) {
        if ((await products.nth(i).locator("b").textContent())?.trim() === productName) {
            await products.nth(i).getByRole('button', { name: 'Add To Cart' }).click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();

    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();
    await page.getByPlaceholder('Select Country').pressSequentially("ind", { delay: 150 });

    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();

    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text?.trim() === "India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    // ---- NEW ORDER VERIFICATION BLOCK STARTS HERE ----
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("table tbody").waitFor();

    const rows = page.locator("table tbody tr");
    const rowCount = await rows.count();
    let matched = false;

    for (let i = 0; i < rowCount; ++i) {
        const rowOrderId = (await rows.nth(i).locator("th").textContent())?.trim();

        if (orderId.includes(rowOrderId)) {
            matched = true;

            const rowProductName = (await rows.nth(i).locator("td").nth(1).textContent())?.trim();
            console.log("Order row product name:", rowProductName);
            expect(rowProductName).toBe(productName);

            await rows.nth(i).getByRole('button', { name: 'View' }).click();
            break;
        }
    }

    expect(matched).toBeTruthy();

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails.trim())).toBeTruthy();
    // ---- NEW ORDER VERIFICATION BLOCK ENDS HERE ----
});