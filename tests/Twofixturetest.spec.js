const { test, expect } = require('./utils/Eventhubfixture');

test('newly created event is visible on the events page', async ({ authenticatedPage, createEvent }) => {
  console.log('createEvent fixture yielded:', JSON.stringify(createEvent));

  await authenticatedPage.goto('https://eventhub.rahulshettyacademy.com/events');
  await expect(authenticatedPage.getByText(createEvent.data.title)).toBeVisible();
});