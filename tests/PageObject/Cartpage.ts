import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('div li');
    this.checkoutButton = page.locator('text=Checkout');
  }

  async verifyProductInCart(productName: string): Promise<boolean> {
    await this.cartItems.first().waitFor();
    return await this.page.locator(`h3:has-text('${productName}')`).isVisible();
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}