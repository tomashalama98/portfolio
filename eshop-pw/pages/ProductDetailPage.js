const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.info = page.locator(".product-information");
    this.name = this.info.locator("h2");
    this.category = this.info.locator("p", { hasText: "Category:" });
    this.price = this.info.locator("span span");
    this.availability = this.info.locator("p", { hasText: "Availability:" });
    this.condition = this.info.locator("p", { hasText: "Condition:" });
    this.brand = this.info.locator("p", { hasText: "Brand:" });
    this.quantity = page.locator("#quantity");
    this.addButton = page.getByRole("button", { name: "Add to cart" });
    this.addedModal = page.locator("#cartModal");
    this.viewCartLink = this.addedModal.getByRole("link", { name: "View Cart" });
  }

  async open(id) {
    await this.goto(`/product_details/${id}`);
    await expect(this.info).toBeVisible();
  }

  async addToCart(quantity) {
    if (quantity !== undefined) await this.quantity.fill(String(quantity));
    // Klik se opakuje, dokud se neobjeví potvrzovací modal (handlery se váží po načtení skriptů).
    await expect(async () => {
      await this.addButton.click({ timeout: 2_000 });
      await expect(this.addedModal).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 20_000 });
  }
}

module.exports = { ProductDetailPage };
