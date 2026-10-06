# TikBet : studio vidéo en code

## Structure
- `studio/` : projet **Remotion** (React → MP4). C'est l'outil par défaut pour nos vidéos TikTok/YouTube.
  - `src/Root.tsx` : compositions `TikTok` (1080×1920) et `YouTube` (1920×1080), avec le contenu dans `defaultProps`.
  - `src/reel/Reel.tsx` : template « hook → points → CTA ».
  - `src/lib/motion.ts` : presets de springs (`snappy`, `default`, `heavy`, `playful`), plus `enter()` et `track()`.
- `.claude/skills/remotion-*` : skills officielles Remotion. Les charger via `remotion-best-practices` avant d'écrire du code Remotion.
- `.claude/skills/motion-reel` : skill `/motion-reel` du Motion Reel Kit. C'est un moteur HTML + Playwright, **pas Remotion**. On l'utilise uniquement pour un reel de lancement produit à partir d'une URL.
- `docs/motion-reel-prompts/` : prompts du kit (brief réalisateur, grille de critique).
- `tools/video-reader/` : MCP qui lit les vidéos YouTube/TikTok (tutos, références).

## Commandes (depuis `studio/`)
- Preview interactive : `npm run dev`. Ouvrir le Studio **avant** de coder, pour voir le résultat en direct.
- Image fixe : `npx remotion still TikTok out/f.png --frame=60`
- Rendu : `npx remotion render TikTok out/tiktok.mp4`
- Vérif : `npm run lint` (eslint + tsc). Elle doit passer avant chaque commit.

## Règles de rendu
- Une vidéo est une fonction pure de la frame : tout dérive de `useCurrentFrame()`.
- Interdits : `Math.random`, `setTimeout`, `requestAnimationFrame`, transitions et animations CSS, état gardé entre frames. Pour l'aléatoire, utiliser `random(seed)` de `remotion`.
- Médias : `<Img>`, `<Video>` / `<OffthreadVideo>`, `<Audio>` de Remotion, et `staticFile()` pour `public/`. Jamais `<img>` brut.
- Polices locales via `@remotion/fonts` (dans `public/fonts/`), pour un rendu identique hors ligne.

## Motion
- Uniquement des springs, via `enter()` / `track()` de `src/lib/motion.ts`. Pas de courbe d'easing pour une entrée ou une sortie.
- Petit dépassement sur l'UI (`snappy`), aucun sur le texte (`heavy`). `playful` est réservé aux mascottes.
- Une valeur à plusieurs cibles passe par `track()` : un spring par changement, sans jamais en redémarrer un.
- Un simple fondu d'opacité n'est jamais une entrée ni une sortie. On utilise des masques (`clipPath`), des translations et des échelles.

## Look (clichés bannis)
- Titre centré sur un dégradé, tout qui apparaît en fondu, glow, particules, fondus enchaînés, rotations, effets glitch, easing qui rebondit sur l'UI, temps mort.
- Une police d'affichage, une police d'UI, une seule couleur d'accent.
- Pour une vidéo produit, utiliser la vraie UI, les vrais logos et les vraies polices. Ne jamais redessiner une UI qui existe.

## Rythme TikTok
- Hook lisible en moins de 2 s, quelque chose de nouveau toutes les 2 à 4 s, carton final de 2 s maximum.
- Zone sûre 9:16 : rien d'important dans les 250 px du haut, les 400 px du bas, ni les 140 px de droite (UI TikTok).
- Texte lisible sur un téléphone : vérifier une image réduite à 360 px de large.

## Boucle avant de montrer quoi que ce soit
1. Sortir une image par scène (`npx remotion still … --frame=N`), les assembler en planche contact et la **regarder**.
2. Noter de 1 à 10 : hook en 2 s, lisibilité sur téléphone, qualité du mouvement, variété, fidélité à la marque, synchro du son.
3. Corriger les 3 pires problèmes, puis recommencer jusqu'à ce que toutes les notes soient d'au moins 8.
4. Seulement ensuite, lancer le rendu complet.

## Workflow d'une nouvelle vidéo
Brief → shotlist (plan par plan : texte exact, durée, mouvement) → **attendre notre OK** → build dans le Studio → boucle de critique → rendu.
Template de brief : `docs/motion-reel-prompts/directors-brief-template.md`.
