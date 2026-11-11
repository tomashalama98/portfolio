const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

/** Převede "Rs. 1500" na číslo 1500. */
function parsePrice(text) {
  return Number(text.replace(/[^\d]/g, ""));
}

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.rows = page.locator("#cart_info_table tbody tr");
    this.emptyMessage = page.getByText("Cart is empty!");
    this.checkoutButton = page.getByText("Proceed To Checkout");
    this.checkoutModal = page.locator("#checkoutModal");
  }

  async open() {
    await this.goto("/view_cart");
  }

  row(name) {
    return this.rows.filter({ has: this.page.getByRole("link", { name }) });
  }

  /** Vrátí řádek košíku jako číselná data (cena, množství, celkem). */
  async readRow(name) {
    const row = this.row(name);
    await expect(row).toHaveCount(1);
    return {
      price: parsePrice(await row.locator(".cart_price").innerText()),
      quantity: Number(await row.locator(".cart_quantity").innerText()),
      total: parsePrice(await row.locator(".cart_total_price").innerText()),
    };
  }

  /**
   * Odebere položku. Web váže klikací handlery až po načtení skriptů, takže první
   * klik může "vyznít naprázdno" – klik se opakuje, dokud řádek nezmizí.
   */
  async remove(name) {
    const row = this.row(name);
    await expect(async () => {
      if (await row.count()) {
        await row.locator(".cart_quantity_delete").click({ timeout: 2_000 });
      }
      await expect(row).toHaveCount(0, { timeout: 3_000 });
    }).toPass({ timeout: 20_000 });
  }

  /** Klik na "Proceed To Checkout" se opakuje, dokud se neobjeví modal nebo se nezmění URL. */
  async proceedToCheckout({ loggedIn = false } = {}) {
    await expect(async () => {
      await this.checkoutButton.click({ timeout: 2_000 });
      if (loggedIn) {
        await expect(this.page).toHaveURL(/\/checkout/, { timeout: 3_000 });
      } else {
        await expect(this.checkoutModal).toBeVisible({ timeout: 3_000 });
      }
    }).toPass({ timeout: 20_000 });
  }
}

module.exports = { CartPage, parsePrice };
