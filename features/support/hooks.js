const { Before, After, AfterStep, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

// Each step may take up to 60 seconds (Cucumber's default is only 5 seconds)
setDefaultTimeout(60 * 1000);

// Runs before every scenario: open a fresh browser and page
Before(async function () {
	this.browser = await chromium.launch({
		// Headless by default; set HEADED=true to watch the browser
		headless: process.env.HEADED !== 'true',
	});
	const context = await this.browser.newContext();
	this.page = await context.newPage();
});

// Runs after every step: if the step failed, attach a screenshot to the report
AfterStep(async function ({ result }) {
	if (result.status === Status.FAILED) {
		const screenshot = await this.page.screenshot();
		this.attach(screenshot, 'image/png');
	}
});

// Runs after every scenario: close the browser
After(async function () {
	await this.browser?.close();
});