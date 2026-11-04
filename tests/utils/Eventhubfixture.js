const base = require('@playwright/test');
require('dotenv').config();

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const EMAIL = process.env.EVENTHUB_EMAIL;
const PASSWORD = process.env.EVENTHUB_PASSWORD;

exports.test = base.test.extend({
  // authenticatedPage -- logs into EventHub through the UI and yields
  // a page that's already past the login screen.
  authenticatedPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/login`);

    await page.getByPlaceholder('you@email.com').fill(EMAIL);
    await page.getByLabel('Password').fill(PASSWORD);

    await page.locator('#login-btn').click();

    await base.expect(
      page.getByRole('link', { name: 'Browse Events \u2192' })
    ).toBeVisible();

    await use(page);
  },

  // createEvent -- logs in via the API (no browser) and creates a new
  // event through POST /events, yielding the API response so the test
  // can read the new event's name/id.
  createEvent: async ({}, use) => {
    const apiContext = await base.request.newContext();

    const loginRes = await apiContext.post(`${API_URL}/auth/login`, {
      data: { email: EMAIL, password: PASSWORD },
    });
    const loginJson = await loginRes.json();
    const token = loginJson.token;

    const uniqueTitle = `Fixture Test Event ${Date.now()}`;

    const createRes = await apiContext.post(`${API_URL}/events`, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        title: uniqueTitle,
        description: 'Created by createEvent fixture',
        category: 'Conference',
        city: 'Pune',
        venue: 'Test Venue Hall',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        price: 100,
        totalSeats: 50,
      },
    });
    const createJson = await createRes.json();
    console.log('createEvent response:', JSON.stringify(createJson));

    await use(createJson);

    await apiContext.dispose();
  },
});

exports.expect = base.expect;