import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly countryInput: Locator;
  readonly countryDropdownResults: Locator;
  readonly emailField: Locator;
  readonly placeOrderButton: Locator;
  readonly thankYouMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryInput = page.getByPlaceholder('Select Country');
    this.countryDropdownResults = page.locator('.ta-results');
    this.emailField = page.locator(".user__name [type='text']").first();
    this.placeOrderButton = page.locator('.action__submit');
    this.thankYouMessage = page.locator('.hero-primary');
  }

  async selectCountry(countryName: string): Promise<void> {
    await this.countryInput.pressSequentially(countryName.slice(0, 3), { delay: 150 });
    await this.countryDropdownResults.waitFor();

    const options = this.countryDropdownResults.locator('button');
    const optionsCount = await options.count();

    for (let i = 0; i < optionsCount; ++i) {
      const text = await options.nth(i).textContent();
      if (text?.trim() === countryName) {
        await options.nth(i).click();
        break;
      }
    }
  }

  async verifyEmail(expectedEmail: string): Promise<boolean> {
    const actualEmail = await this.emailField.textContent();
    return (actualEmail ?? '').trim() === expectedEmail.trim();
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async getThankYouMessage(): Promise<string | null> {
    return await this.thankYouMessage.textContent();
  }
}