# E2E testy e-shopu automationexercise.com

Automatizované end-to-end testy veřejného cvičného e-shopu
[automationexercise.com](https://automationexercise.com) v Playwrightu
s Page Object Modelem a CI v GitHub Actions.

## Co se testuje

| Oblast | Testy |
|---|---|
| Registrace a přihlášení | registrace + smazání účtu, přihlášení/odhlášení, špatné heslo, už existující e-mail |
| Produkty | vyhledávání (i bez výsledků), filtr kategorie, detail produktu |
| Košík | přidání, změna množství na detailu, odebrání, součet cena × množství, pokladna bez přihlášení |
| Objednávka | end-to-end: přihlášení, košík, pokladna, platba testovací kartou, hláška o úspěchu, smazání účtu |

Každý test má ID (`TC-E01` …) a tag `@smoke` nebo `@regression`.
Celkem 15 testů, z toho jeden (TC-E15) je označen jako známá chyba webu
(`test.fail()`), viz [NALEZY.md](NALEZY.md). Přehled výsledků je ve [VYSLEDEK.md](VYSLEDEK.md).

## Jak spustit

```bash
cd eshop-pw
npm ci                                  # nebo npm install
npx playwright install chromium         # jednou, stáhne prohlížeč
npx playwright test                     # celá sada
npx playwright test --grep @smoke       # jen smoke testy
npx playwright test --grep @regression  # jen regresní testy
npx playwright show-report              # HTML report
```

Jiná adresa webu: `BASE_URL=https://jina-adresa npx playwright test`
(výchozí je `https://automationexercise.com`).

V CI (`CI=true`) se používá 1 opakování neúspěšného testu a trace se ukládá při prvním opakování.
Výstupy: `playwright-report/` (HTML), `results.json`, `test-results/` (trace, screenshoty při chybě).

## Struktura (Page Object Model)

```
eshop-pw/
  playwright.config.js     konfigurace (baseURL, reportery, trace, retries)
  pages/                   page objecty: locatory a akce jedné stránky
    BasePage.js            hlavička, odhlášení, smazání účtu
    LoginPage.js  SignupPage.js
    ProductsPage.js  ProductDetailPage.js
    CartPage.js  CheckoutPage.js
  fixtures/                sdílené fixtury
    index.js               rozšířený `test` (page objecty, uživatelé, blokace reklam)
    user.js                unikátní uživatel (časové razítko + PID + čítač), testovací karta
    api.js                 vytvoření/smazání účtu přes API webu
    ads.js                 seznam blokovaných reklamních domén
  tests/                   *.spec.js (auth, products, cart, order)
```

Testy nevolají `page.locator` přímo, používají jen metody page objectů.
Locatory jsou přes role/label/text, kde to web dovoluje, jinak přes stabilní
`data-qa` atributy nebo ID.

## Reklamy

Web načítá reklamy a souhlasový dialog (Google Funding Choices), které překrývají
stránku a blokují kliknutí. Fixtura `context` v `fixtures/index.js` proto přes
`context.route()` zruší požadavky na reklamní domény (googlesyndication, doubleclick,
adservice, googleadservices, fundingchoices a další, seznam v `fixtures/ads.js`).

## Nezávislost testů a úklid dat

- Každý test dostává vlastní prohlížečový kontext, takže košík (vázaný na session) se nesdílí.
- Uživatele generuje `buildUser()` s unikátním e-mailem. Test, který účet potřebuje, ho
  vytvoří přes API webu (`registeredUser`), což je rychlejší a stabilnější než formulář.
- Po každém testu fixtura účet smaže přes API (`DELETE /api/deleteAccount`), i když test
  selže uprostřed. Testy registrace a objednávky navíc účet mažou přes UI jako součást scénáře.

## Poznámky ke stabilitě

Web váže klikací handlery až po načtení skriptů, takže první klik na tlačítko (košík,
odebrání, pokladna) se občas "ztratí". Page objecty proto klik opakují přes
`expect(...).toPass()`, dokud se neprojeví očekávaný výsledek. Žádné pevné čekání
(`waitForTimeout`) se nepoužívá.

## CI

Workflow [`.github/workflows/eshop-tests.yml`](../.github/workflows/eshop-tests.yml)
běží při push (změna v `eshop-pw/**`), ručně a týdně. Nahrává HTML report a trace jako artefakty.
