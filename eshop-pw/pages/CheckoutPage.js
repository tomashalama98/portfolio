const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.deliveryAddress = page.locator("#address_delivery");
    this.billingAddress = page.locator("#address_invoice");
    this.totalAmount = page.locator(".cart_total_price").last();
    this.comment = page.locator('textarea[name="message"]');
    this.placeOrder = page.getByRole("link", { name: "Place Order" });
    this.nameOnCard = page.locator('[data-qa="name-on-card"]');
    this.cardNumber = page.locator('[data-qa="card-number"]');
    this.cvc = page.locator('[data-qa="cvc"]');
    this.expiryMonth = page.locator('[data-qa="expiry-month"]');
    this.expiryYear = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
    this.orderPlaced = page.locator('[data-qa="order-placed"]');
    this.successMessage = page.getByText(
      "Congratulations! Your order has been confirmed!",
    );
  }

  async placeOrderWithComment(text) {
    await expect(this.page).toHaveURL(/\/checkout/);
    await this.comment.fill(text);
    await this.placeOrder.click();
    await expect(this.page).toHaveURL(/\/payment/);
  }

  async pay(card) {
    await this.nameOnCard.fill(card.name);
    await this.cardNumber.fill(card.number);
    await this.cvc.fill(card.cvc);
    await this.expiryMonth.fill(card.expiryMonth);
    await this.expiryYear.fill(card.expiryYear);
    await this.payButton.click();
  }
}

module.exports = { CheckoutPage };
