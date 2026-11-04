const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// ---- Credentials (replace with your own test account) ----
const EMAIL = 'vishalchandrabanshi26@gmail.com';
const PASSWORD = 'Vishal@1';

/**
 * Returns a future date/time string suitable for a `datetime-local` input,
 * formatted as YYYY-MM-DDTHH:mm.
 */
function futureDateValue(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  const pad = (n) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Reusable login helper — logs into EventHub and confirms success.
 */
async function login(page) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('you@email.com').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);

  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test('Create event, complete booking, and verify seat count drops by 1', async ({ page }) => {
  // ---------------- Step 1: Login ----------------
  await login(page);

  // ---------------- Step 2: Create a new event ----------------
  const eventTitle = `Test Event ${Date.now()}`;

  await page.goto(`${BASE_URL}/admin/events`);

  await page.locator('#event-title-input').fill(eventTitle);
  await page.locator('#admin-event-form textarea').fill('Automated test event description.');
  await page.getByLabel('City').fill('Pune');
  await page.getByLabel('Venue').fill('Test Venue Hall');
  await page.getByLabel('Event Date & Time').fill(futureDateValue());
  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');

  await page.locator('#add-event-btn').click();

  await expect(page.getByText('Event created!')).toBeVisible();

  // ---------------- Step 3: Find the event card and capture seats ----------------
  await page.goto(`${BASE_URL}/events`);

  const allEventCards = page.locator('[data-testid="event-card"]');
  await expect(allEventCards.first()).toBeVisible();

  const eventCard = allEventCards.filter({ hasText: eventTitle });
  await expect(eventCard).toBeVisible({ timeout: 5000 });

  const seatTextBefore = await eventCard.locator('text=/seat/i').innerText();
  const seatsBeforeBooking = parseInt(seatTextBefore.replace(/\D/g, ''), 10);

  // ---------------- Step 4: Start booking ----------------
  await eventCard.locator('[data-testid="book-now-btn"]').click();

  // ---------------- Step 5: Fill booking form ----------------
  await expect(page.locator('#ticket-count')).toHaveText('1');

  await page.getByLabel('Full Name').fill('John Doe');
  await page.locator('#customer-email').fill('johndoe@example.com');
  await page.getByPlaceholder('+91 98765 43210').fill('+91 98765 43210');

  await page.locator('.confirm-booking-btn').click();

  // ---------------- Step 6: Verify booking confirmation ----------------
  const bookingRefLocator = page.locator('.booking-ref').first();
  await expect(bookingRefLocator).toBeVisible();
  const bookingRef = (await bookingRefLocator.innerText()).trim();

  // ---------------- Step 7: Verify in My Bookings ----------------
  await page.getByRole('link', { name: 'View My Bookings' }).click();

  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  const allBookingCards = page.locator('#booking-card');
  await expect(allBookingCards.first()).toBeVisible();

  const matchedBookingCard = allBookingCards.filter({
    has: page.locator('.booking-ref', { hasText: bookingRef }),
  });
  await expect(matchedBookingCard).toBeVisible();
  await expect(matchedBookingCard).toContainText(eventTitle);

  // ---------------- Step 8: Verify seat reduction ----------------
  await page.goto(`${BASE_URL}/events`);

  const allEventCardsAfter = page.locator('[data-testid="event-card"]');
  await expect(allEventCardsAfter.first()).toBeVisible();

  const eventCardAfter = allEventCardsAfter.filter({ hasText: eventTitle });
  await expect(eventCardAfter).toBeVisible();

  const seatTextAfter = await eventCardAfter.locator('text=/seat/i').innerText();
  const seatsAfterBooking = parseInt(seatTextAfter.replace(/\D/g, ''), 10);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});