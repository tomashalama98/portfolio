const base = require("@playwright/test");
const { blockAds } = require("./ads");
const { buildUser, TEST_CARD } = require("./user");
const { createAccountViaApi, deleteAccountViaApi } = require("./api");
const { LoginPage } = require("../pages/LoginPage");
const { SignupPage } = require("../pages/SignupPage");
const { ProductsPage } = require("../pages/ProductsPage");
const { ProductDetailPage } = require("../pages/ProductDetailPage");
const { CartPage } = require("../pages/CartPage");
const { CheckoutPage } = require("../pages/CheckoutPage");

const test = base.test.extend({
  // Každý test má v kontextu zablokované reklamy.
  context: async ({ context }, use) => {
    await blockAds(context);
    await use(context);
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  // Unikátní uživatel, který se po testu vždy smaže (i kdyby ho test nevytvořil).
  newUser: async ({ request }, use) => {
    const user = buildUser();
    await use(user);
    await deleteAccountViaApi(request, user);
  },

  // Už zaregistrovaný uživatel (přes API), po testu se smaže.
  registeredUser: async ({ request }, use) => {
    const user = buildUser("registered");
    await createAccountViaApi(request, user);
    await use(user);
    await deleteAccountViaApi(request, user);
  },

  card: async ({}, use) => use(TEST_CARD),
});

module.exports = { test, expect: base.expect };
