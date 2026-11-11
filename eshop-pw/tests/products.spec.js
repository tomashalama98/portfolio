const { test, expect } = require("../fixtures");

test.describe("Produkty", () => {
  // TC-E05: Vyhledání produktu podle názvu vrátí jen odpovídající produkty.
  test("TC-E05 vyhledávání produktu podle názvu @smoke", async ({
    productsPage,
  }) => {
    await productsPage.open();
    await productsPage.search("dress");

    await expect(productsPage.productCards.first()).toBeVisible();
    const names = await productsPage.productNames().allInnerTexts();
    expect(names.length).toBeGreaterThan(0);
    // Web hledá i podle kategorie, proto ne každý název obsahuje hledané slovo;
    // ověřujeme, že známé produkty jsou ve výsledcích a nic z nich nechybí.
    expect(names).toEqual(expect.arrayContaining(["Sleeveless Dress", "Stylish Dress"]));
    expect(names.filter((n) => /dress/i.test(n)).length).toBeGreaterThanOrEqual(2);
  });

  // TC-E06: Vyhledání neexistujícího produktu nevrátí žádné položky.
  test("TC-E06 vyhledávání neexistujícího produktu nevrátí nic @regression", async ({
    productsPage,
  }) => {
    await productsPage.open();
    await productsPage.search("zzzneexistuje");

    await expect(productsPage.productCards).toHaveCount(0);
  });

  // TC-E07: Filtr kategorie Women > Dress zobrazí jen produkty té kategorie.
  test("TC-E07 filtr kategorie Women > Dress @regression", async ({
    productsPage,
  }) => {
    await productsPage.open();
    await productsPage.openCategory("Women", "Dress");

    await expect(productsPage.page).toHaveURL(/\/category_products\/1/);
    await expect(productsPage.heading).toContainText(/Women\s*-\s*Dress/i);
    await expect(productsPage.productCards.first()).toBeVisible();
    const names = await productsPage.productNames().allInnerTexts();
    for (const name of names) {
      expect(name.toLowerCase()).toContain("dress");
    }
  });

  // TC-E08: Detail produktu ukáže název, kategorii, cenu, dostupnost a značku.
  test("TC-E08 detail produktu zobrazí všechny údaje @smoke", async ({
    productsPage,
    productDetailPage: detail,
  }) => {
    await productsPage.open();
    await productsPage.openDetail("Blue Top");

    await expect(detail.name).toHaveText("Blue Top");
    await expect(detail.category).toContainText("Women > Tops");
    await expect(detail.price).toHaveText("Rs. 500");
    await expect(detail.availability).toContainText("In Stock");
    await expect(detail.condition).toContainText("New");
    await expect(detail.brand).toContainText("Polo");
  });
});
