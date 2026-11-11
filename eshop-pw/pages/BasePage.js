const { expect } = require("@playwright/test");

/** Společný základ: navigace v hlavičce a pomocné metody. */
class BasePage {
  constructor(page) {
    this.page = page;
    this.nav = page.locator("header");
    this.loggedInAs = page.getByText(/Logged in as/);
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
    this.cartLink = page.locator("header").getByRole("link", { name: "Cart" });
  }

  async goto(path = "/") {
    await this.page.goto(path);
  }

  async expectLoggedInAs(name) {
    await expect(this.loggedInAs).toContainText(name);
  }

  async logout() {
    await this.logoutLink.click();
  }

  /** Smaže právě přihlášený účet přes odkaz v hlavičce. */
  async deleteAccount() {
    await this.deleteAccountLink.click();
    await expect(
      this.page.getByRole("heading", { name: "Account Deleted!" }),
    ).toBeVisible();
  }
}

module.exports = { BasePage };
