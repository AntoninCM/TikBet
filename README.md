# TikBet — Radar des TikTok viraux FR

Scanner gratuit (sans compte TikTok, sans API payante) qui détecte les vidéos virales françaises
et les trends émergentes par **boule de neige de hashtags**.

## Résultats du premier scan (7 derniers jours, 07/10/2026)

- 4 870 vidéos uniques collectées, 600 FR publiées il y a moins de 7 jours, **349 virales (100k+ vues)** → `data/viraux_fr_7j.csv`
- Trend détectée automatiquement sans mot-clé de départ : **#blocus / #lycée / #manifestation** (mouvement lycéen)

| Méthode | Viraux FR <7j trouvés | Exclusifs | Part de vidéos récentes |
|---|---|---|---|
| A. Hashtags génériques (#pourtoi, #ptdr…) | 106 | 80 | 20 % |
| B. Pages de sons | 16 | 2 | 12 % |
| **C. Hashtags découverts par boule de neige** | **262** | **241** | **38 %** |

**Conclusion : A sert d'amorce, C fait le travail (75 % des viraux).** Les pages de sons sont peu utiles sans compte
(les « sons originaux » renvoient presque rien, les sons commerciaux renvoient surtout des vieilles vidéos).

## Ce qui ne marche pas sans compte (testé)

- Recherche TikTok (redirige vers la connexion), liste des vidéos d'un créateur (vide)
- Google / Bing / DuckDuckGo depuis un serveur (bloqués anti-bot)
- Spotify « Viral 50 » (playlist plus disponible) — le **Top 50 France** reste lisible via `open.spotify.com/embed/playlist/37i9dQZEVXbIPWwFssbupI`

## Utilisation

```bash
export PWPATH=$(npm root -g)/playwright          # Playwright + Chromium requis
node scanner/collect.js scanner/seeds_hashtags.txt round1.jsonl 8   # 1. amorce
python3 scanner/analyze.py round1.jsonl                              # 2. score FR + filtre 7 jours → rows.json
python3 scanner/snowball.py 15                                       # 3. nouveaux hashtags/sons → snow.txt
node scanner/collect.js snow.txt round2.jsonl 5                      # 4. boule de neige
python3 scanner/analyze.py round1.jsonl round2.jsonl                 # 5. analyse finale
```

Limites : l'IP du serveur est hors de France, et la détection FR est heuristique (`textLanguage` + mots FR + exclusion
des marqueurs de francophonie hors France). Scraping = contraire aux CGU TikTok : garder un volume modéré.
