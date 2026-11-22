# FLIP v0.13 — Upgrade-Tree & 20 Skills

## Installation

Ersetze in deinem GitHub-Repository einfach die bisherige `index.html` durch die neue Datei. GitHub Pages veröffentlicht die neue Version automatisch. Der lokale Spielstand aus v0.1 bis v0.12 bleibt über den unveränderten Speicherschlüssel `flip-v0.1-save` erhalten. Exportiere zur Sicherheit vor der Aktualisierung deinen Spielstand unter **Einstellungen → Spielstand exportieren**.

## Das ist neu

- **20 vollständig funktionierende Upgrades**, davon **11 neu**.
- **Überarbeitete Preise**: jedes Upgrade besitzt einen eigenen Startpreis und eine eigene Preissteigerung.
- **Verzweigter Tree** mit vier Pfaden (Vermehrung, Überleben, Streaks und Spezial) und farbigen, kreisförmigen Levelanzeigen.
- **Schnellnavigation** zwischen den Pfaden, verschiebbare und zoombare Karte, Detailfenster pro Skill.
- **Testmodus**, um sofort alle Upgrades ausprobieren zu können — auch ohne ihre Freischaltbedingungen erfüllen zu müssen.
- Weiterhin das 3D-Holztisch-Design, dieselbe Wischsteuerung, das Comeback-System und kompatible Spielstände.

## Neue Skills und ihre Funktion

### Vermehrung
- **Chain Reaction**: Auch Bonusmünzen können bei ihrem erfolgreichen Wurf neue Bonusmünzen erzeugen (1 Prozentpunkt/Level; max. 25 %).
- **Triple Spawn**: Wenn Twin Spawn auslöst, kann zusätzlich eine dritte Münze erscheinen (1 Prozentpunkt/Level; max. 15 %).
- **Golden Touch**: Eine erfolgreiche Silbermünze kann sich dauerhaft in Gold verwandeln; ihre Serie bleibt erhalten (1 Prozentpunkt/Level; max. 5 %). Der höhere Basiswert gilt ab dem folgenden Wurf.

### Überleben
- **Revival**: Nach gescheitertem Survival kann eine Münze zurückkehren, allerdings mit zurückgesetzter Serie (1 Prozentpunkt/Level; max. 10 %).
- **Memory**: Eine durch Survival gerettete Münze kann ihre Serie behalten (1 Prozentpunkt/Level; max. 25 %).

### Streaks
- **Hot Boost**: Ab einer 2er-Kronenserie +5 % Ertrag pro Level für Haupt- und Bonusmünzen (max. +100 %). Bruchteile werden intern gesammelt, damit auch kleine Level lohnen.
- **Last Flame**: Falls Protection nicht auslöst, kann die positive Serie halbiert statt auf null gesetzt werden (1 Prozentpunkt/Level; max. 10 %).
- **Cold Spawn**: Bei der 3er- und 4er-Totenkopfserie gibt es pro Level +2 % Chance auf eine zusätzliche Bonusmünze (max. +50 %).
- **Comeback Boost**: Erhöht den einmaligen Multiplikator des nächsten erfolgreichen Hauptmünzenwurfs nach mindestens 5 Totenköpfen um 1 je Level (max. +10).

### Spezial
- **Coin Value**: Erhöht den Basiswert der Hauptmünze um +1 Coin pro Level (max. +10).
- **Critical Power**: Erhöht den Critical-Multiplikator von ×10 bis maximal ×20 (+1 pro Level).

## Testmodus — sofort alle Skills testen

1. Öffne den **Upgrade Tree** unten.
2. Tippe oben auf **Testmodus**.
3. Du bekommst ein temporäres Testguthaben. Alle 20 Fähigkeiten sind sofort verfügbar.
4. Tippe auf einen Skill und verwende **Test: +1 Level** oder **Im Test auf MAX setzen**.
5. Schließe das Menü und probiere die Fähigkeiten am Tisch aus.
6. Öffne den Tree und wähle **Testmodus beenden**, um zu deinem echten Spielstand zurückzukehren.

**Wichtig:** Testmodus-Käufe, Einnahmen und neue Bonusmünzen werden **nicht gespeichert**. Wenn du die Seite neu lädst, beginnt automatisch wieder dein echter Spielstand. Während des Testmodus sind Import, Export und Reset gesperrt.

## Hinweise zum Balancing

Die Preisgestaltung ist eine erste, bewusst langfristig angelegte Version. Die genauen Werte stehen in `BALANCING.md`. Bei sehr vielen Münzen werden neue Spawns zur Stabilität auf 500 gleichzeitig vorhandene Bonusmünzen begrenzt; alle vorhandenen Münzen werden weiterhin in jeder Runde geworfen, auch wenn aus Platzgründen nur ein Teil sichtbar ist.
