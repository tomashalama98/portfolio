# Nálezy při testování automationexercise.com

Pouze skutečně pozorované chování (ověřeno 11. 11. 2026, opakovaně a ručně přes skript
i automatizovaným testem). Chyby webu jsem neopravoval, jsou jen zdokumentované.

## N-01: Web přijme nulové a záporné množství produktu v košíku

- **Závažnost:** střední (chybná validace vstupu, nesmyslná cena v košíku).
- **Související test:** TC-E15 (`tests/cart.spec.js`), označen `test.fail()` s anotací `bug: N-01`.
- **Kroky:**
  1. Otevřít detail produktu `/product_details/1` (Blue Top, Rs. 500).
  2. Do pole "Quantity" zadat `-2` (u hodnoty `0` je chování stejné).
  3. Kliknout na "Add to cart" a otevřít `/view_cart`.
- **Očekáváno:** množství menší než 1 se odmítne (nebo opraví na 1), v košíku není položka
  se zápornou cenou.
- **Skutečnost:** web zobrazí potvrzení "Added!" a v košíku je položka Blue Top s množstvím
  `-2` a celkovou cenou `Rs. -1000`. U množství `0` je v košíku řádek s množstvím `0`
  a cenou `Rs. 0`. Atribut `min="1"` na poli se uplatní jen v prohlížeči a tlačítko
  "Add to cart" (`type="button"`) formulář neodesílá, takže validace chybí i na straně serveru.

## Pozorování (nejde o chybu, jen poznámka)

- Vyhledávání "dress" vrací i produkty, jejichž název slovo neobsahuje (např. "Sleeves Top and
  Short - Blue & Pink"). Hledá se zřejmě i podle kategorie, proto TC-E05 kontroluje, že ve
  výsledcích jsou známé produkty "Sleeveless Dress" a "Stylish Dress", a nepožaduje shodu u všech.
- Desetinné množství (`1.5`) web nepřijal (košík zůstal prázdný), to je v pořádku.
