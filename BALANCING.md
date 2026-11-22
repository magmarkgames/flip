# FLIP v0.14 — Upgrade-Preise & Freischaltungen

Die **Startkosten** beziehen sich jeweils auf den Kauf von Level 1. Der nächste Preis ergibt sich aus `round(Startpreis × (1 + Anstieg)^aktuelles Level)`.

| Pfad | Skill | Startpreis | Preisanstieg | Max. Level | Freischaltung: insgesamt verdiente Coins | Zusätzlich erforderlich |
|---|---|---:|---:|---:|---:|---|
| Vermehrung | Duplication | 6 | 15 % | 50 | 0 | – |
| Vermehrung | Twin Spawn | 100 | 23 % | 20 | 750 | Duplication 10 % |
| Vermehrung | Chain Reaction | 250 | 28 % | 15 | 3.500 | Twin Spawn 10 % |
| Vermehrung | Triple Spawn | 500 | 32 % | 10 | 5.500 | Twin Spawn 10 % |
| Vermehrung | Golden Coin | 80 | 20 % | 10 | 250 | Duplication 5 % |
| Vermehrung | Golden Touch | 300 | 40 % | 5 | 4.000 | Golden Coin 3 % |
| Überleben | Survival | 20 | 18 % | 30 | 50 | – |
| Überleben | Second Chance | 150 | 25 % | 20 | 1.000 | Survival 5 % |
| Überleben | Revival | 150 | 24 % | 5 | 2.000 | Survival 5 % |
| Überleben | Memory | 200 | 26 % | 25 | 3.000 | Survival 10 % |
| Streaks | Streak Protection | 35 | 20 % | 20 | 100 | – |
| Streaks | Streak Skip | 250 | 30 % | 5 | 2.500 | Protection 5 % |
| Streaks | Hot Boost | 100 | 25 % | 10 | 1.000 | Protection 3 % |
| Streaks | Last Flame | 250 | 30 % | 30 | 3.000 | Protection 10 % |
| Streaks | Cold Spawn | 40 | 25 % | 20 | 450 | Protection 2 % |
| Streaks | Comeback Boost | 100 | 28 % | 10 | 800 | Cold Spawn 5 % |
| Spezial | Fast Flip | 35 | 30 % | 15 | 150 | – |
| Spezial | Coin Value | 500 | 100 % | 5 | 3.500 | Fast Flip Level 5 |
| Spezial | Critical Flip | 180 | 45 % | 5 | 500 | Golden Coin 2 % |
| Spezial | Critical Power | 750 | 45 % | 10 | 5.500 | Critical Flip 2 % |

Bei bereits gekauften Fähigkeiten bleibt das Level erhalten, selbst wenn sich die Voraussetzung für die erste Freischaltung geändert hat. Bei einem bestehenden Spielstand werden Level oberhalb der neuen Maximalstufen auf das Limit reduziert. Die überschüssigen Level werden anhand der v0.13-Preiskurve einmalig als Coins erstattet.

Hinweis: Hot Boost gewährt 5 % pro Level (10 Level = +50 %). Cold Spawn gewährt 2 % pro Level (20 Level = 40 %). Duplication wird unter Streak-Boni bei effektiv 95 % begrenzt, sodass es auch mit hohen Serien ein Zufallsereignis bleibt.
