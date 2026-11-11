const { test, expect } = require("../fixtures");
const { parsePrice } = require("../pages/CartPage");

test.describe("Objednávka", () => {
  // TC-E14: End-to-end – přihlášený uživatel koupí produkt a zaplatí testovací kartou,
  // následně smaže účet.
  test("TC-E14 přihlášený uživatel dokončí objednávku @smoke", async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    registeredUser,
    card,
  }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedInAs(registeredUser.name);

    await productsPage.open();
    await productsPage.addToCart("Blue Top");
    await productsPage.viewCartLink.click();
    const row = await cartPage.readRow("Blue Top");
    await cartPage.proceedToCheckout({ loggedIn: true });

    // Rekapitulace: adresa z registrace a správná celková částka.
    await expect(checkoutPage.deliveryAddress).toContainText(registeredUser.address);
    await expect(checkoutPage.billingAddress).toContainText(registeredUser.city);
    expect(parsePrice(await checkoutPage.totalAmount.innerText())).toBe(row.total);

    await checkoutPage.placeOrderWithComment("Prosím zabalit jako dárek.");
    await checkoutPage.pay(card);

    await expect(checkoutPage.orderPlaced).toHaveText(/Order Placed!/i);
    await expect(checkoutPage.successMessage).toBeVisible();

    // Úklid smazáním účtu přes UI (fixture ho ještě jistí přes API).
    await checkoutPage.deleteAccount();
  });
});
