import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly products: Locator;
  readonly productsText: Locator;
  readonly cart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.products = page.locator('.card-body');
    this.productsText = page.locator('.card-body b');
    this.cart = page.locator("[routerlink*='cart']");
  }

  async searchProductAddCart(productName: string): Promise<void> {
    const titles = await this.productsText.allTextContents();
    console.log(titles);

    const count = await this.products.count();
    for (let i = 0; i < count; ++i) {
      const name = (await this.products.nth(i).locator('b').textContent())?.trim();
      if (name === productName) {
        // add to cart
        await this.products.nth(i).locator('text=Add To Cart').click();
        break;
      }
    }
  }

  async goToCart(): Promise<void> {
    await this.cart.click();
  }
}