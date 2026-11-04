import { test as base, expect, request, Page } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const EMAIL = process.env.EVENTHUB_EMAIL as string;
const PASSWORD = process.env.EVENTHUB_PASSWORD as string;

export interface CreateEventResponse {
  success: boolean;
  data: { id: number; title: string; [key: string]: unknown };
  [key: string]: unknown;
}

type EventHubFixtures = {
  authenticatedPage: Page;
  createEvent: CreateEventResponse;
};

export const test = base.extend<EventHubFixtures>({
  // authenticatedPage -- logs in through the UI and yields a page already past the login screen
  authenticatedPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/login`);

    await page.getByPlaceholder('you@email.com').fill(EMAIL);
    await page.getByLabel('Password').fill(PASSWORD);
    await page.locator('#login-btn').click();

    await expect(page.getByRole('link', { name: 'Browse Events \u2192' })).toBeVisible();

    await use(page);
  },

  // createEvent -- logs in via API (no browser), creates an event with POST /events,
  // and yields the API response so the test can read the new event's title/id
  createEvent: async ({}, use) => {
    const apiContext = await request.newContext();

    const loginRes = await apiContext.post(`${API_URL}/auth/login`, {
      data: { email: EMAIL, password: PASSWORD },
    });
    const loginJson = await loginRes.json();
    const token: string = loginJson.token;

    const uniqueTitle = `Fixture Test Event ${Date.now()}`;

    const createRes = await apiContext.post(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` },
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
    const createJson: CreateEventResponse = await createRes.json();
    console.log('createEvent response:', JSON.stringify(createJson));

    await use(createJson);

    await apiContext.dispose();
  },
});

export { expect };