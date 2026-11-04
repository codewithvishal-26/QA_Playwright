const { test, expect, request } = require('@playwright/test');
require('dotenv').config();

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

// ---- Two dummy accounts (register these on EventHub first) ----
const YAHOO_USER = {
  email: process.env.YAHOO_EMAIL || 'yahoo.testuser@yahoo.com',
  password: process.env.YAHOO_PASSWORD || 'YahooPass@123',
};

const GMAIL_USER = {
  email: process.env.GMAIL_EMAIL || 'gmail.testuser@gmail.com',
  password: process.env.GMAIL_PASSWORD || 'GmailPass@123',
};

/**
 * Reusable UI login helper — logs a given user into EventHub through the browser.
 */
async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('you@email.com').fill(user.email);
  await page.getByLabel('Password').fill(user.password);

  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test('User B cannot access User A\'s booking directly (Access Denied)', async ({ page }) => {
  const apiContext = await request.newContext();

  // ---------------- Step 1: Login as Yahoo user via API ----------------
  console.log('Attempting login with email:', JSON.stringify(YAHOO_USER.email));

  const loginRes = await apiContext.post(`${API_URL}/auth/login`, {
    data: {
      email: YAHOO_USER.email,
      password: YAHOO_USER.password,
    },
  });

  const loginJson = await loginRes.json();
  console.log('Login response:', loginJson);

  expect(loginRes.ok(), `Login failed: ${JSON.stringify(loginJson)}`).toBeTruthy();

  const token = loginJson.token;

  // ---------------- Step 2: Fetch events via API to get a valid event ID ----------------
  const eventsRes = await apiContext.get(`${API_URL}/events`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(eventsRes.ok()).toBeTruthy();

  const eventsJson = await eventsRes.json();
  const eventId = eventsJson.data[0].id;

  // ---------------- Step 3: Create a booking via API as Yahoo user ----------------
  const bookingRes = await apiContext.post(`${API_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    data: {
      eventId: eventId,
      customerName: 'Yahoo User',
      customerEmail: YAHOO_USER.email,
      customerPhone: '9876543210',
      quantity: 1,
    },
  });

  expect(bookingRes.ok()).toBeTruthy();

  const bookingJson = await bookingRes.json();
  const yahooBookingId = bookingJson.data.id;

  await apiContext.dispose();

  // ---------------- Step 4: Login as Gmail user via browser UI ----------------
  await loginAs(page, GMAIL_USER);

  // ---------------- Step 5: Navigate to Yahoo's booking URL as Gmail user ----------------
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, { waitUntil: 'networkidle' });

  // ---------------- Step 6: Validate Access Denied ----------------
  await expect(page.getByText('Access Denied')).toBeVisible();
  await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();
});