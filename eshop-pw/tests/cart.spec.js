const { test, expect } = require("../fixtures");

test.describe("Košík", () => {
  // TC-E09: Přidání produktu z výpisu produktů do košíku.
  test("TC-E09 přidání produktu do košíku z výpisu @smoke", async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    await productsPage.addToCart("Blue Top");
    await productsPage.viewCartLink.click();

    await expect(cartPage.rows).toHaveCount(1);
    const row = await cartPage.readRow("Blue Top");
    expect(row).toEqual({ price: 500, quantity: 1, total: 500 });
  });

  // TC-E10: Změna množství na detailu produktu se projeví v košíku.
  test("TC-E10 změna množství na detailu produktu @regression", async ({
    productDetailPage: detail,
    cartPage,
  }) => {
    await detail.open(1);
    await detail.addToCart(4);
    await detail.viewCartLink.click();

    const row = await cartPage.readRow("Blue Top");
    expect(row.quantity).toBe(4);
    expect(row.total).toBe(2000);
  });

  // TC-E11: Odebrání produktu vyprázdní košík.
  test("TC-E11 odebrání produktu z košíku @regression", async ({
    productDetailPage: detail,
    cartPage,
  }) => {
    await detail.open(1);
    await detail.addToCart();
    await detail.viewCartLink.click();
    await expect(cartPage.rows).toHaveCount(1);

    await cartPage.remove("Blue Top");

    await expect(cartPage.rows).toHaveCount(0);
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  // TC-E12: Celková cena řádku = cena × množství, u více produktů zvlášť.
  test("TC-E12 součet ceny v košíku = cena × množství @regression", async ({
    productDetailPage: detail,
    cartPage,
  }) => {
    await detail.open(1);
    await detail.addToCart(3);
    await detail.addedModal.getByRole("button", { name: "Continue Shopping" }).click();

    await detail.open(2);
    await detail.addToCart(2);
    await detail.viewCartLink.click();

    await expect(cartPage.rows).toHaveCount(2);
    for (const name of ["Blue Top", "Men Tshirt"]) {
      const row = await cartPage.readRow(name);
      expect(row.total, `řádek ${name}`).toBe(row.price * row.quantity);
    }
  });

  // TC-E13: Nepřihlášený uživatel nemůže dokončit objednávku – nabídne se přihlášení.
  test("TC-E13 nepřihlášený uživatel je u pokladny vyzván k přihlášení @regression", async ({
    productDetailPage: detail,
    cartPage,
  }) => {
    await detail.open(1);
    await detail.addToCart();
    await detail.viewCartLink.click();
    await cartPage.proceedToCheckout();

    await expect(cartPage.checkoutModal).toBeVisible();
    await expect(
      cartPage.checkoutModal.getByRole("link", { name: "Register / Login" }),
    ).toBeVisible();
    await expect(cartPage.page).toHaveURL(/\/view_cart/);
  });

  // TC-E15: Záporné množství nesmí skončit v košíku se zápornou cenou.
  // Známá chyba webu, viz NALEZY.md (N-01): web množství -2 přijme a celkem je Rs. -1000.
  test("TC-E15 záporné množství nesmí být přijato do košíku @regression", async ({
    productDetailPage: detail,
    cartPage,
  }) => {
    test.fail(true, "N-01: web přijme záporné množství (viz NALEZY.md)");
    test.info().annotations.push({ type: "bug", description: "N-01" });

    await detail.open(1);
    await detail.addToCart(-2);
    await cartPage.open();

    // Očekávání: položka se zápornou hodnotou v košíku není.
    const quantities = await cartPage.rows.locator(".cart_quantity").allInnerTexts();
    for (const q of quantities) {
      expect(Number(q)).toBeGreaterThan(0);
    }
  });
});
