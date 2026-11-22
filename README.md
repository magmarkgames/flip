# FLIP v0.26 – räumlicher Schreibtisch und Magnet

## Neu in v0.26

- **Silber-/Goldmünzen sind sofort 3D:** Auch während des ersten Animationsframes bleiben Münzfläche und geriffelter Rand sichtbar. Sie fallen sanft auf die Tischoberfläche, ohne erst flach zu erscheinen.
- **Magnet neu ausgerichtet und vergrößert:** Der Hufeisenmagnet liegt als mehrschichtiges 3D-Modell oben links. Seine beiden silbernen Magnetpole zeigen in Richtung Tisch und haben Kontaktschatten auf dem Holz. Schloss, 10 Level und automatischer Einzug bleiben erhalten.
- **Perspektivisch projizierter 3D-Tisch:** Die Holzoberfläche ist als nach hinten geneigte Ebene dargestellt, mit Lichtverlauf, Schatten am Wandanschluss, tiefer Vorderkante, Unterseite und Tischbeinen. Horizontale Kanten bleiben gerade; interaktive Elemente werden nicht verzerrt.
- **Prägeplatte-Label entfernt:** Der kleine Kasten „PRÄGEPLATTE ×2“ über dem Magneten wurde entfernt. Die ×2-Zielzone funktioniert weiterhin.
- Vorhandene Spielstände und alle bestehenden Upgrades funktionieren weiter.

## Installieren (GitHub Pages)

Die `index.html` im GitHub-Repository ersetzen. Vorher empfiehlt sich unter Einstellungen ein Export des Spielstands. Bei älterem Seiten-Cache ggf. die Seite vollständig neu laden.

## Technische Hinweise

Das Spiel ist weiterhin eine einzelne HTML-Datei und benötigt keine externen Bibliotheken. Die Darstellung ist eine perspektivische HTML/CSS-/SVG-Szene; die Spielphysik und die Touch-Koordinaten bleiben in der geraden Bildschirmebene. Getestet wurden Browser-Spielzug, Magneteinkauf, Upgrade, Speicherkompatibilität, automatische Sammlung sowie mehrere Mobilformate.
