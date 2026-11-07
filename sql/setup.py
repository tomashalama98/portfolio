# Vytvoří malou SQLite databázi s revizemi a spustí ukázkové dotazy.
import sqlite3, os

DB = os.path.join(os.path.dirname(__file__), "revize.db")
if os.path.exists(DB):
    os.remove(DB)

con = sqlite3.connect(DB)
cur = con.cursor()
cur.execute("""
CREATE TABLE revize (
  id INTEGER PRIMARY KEY,
  jerab TEXT NOT NULL,
  datum TEXT NOT NULL,
  technik TEXT NOT NULL,
  vysledek TEXT NOT NULL,
  dalsi_revize TEXT
)
""")

data = [
    (1, "Liebherr LTM 1050", "2026-09-10", "Novák",   "Vyhověl",     "2027-09-10"),
    (2, "Tatra AD 28",        "2026-10-02", "Svoboda", "S výhradami", "2026-11-24"),
    (3, "Demag AC 40",        "2026-07-18", "Dvořák",  "Nevyhověl",   "2026-10-25"),
    (4, "Grove GMK 3050",     "2026-11-01", "Horák",   "Vyhověl",     "2027-11-01"),
    (5, "Liebherr LTM 1090",  "2026-08-15", "Novák",   "Nevyhověl",   "2026-11-30"),
    (6, "Tatra AD 20",        "2026-10-20", "Svoboda", "Vyhověl",     "2027-04-20"),
]
cur.executemany("INSERT INTO revize VALUES (?,?,?,?,?,?)", data)
con.commit()


def tisk(nadpis, sql):
    print("=== " + nadpis + " ===")
    print("SQL: " + sql)
    cur.execute(sql)
    sloupce = [d[0] for d in cur.description]
    rows = cur.fetchall()
    sirky = [max(len(str(sloupce[i])), *(len(str(r[i])) for r in rows)) if rows else len(sloupce[i]) for i in range(len(sloupce))]
    print("  " + " | ".join(str(sloupce[i]).ljust(sirky[i]) for i in range(len(sloupce))))
    print("  " + "-+-".join("-" * sirky[i] for i in range(len(sloupce))))
    for r in rows:
        print("  " + " | ".join(str(r[i]).ljust(sirky[i]) for i in range(len(sloupce))))
    print("")


tisk("Celá tabulka (všechny sloupce, všechny řádky)",
     "SELECT * FROM revize")

tisk("Které jeřáby u revize NEPROŠLY?",
     "SELECT jerab, technik, vysledek FROM revize WHERE vysledek = 'Nevyhověl'")

con.close()
print("Databáze uložena:", DB)
