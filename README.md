# Portfolio testera softwaru – Tomáš Halama

[![E2E testy e-shopu](https://github.com/tomashalama98/portfolio/actions/workflows/eshop-tests.yml/badge.svg)](https://github.com/tomashalama98/portfolio/actions/workflows/eshop-tests.yml)

Web: [tomashalama.cz](https://tomashalama.cz) · Další projekt: [tracker investičních akcí](https://github.com/tomashalama98/investicni-tracker)

Praktický projekt, na kterém jsem si prošel celý testovací cyklus na webové aplikaci pro evidenci revizí.

| Složka | Obsah |
|---|---|
| `docs/` | Web s portfoliem (GitHub Pages) a testovaná aplikace v `docs/aplikace/` |
| `pw/` | Automatizované E2E testy v Playwrightu (6 testů) |
| `sql/` | Cvičná SQLite databáze a skript, který ji vytvoří |
| `api/` | Cvičné API a jeho testy (Node.js, bez knihoven) |
| `eshop-pw/` | E2E testy veřejného e-shopu: 15 testů, Page Object Model, běží v GitHub Actions po každé změně a každé pondělí ([podrobnosti](eshop-pw/README.md)) |

## Spuštění testů

```bash
cd pw
npm ci
npx playwright install chromium
npx playwright test
```
