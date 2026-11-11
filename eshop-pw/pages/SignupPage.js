const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole("heading", {
      name: "Enter Account Information",
    });
    this.password = page.locator('[data-qa="password"]');
    this.days = page.locator('[data-qa="days"]');
    this.months = page.locator('[data-qa="months"]');
    this.years = page.locator('[data-qa="years"]');
    this.firstName = page.locator('[data-qa="first_name"]');
    this.lastName = page.locator('[data-qa="last_name"]');
    this.company = page.locator('[data-qa="company"]');
    this.address = page.locator('[data-qa="address"]');
    this.country = page.locator('[data-qa="country"]');
    this.state = page.locator('[data-qa="state"]');
    this.city = page.locator('[data-qa="city"]');
    this.zipcode = page.locator('[data-qa="zipcode"]');
    this.mobile = page.locator('[data-qa="mobile_number"]');
    this.createButton = page.locator('[data-qa="create-account"]');
    this.accountCreated = page.getByRole("heading", { name: "Account Created!" });
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async fillAndSubmit(user) {
    await expect(this.heading).toBeVisible();
    await this.page.getByLabel("Mr.").check();
    await this.password.fill(user.password);
    await this.days.selectOption(user.birthDay);
    await this.months.selectOption({ label: user.birthMonthName });
    await this.years.selectOption(user.birthYear);
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.company.fill(user.company);
    await this.address.fill(user.address);
    await this.country.selectOption(user.country);
    await this.state.fill(user.state);
    await this.city.fill(user.city);
    await this.zipcode.fill(user.zipcode);
    await this.mobile.fill(user.mobile);
    await this.createButton.click();
  }
}

module.exports = { SignupPage };
