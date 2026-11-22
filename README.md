# FLIP v0.29

- **Münze kehrt sicher zurück:** Rückflug ist zeitlich abgesichert. Unterbrochene Browseranimationen, gesperrte Tabs und JavaScript-Fehler können die Kupfermünze nicht mehr dauerhaft auf dem Spielfeld festhalten. Nach jeder Runde wird die Startposition im `finally`-Block wiederhergestellt.
- **Ebenen korrigiert:** Die Kupfermünze fliegt vor dem Magneten, aber hinter dem Lampenkörper und dem durchscheinenden Lichtkegel. Licht und Lampe blockieren keine Touch-Eingaben.
- **Lampe größer und höher positioniert:** Sie sitzt weiter rechts und über dem sichtbaren Tisch; die räumliche Darstellung umfasst einen geschlossenen Schirmkörper, Metallseiten, gerollten Rand, innere Lichtöffnung und Zylinderarme.
- **Sichtbarer Lichtkegel:** Dünnes, warmes, leicht unscharfes Licht vom Schirm zum exakten bestehenden ×2-Feld. Der Kreis bleibt die Trefferfläche und deren Gameplay ist unverändert.
- Speichern, Magnet-Freischaltungen, Münzgewinne und übrige Funktionen bleiben kompatibel.

GitHub Pages: Die `index.html` im Repository ersetzen. Vorher optional Spielstand exportieren.
