# FLIP v0.14 – Upgrade-Limits & Wischsteuerung

**Installation:** Im GitHub-Repository die alte `index.html` durch die neue ersetzen. Bestehender Spielstand bleibt erhalten. Vorher optional Backup unter Einstellungen → Exportieren.

## Alle neuen maximalen Level

| Bereich | Skill | Maximales Level | Effekt bei MAX |
|---|---|---:|---|
| Vermehrung | Duplication | 50 | 50 % Basis-Chance (Streak-Bonus greift weiterhin; tatsächliche Chance wird bei 95 % gedeckelt) |
| Vermehrung | Twin Spawn | 20 | 20 % |
| Vermehrung | Chain Reaction | 15 | 15 % |
| Vermehrung | Triple Spawn | 10 | 10 % |
| Vermehrung | Golden Coin | 10 | 10 % |
| Vermehrung | Golden Touch | 5 | 5 % |
| Überleben | Survival | 30 | 30 % |
| Überleben | Second Chance | 20 | 20 % |
| Überleben | Revival | 5 | 5 % |
| Überleben | Memory | 25 | 25 % |
| Streaks | Streak Protection | 20 | 20 % |
| Streaks | Streak Skip | 5 | 5 % |
| Streaks | Hot Boost | 10 | +50 % Ertrag |
| Streaks | Last Flame | 30 | 30 % |
| Streaks | Cold Spawn | 20 | +40 % Extra-Spawnchance |
| Streaks | Comeback Boost | 10 | +10 Multiplikator |
| Spezial | Fast Flip | 15 | −75 % Wurfzeit |
| Spezial | Coin Value | 5 | +5 Basis-Coins |
| Spezial | Critical Flip | 5 | 5 % |
| Spezial | Critical Power | 10 | ×20 Krit-Multiplikator |

## Neue Steuerung

- Über die ganze Spielfläche wischen: Alle liegenden Münzen werden gleichzeitig geworfen.
- **Kräftiger/weiterer Wisch:** Mehr vollständige Drehungen, **aber gleichbleibende Flughöhe und Wurfdauer**.
- Basiswurfzeit: 2 Sekunden, auf allen Münzen gleich. Nur Fast Flip verringert sie (auf minimal 0,5 Sekunden).
- Wischstärke verändert die Ergebniswahrscheinlichkeit nicht (weiterhin 50:50).
- Während des Wurfs ist der nächste Wisch gesperrt; neue Bonusmünzen landen vor der nächsten Runde.

## Spielstände

Wenn ein vorhandener Spielstand Level oberhalb der neuen Limits enthält, werden die Level bei der ersten Ladung auf das jeweilige neue Maximum gesenkt. Für die überzähligen Level wird einmalig anhand der bisherigen Upgrade-Preiskurve eine Coin-Gutschrift berechnet. Die Erstattung ist eine Annäherung an die früher gezahlten Preise; exakte Kaufhistorien sind nicht gespeichert.

**Preise und Anforderungen für Freischaltungen bleiben sonst unverändert.**
