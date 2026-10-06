# TikBet 🎬

Vidéos TikTok de pronostics (1080×1920, 17 s) générées automatiquement avec Remotion.

## Démarrage
```bash
npm install
npm run dev            # Remotion Studio : aperçu live + édition des props
npm run render         # rend data/prono-exemple.json -> out/prono.mp4
npm run render:batch   # rend 1 vidéo par prono de data/pronos.json -> out/
```

## Workflow quotidien (≈5 min)
1. Éditer `data/pronos.json` (1 objet = 1 vidéo).
2. `npm run render:batch`
3. Poster les fichiers de `out/` sur TikTok (+ musique tendance ajoutée dans l'app).

## Format d'un prono
| Champ | Exemple | Conseil |
|---|---|---|
| `accroche` | "Le prono que personne n'ose jouer 👀" | ≤ 8 mots, c'est ce qui fait la rétention |
| `sport` | "⚽ Ligue 1" | |
| `date` | "Ce soir · 21h00" | |
| `equipeDomicile` / `equipeExterieur` | "PSG" / "Marseille" | noms courts |
| `pari` | "PSG gagne & +2,5 buts" | ≤ 25 caractères |
| `cote` | 2.10 | |
| `confiance` | 4 | 1 à 5 |
| `arguments` | 3 phrases | ≤ 45 caractères chacune, chiffrées |

## Structure de la vidéo
Hook (2 s) → Match (2,5 s) → 3 arguments (6,5 s) → Prono + cote animée (4 s) → CTA abonnement (2 s).
La mention légale ANJ (18+, risques, 09 74 75 13 13) est affichée en permanence.

## Personnaliser
- Couleurs : `src/theme.ts`
- Durées : constantes en haut de `src/PronoDuJour.tsx`
