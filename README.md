# Portfolio testera softwaru – Tomáš Halama

Praktický projekt, na kterém jsem si prošel celý testovací cyklus na webové aplikaci pro evidenci revizí.

| Složka | Obsah |
|---|---|
| `docs/` | Web s portfoliem (GitHub Pages) a testovaná aplikace v `docs/aplikace/` |
| `pw/` | Automatizované E2E testy v Playwrightu (6 testů) |
| `sql/` | Cvičná SQLite databáze a skript, který ji vytvoří |
| `api/` | Cvičné API a jeho testy (Node.js, bez knihoven) |

## Spuštění testů

```bash
cd pw
npm ci
npx playwright install chromium
npx playwright test
```
