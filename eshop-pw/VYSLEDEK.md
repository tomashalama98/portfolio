# Výsledek: E2E testy e-shopu automationexercise.com

Datum: 11. 11. 2026. Playwright 1.49.1, Chromium, cílový web https://automationexercise.com.

## Počet testů

15 testů ve 4 skupinách (auth 4, produkty 4, košík 6, objednávka 1).
Z toho 14 běžných a 1 označený jako známá chyba webu (`test.fail()`, TC-E15, viz N-01).
Výsledek "15 passed" znamená 14 zelených testů a 1 očekávané selhání.
Tagy: 6x `@smoke`, 9x `@regression`.

## Výsledky spuštění

Místní běhy (bez retries, 3 workery, `--reporter=list`):

| Běh | Passed | Failed | Flaky | Čas |
|---|---|---|---|---|
| 1 | 15 | 0 | 0 | 23,7 s |
| 2 | 15 | 0 | 0 | 19,7 s |
| 3 | 15 | 0 | 0 | 21,1 s |
| 4 | 15 | 0 | 0 | 20,3 s |
| 5 | 15 | 0 | 0 | 22,5 s |

Běhy s CI konfigurací (`CI=true`: 1 retry, 2 workery, reportery z configu včetně `results.json`):

| Běh | Expected | Unexpected | Flaky | Čas |
|---|---|---|---|---|
| CI 1 | 15 | 0 | 0 | 32,6 s |
| CI 2 | 15 | 0 | 0 | 30,9 s |
| CI 3 | 15 | 0 | 0 | 29,7 s |

Celkem 8 po sobě jdoucích běhů bez neočekávaného selhání.

### Co se při vývoji ukázalo nestabilní (a bylo opraveno)

Před úpravami se při paralelním běhu občas (3 ze 6 běhů) neprovedl první klik na
"Proceed To Checkout" a na odebrání položky z košíku (TC-E11, TC-E13), protože web váže
klikací handlery až po načtení skriptů. Opraveno opakováním kliku přes
`expect(...).toPass()` v page objectech (bez pevných čekání) a doplněním blokace
souhlasového dialogu Google Funding Choices (`fundingchoices`, `googlefc`).
Po opravě 8 běhů bez selhání, test nebyl smazán ani přeskočen.

## Seznam testů

| ID | Tag | Co ověřuje |
|---|---|---|
| TC-E01 | @smoke | Registrace nového uživatele přes formulář, přihlášení po registraci a smazání účtu. |
| TC-E02 | @smoke | Přihlášení existujícího uživatele, zobrazení jména a odhlášení. |
| TC-E03 | @regression | Přihlášení se špatným heslem zobrazí chybu a nepřihlásí. |
| TC-E04 | @regression | Registrace s už existujícím e-mailem je odmítnuta. |
| TC-E05 | @smoke | Vyhledávání "dress" vrátí známé produkty (hledá se i podle kategorie). |
| TC-E06 | @regression | Vyhledání neexistujícího produktu nevrátí žádnou položku. |
| TC-E07 | @regression | Filtr kategorie Women > Dress zobrazí jen produkty té kategorie. |
| TC-E08 | @smoke | Detail produktu zobrazí název, kategorii, cenu, dostupnost, stav a značku. |
| TC-E09 | @smoke | Přidání produktu z výpisu do košíku (cena, množství 1, celkem). |
| TC-E10 | @regression | Množství zadané na detailu produktu se přenese do košíku (4 × 500 = 2000). |
| TC-E11 | @regression | Odebrání produktu z košíku vyprázdní košík. |
| TC-E12 | @regression | U dvou produktů platí celkem = cena × množství. |
| TC-E13 | @regression | Nepřihlášený uživatel je u pokladny vyzván k registraci/přihlášení. |
| TC-E14 | @smoke | End-to-end objednávka přihlášeného uživatele, platba testovací kartou, hláška o úspěchu, smazání účtu. |
| TC-E15 | @regression | Záporné množství nesmí skončit v košíku (očekávané selhání kvůli N-01). |

## Nálezy webu

- **N-01** (střední): web přijme nulové a záporné množství, v košíku vznikne položka
  s množstvím -2 a cenou Rs. -1000. Podrobnosti v [NALEZY.md](NALEZY.md).

Dále jedno pozorování bez nálezu: vyhledávání hledá i podle kategorie.

## Omezení

- Testy běží proti veřejnému webu, jehož dostupnost a chování nemám pod kontrolou.
- GitHub Actions workflow jsem nespouštěl, jen ho napsal; lokálně byla ověřena stejná konfigurace s `CI=true`.
- Testuje se jen Chromium.
