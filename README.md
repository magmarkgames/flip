# FLIP v0.15 – Performance Update

Änderungen:
- 3D-Kantensegmente: von bisher 80 je Münze auf 56 (Hauptmünze) / 28 (Bonusmünzen).
- Auf schmalen Displays maximal 8 gleichzeitig dargestellte Bonusmünzen; weitere Münzen wirken weiterhin auf Gewinne, Streaks und Spielstand und werden mit `+N` angezeigt.
- Alle Münzen werfen weiterhin in einer Runde; die nicht gezeichneten Münzen werden regelkonform mitberechnet.
- Münzbewegungen animieren mit `transform` statt mit Layout-Properties `left/top`.
- Leichtere Schattenanimationen ohne während des Wurfs animierte Blur-Filter.
- Positionssuche ohne Hunderte temporäre Arrays pro Münze.
- Versteckter Skill-Tree wird nicht pro Wurf zweimal neu aufgebaut.
- Statistikansicht wird nur aktualisiert, wenn sie offen ist.
- Keine Änderungen am Balancing oder Speicherformat. Spielstandschlüssel bleibt `flip-v0.1-save`.

Upload: `index.html` im bestehenden GitHub-Repository ersetzen. Vorher Spielstand exportieren.
