# FLIP v0.2

Ein kleines Incremental Game mit einer permanenten Münze und temporären Bonusmünzen. Kein Build, keine Abhängigkeiten, kein Backend.

## Start

`index.html` im Browser öffnen oder über GitHub Pages (Settings → Pages → Deploy from a branch → main → /(root)) veröffentlichen. Die HTML-Datei muss im Hauptverzeichnis liegen.

## Regeln

- Hauptmünze: fairer Wurf, Kopf +1 Coin, Zahl +0.
- Kopfserien multiplizieren den gesamten Rundenertrag (1 → ×1, 2 → ×2 usw.). Zahl setzt die Serie normalerweise zurück.
- Duplication: Bei Kopf der Hauptmünze Chance auf eine zusätzliche Bonusmünze. Neue Bonusmünzen werfen erst ab der nächsten Runde mit.
- Bonusmünzen: Zahl +1 Coin und sie bleiben; Kopf +0 und sie verschwinden normalerweise. Nur die Hauptmünze erzeugt Bonusmünzen und beeinflusst die Serie.
- Survival: Chance, dass eine Bonusmünze bei Kopf trotzdem bleibt. Streak Protection: Chance, dass die Serie bei Zahl bestehen bleibt.
- Alle Fähigkeiten starten bei 0 %, +1 Prozentpunkt je Kauf, maximal 100 %. Startpreise 10, 40, 75 Coins; Kosten = gerundet(Startpreis × 1,2^Level). Weitere Fähigkeiten erscheinen bei 50 und 100 insgesamt verdienten Coins.
- Der Spielstand wird lokal gespeichert; manuelle JSON-Sicherung und Import in den Einstellungen.

## Update v0.2
Die index.html im bestehenden Repository ersetzen. Speicherformat und lokaler Speicherschlüssel bleiben unverändert. Der Hauptbildschirm ist scrollbar-frei, mit vier festen Upgrade-Slots; Statistik, Einstellungen und Regeln sind über die Header-Icons erreichbar. Die Münzen zeigen ihren Basis-Ertrag (1 oder 0).
