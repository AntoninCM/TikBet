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

---

# LiveUp / LiveSuccess — vidéos promo 🌟

**50 variantes** générées automatiquement (`src/liveup/variantes.ts`) = 6 angles × 3 accroches × formats.

| Type | Nb | Durée | Usage |
|---|---|---|---|
| `LiveUp-<angle>-hN-9x16` | 18 | 18–21 s | TikTok / Reels organiques + pubs 9:16 |
| `LiveUp-<angle>-h1-4x5` / `-1x1` | 12 | 18–21 s | Pubs feed Meta |
| `LiveUp-<angle>-hN-bumper` | 18 | 6 s | Test d'accroches à petit budget |
| `LiveUp-presentation-9x16` / `-16x9` | 2 | 42 s | Présentation complète (site, YouTube, partenaires) |

Angles : `preuve` (chiffres), `douleur` (galère en live), `ecosysteme` (LiveSuccess/LiveShow/LiveMatch/LiveAngel), `communaute` (avis Love Wall), `challenge` (14 jours, dès 50 abonnés), `methode` (setup, managers).

```bash
npm run render:liveup              # rend les 50 vidéos -> out/liveup/
npm run render:liveup -- bumper    # filtre (angle, format, "bumper"…)
npm run catalogue:liveup           # data/liveup-variantes.csv : tableau de suivi des tests pub
```

**Ajouter des variantes** : ajouter une accroche dans `ANGLES` (`src/liveup/variantes.ts`) → 2 vidéos de plus (9:16 + bumper). `*mot*` = surligné en or.
**Modifier un texte / chiffre** : `src/liveup/contenu.ts` (tout est repris de livesuccess.app et liveupagency.fr, relevé le 06/10/2026).
**Assets** : `public/liveup/logo.png` (logo officiel), `public/liveup/fond.mp4` (vidéo mascotte du site).

---

# Promo « 100K → 500K 💎 en 90 jours » 🚀

Vidéo pub premium 9:16 de 48 s avec bande-son synthétisée et calée image par image (`src/promo500k/`).
```bash
npm run audio:500k    # régénère la bande-son à partir de la timeline (python3 + numpy)
npm run render:500k   # -> out/Promo500k.mp4
```
Timings et bruitages : `src/promo500k/timeline.ts`. Kit marketing (légende, textes pubs, accroches, plan de test) : `docs/promo-500k.md`.

---

# Série A — 6 vidéos « secrets » 🔓

Moteur de vidéos par scènes (`src/secrets/`) : hook → mythe → SECRET (drop musical) → démonstration → hacks → CTA.
Les scripts sont dans `src/secrets/scripts.ts` ; une nouvelle vidéo = un nouvel objet dans `SECRETS`.
```bash
npm run audio:secrets    # une bande-son par vidéo, calée sur ses scènes
npm run render:secrets   # -> out/liveup/Secret-*.mp4
```
Kit de publication (légendes, commentaires épinglés, DM par mot-clé) : `docs/serie-a-secrets.md`.

**Série B — 5 secrets par profil** (matcheurs, gamers, GTA RP, artistes, lives discussion) : même moteur, scripts dans `PROFILS`.
Rendu : `node scripts/render-liveup.mjs Secret-B`. Kit : `docs/serie-b-profils.md`.
