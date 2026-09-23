# Auto-clipping de lives → TikTok : comment ça marche

## 1. Comment Eklipse (et Opus Clip, Vizard, StreamLadder…) choisit les moments

Aucun de ces outils ne « regarde » vraiment la vidéo comme un humain. Ils combinent des **signaux bon marché** pour trouver des candidats, puis un **modèle de scoring** pour les classer.

| Signal | Ce qu'il détecte | Coût | Dans notre pipeline |
|---|---|---|---|
| Volume audio relatif (pic au-dessus du niveau local) | cris, rires, rage, musique de victoire | quasi gratuit | ✅ `signals.py` |
| Transcription (Whisper) | punchlines, questions, enjeux, conflits | ~temps réel sur CPU | ✅ `transcribe.py` |
| LLM sur le transcript | hook, cohérence standalone, chute | ~0,20-0,40 € par heure de live | ✅ `moments.py` (Claude) |
| Activité du chat Twitch (msgs/s, emotes « KEKW », « OMEGALUL ») | le moment où la communauté réagit | gratuit si on a le log | ❌ à ajouter (très bon signal) |
| Événements du jeu (kill, victoire, écran de fin) | modèles de vision entraînés par jeu | cher | ❌ (ce qui fait la spécificité d'Eklipse sur Valorant/Fortnite…) |
| Détection de visage / émotion sur la facecam | grosse réaction visuelle | moyen | ❌ optionnel |

Le schéma général :

```
LIVE (10 min ou 10 h)
  ├─ audio  → courbe de volume → pics (+X dB au-dessus du niveau local)
  ├─ Whisper → transcript mot-à-mot horodaté
  └─ (chat Twitch) → pics de messages
          ↓
  Candidats = fenêtres de 15-60 s autour des pics / des phrases fortes
          ↓
  Scoring LLM : HOOK · RÉTENTION · PAYOFF · STANDALONE
          ↓
  Recalage des bornes sur les phrases (jamais couper un mot)
          ↓
  Montage : 9:16, teaser, sous-titres, zooms, SFX, musique, loudness
```

**Pourquoi ça marche** : sur un live, 90 % du temps est « plat ». Les 10 % utiles correspondent presque toujours à une rupture (le volume monte, le rythme de parole accélère, le chat explose). L'audio trouve *où* ça se passe ; le LLM décide *où commencer et finir* pour que le clip tienne debout tout seul.

## 2. Ce qui fait un clip viral (la grille de scoring)

| Critère | Poids | Question que se pose le modèle |
|---|---|---|
| **Hook** | 35 % | Les 2 premières secondes arrêtent-elles le scroll ? (phrase choc, question, enjeu, réaction) |
| **Rétention** | 25 % | Y a-t-il une tension qui monte, sans temps mort ? Une boucle ouverte ? |
| **Payoff** | 25 % | Y a-t-il une chute / réaction / révélation forte à la fin ? |
| **Standalone** | 15 % | Quelqu'un qui ne connaît pas le streamer comprend-il ? |

Règles de coupe codées dans le prompt :
- **Commencer le plus tard possible** : jamais sur « euh », « bon », une salutation ou du contexte.
- **Finir 0,5 à 1 s après la chute** : chaque seconde après le payoff fait chuter la rétention (et empêche le re-visionnage en boucle).
- Durée idéale **20-45 s**.

## 3. Le teaser (« preview » / cold open)

C'est la technique la plus rentable pour le hook. On monte **1,5 à 3,5 s du moment le plus fort** *avant* le clip, puis flash blanc + whoosh, et le clip démarre normalement.

| Mode | Principe | Quand l'utiliser |
|---|---|---|
| `--teaser same` (défaut) | On remonte **la chute du clip lui-même** au début. Le spectateur voit la réaction, veut comprendre *pourquoi* → il reste jusqu'à la fin. | 90 % des cas. Le plus sûr : la promesse est tenue. |
| `--teaser cross` | On prend **un autre moment du live** (lié au même sujet, encore plus fort) avec le bandeau « PLUS TARD DANS LE LIVE… ». | Pour des séries « partie 1 / 2 », ou quand le clip lui-même manque de pic visuel. ⚠️ Si la promesse n'est jamais tenue, les gens swipent et commentent « clickbait » → l'algo pénalise. Idéalement, publier le moment teasé comme clip suivant. |
| `--teaser auto` | Claude choisit le plus efficace. | Pour tester. |
| `--teaser none` | Pas de teaser. | Si le clip commence déjà sur une phrase choc. |

## 4. Effets visuels (ce que fait le pipeline, et pourquoi)

| Effet | Réglage par défaut | Rôle |
|---|---|---|
| **Format 9:16** : `blur` (vidéo entière + fond flouté), `crop` (recadrage plein écran), `split` (facecam en haut / jeu en bas) | `--layout blur` | `split` = le format « streamer » le plus performant quand il y a une facecam. |
| **Hook texte** en haut, boîte blanche, effet *slam* (grossit puis se pose) | 3-8 mots, visible teaser + 2,5 s | 50 % des gens regardent sans le son : le hook doit être lisible. |
| **Sous-titres karaoké** 1-3 mots, MAJUSCULES, mot actif en jaune, *pop* à chaque groupe | contour noir épais | +rétention mesurable sur TikTok ; l'œil suit le mot actif. |
| **Jump cuts** : suppression des silences > 0,45 s | `--no-jumpcuts` pour désactiver | Rythme « TikTok » ; retire souvent 15-25 % du clip. |
| **Punch-in zooms** ×1,18 sur les pics audio (+ ×1,12 pendant le teaser) | `--no-zooms` | Relance l'attention toutes les 5-8 s ; souligne la réaction. |
| **Flash blanc** entre teaser et clip | 0,12 s + 0,25 s | Marque clairement « retour au début ». |

Idées d'effets à ajouter ensuite (par ordre d'impact) :
1. **Emojis / mots-clés en gros** sur les punchlines (le LLM peut les proposer par timestamp).
2. **Barre de progression** en bas (augmente le taux de complétion sur les clips > 30 s).
3. **Shake** de caméra sur les cris (`crop` avec x/y oscillants).
4. **Recadrage intelligent** sur le visage qui parle (MediaPipe) pour le layout `crop`.
5. **Freeze frame + « ??? »** juste avant la chute.

## 5. Effets audio

| Effet | Quand | Pourquoi |
|---|---|---|
| **Impact** (grosse caisse grave) | apparition du hook texte à 0 s | Donne du poids au hook, réveille le spectateur. |
| **Whoosh** | transition teaser → clip | Signale la coupure ; évite l'effet « bug ». |
| **Pop** | chaque punch-in zoom | Synchronise le visuel et le son (sensation de « montage pro »). |
| **Musique de fond duckée** (`--music`) | tout le clip, -20 dB, baissée automatiquement quand quelqu'un parle (sidechain) | Comble les micro-silences, donne une énergie. Prendre un son tendance de la bibliothèque TikTok **au moment de publier** plutôt que de l'incruster (droits + bonus algo). |
| **Normalisation -14 LUFS** | toujours | Niveau standard des plateformes : le clip n'est ni trop faible ni saturé. |

Les SFX sont **synthétisés** (libres de droits) dans `out/_sfx/`. Pour un rendu plus pro, déposez vos propres `whoosh.wav`, `impact.wav`, `pop.wav` dans un dossier et passez `--sfx-dir`.

À ajouter ensuite : *riser* (montée) 1 s avant la chute, *record scratch* sur un moment gênant, bip de censure automatique sur les gros mots (on a déjà les timestamps mot-à-mot).

## 6. Coûts et temps (ordre de grandeur)

| Étape | Live de 10 min | Live de 10 h |
|---|---|---|
| Transcription Whisper `small` (CPU) | 3-10 min | 3-8 h → utiliser un GPU ou `--whisper-model base` |
| Courbe audio | < 5 s | ~2 min |
| Sélection Claude | 1 appel, ~0,10-0,20 € | ~15 appels (blocs de 40 min), ~2-4 € |
| Rendu par clip (preset `medium`) | ~30-60 s | idem, par clip |

## 7. Limites connues

- La sélection ne « voit » pas l'image : un moment purement visuel (clutch silencieux) ne sera détecté que via le volume. → Ajouter le log du chat Twitch est le meilleur complément.
- Le teaser `cross` n'est cherché que dans le même bloc de 40 min du transcript.
- Le layout `split` demande les coordonnées de la facecam (`--facecam x,y,w,h` en pixels de la vidéo source).
