class CartPage
{

constructor(page)
{
    this.page = page;
    this.cartItems = page.locator("div li");
    this.checkoutButton = page.locator("text=Checkout");
}

async verifyProductInCart(productName)
{
    await this.cartItems.first().waitFor();
    const isVisible = await this.page.locator(`h3:has-text('${productName}')`).isVisible();
    return isVisible;
}

async goToCheckout()
{
    await this.checkoutButton.click();
}

}

module.exports = { CartPage };