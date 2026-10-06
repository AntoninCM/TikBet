# TikBet

## Studio vidéo (Remotion + Claude)

On crée nos vidéos TikTok/YouTube **en code** : Claude écrit des composants React, et Remotion en fait des MP4.

### Installation (une fois)
- **Mac / Linux** : `sh setup-video.sh`
- **Windows** : double-cliquer sur `setup-video-windows.bat` (Remotion uniquement ; `/motion-reel` demande WSL)

### Utilisation
1. `cd studio && npm run dev` : la preview s'ouvre sur http://localhost:3000.
2. Dans un autre terminal, à la racine du repo : `claude`.
3. On décrit la vidéo, par exemple :
   > Crée une vidéo TikTok de 12 s : hook « Pourquoi 90 % des parieurs perdent », 3 raisons, CTA « Suis-nous ». Montre-moi d'abord la shotlist.
4. On valide la shotlist, Claude construit, et on regarde en direct dans le Studio.
5. Rendu : `cd studio && npx remotion render TikTok out/tiktok.mp4`

Pour changer juste le texte ou les couleurs, pas besoin de Claude : panneau **Props** à droite dans le Studio.

### Ce qui est installé
| Élément | Rôle |
|---|---|
| `studio/` | Projet Remotion avec deux compositions, `TikTok` (9:16) et `YouTube` (16:9) |
| `.claude/skills/remotion-*` | Les 12 skills officielles Remotion (bonnes pratiques, sous-titres, rendu…) |
| `.claude/skills/motion-reel` | Skill `/motion-reel` du Motion Reel Kit (Lukas Margerie) : reel de lancement produit à partir d'une URL, avec musique synthétisée et boucle de critique |
| `CLAUDE.md` | Nos règles de motion : springs, clichés bannis, rythme TikTok, boucle de critique |
| `docs/motion-reel-prompts/` | Prompts du kit : brief réalisateur, grille de critique |
| `tools/video-reader/` | MCP pour Claude Desktop qui lit les tutos YouTube/TikTok |

**Licence Remotion** : gratuite pour les particuliers et les entreprises de 3 personnes maximum. Au-delà, il faut une licence (https://www.remotion.pro/license).
