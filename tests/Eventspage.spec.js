const { test, expect } = require('./utils/Eventhubfixtures');

test('shows the events page directly, no login steps needed', async ({ authenticatedPage }) => {
  // No login code here at all — the fixture already handled it.
  await authenticatedPage.goto('https://eventhub.rahulshettyacademy.com/events');

  const eventCards = authenticatedPage.locator('[data-testid="event-card"]');
  await expect(eventCards.first()).toBeVisible();
});