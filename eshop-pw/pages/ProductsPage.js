const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.heading = page.locator(".features_items .title");
    this.addedModal = page.locator("#cartModal");
    this.continueShopping = this.addedModal.getByRole("button", {
      name: "Continue Shopping",
    });
    this.viewCartLink = this.addedModal.getByRole("link", { name: "View Cart" });
  }

  async open() {
    await this.goto("/products");
    await expect(this.heading).toHaveText("All Products");
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await expect(this.heading).toHaveText("Searched Products");
  }

  /** Rozbalí skupinu kategorií (Women/Men/Kids) a otevře podkategorii. */
  async openCategory(group, subcategory) {
    await this.page
      .locator(".category-products .panel-title a", { hasText: group })
      .click();
    await this.page
      .locator(`#${group} a`, { hasText: subcategory })
      .click();
  }

  productNames() {
    return this.productCards.locator(".productinfo p");
  }

  card(name) {
    return this.productCards
      .filter({ has: this.page.locator(".productinfo p", { hasText: name }) })
      .first();
  }

  /** Přidá produkt podle názvu do košíku (tlačítko v kartě). */
  async addToCart(name) {
    const card = this.card(name);
    await expect(async () => {
      await card.hover();
      await card.locator(".product-overlay .add-to-cart").click({ timeout: 2_000 });
      await expect(this.addedModal).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 20_000 });
  }

  async openDetail(name) {
    await this.card(name).getByRole("link", { name: "View Product" }).click();
  }
}

module.exports = { ProductsPage };
