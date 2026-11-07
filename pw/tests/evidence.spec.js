const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

// Appku otevíráme jako lokální soubor (file://), aby ji prohlížeč načetl.
const APP = pathToFileURL(path.join(__dirname, "..", "app.html")).href;

// Před každým testem: čistá karta prohlížeče → appka nasype 3 vzorové záznamy
// (Liebherr = v pořádku, Tatra = za 20 dní „blíží se", Demag = po termínu).
test.beforeEach(async ({ page }) => {
  await page.goto(APP);
});

test("appka se načte a ukáže 3 vzorové záznamy", async ({ page }) => {
  await expect(page.locator("#count")).toHaveText("3");
  await expect(page.locator("tbody tr")).toHaveCount(3);
});

test("BUG-02: formulář nejde odeslat bez jména technika", async ({ page }) => {
  await page.fill("#jerab", "Grove GMK 3050");
  await page.fill("#datum", "2026-11-20");
  // technika schválně NEvyplníme
  await page.click('button[type="submit"]');

  // Očekáváme chybovou hlášku a žádný nový záznam (pořád 3).
  await expect(page.locator("#msg.error")).toBeVisible();
  await expect(page.locator("#count")).toHaveText("3");
});

test("BUG-01: filtr „Nevyhověl\" ukáže jen „Nevyhověl\"", async ({ page }) => {
  await page.selectOption("#filtr", "Nevyhověl");

  const radky = page.locator("tbody tr");
  await expect(radky).toHaveCount(1); // jen Demag
  await expect(radky.first()).toContainText("Nevyhověl");
  // a rozhodně ne „S výhradami"
  await expect(page.locator("tbody")).not.toContainText("S výhradami");
});

test("BUG-03: smazání záznamu sníží počet", async ({ page }) => {
  await expect(page.locator("#count")).toHaveText("3");

  await page.locator("tbody tr").first().locator("[data-del]").click();
  await page.click("#confirmDel"); // potvrzení v okně

  await expect(page.locator("#count")).toHaveText("2");
  await expect(page.locator("tbody tr")).toHaveCount(2);
});

test("BUG-04 + OBS-05: zvýraznění „blíží se\" a „po termínu\"", async ({ page }) => {
  const tatra = page.locator("tbody tr", { hasText: "Tatra AD 28" });
  await expect(tatra).toContainText("blíží se"); // revize za 20 dní

  const demag = page.locator("tbody tr", { hasText: "Demag AC 40" });
  await expect(demag).toContainText("po termínu"); // revize v minulosti
});

test("Happy path: přidání platného záznamu projde", async ({ page }) => {
  await page.fill("#jerab", "Grove GMK 3050");
  await page.fill("#datum", "2026-11-20");
  await page.fill("#technik", "Horák");
  await page.selectOption("#vysledek", "Vyhověl");
  await page.click('button[type="submit"]');

  await expect(page.locator("#count")).toHaveText("4");
  await expect(page.locator("tbody")).toContainText("Grove GMK 3050");
});
