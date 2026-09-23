# TikBet — auto-clipping de lives pour TikTok

Transforme un live (10 min comme 10 h) en clips verticaux prêts à poster : sélection des meilleurs moments par IA, teaser en ouverture, sous-titres karaoké, zooms, effets sonores.

Fonctionnement détaillé (façon Eklipse, grille de viralité, effets) : [docs/CLIPPING.md](docs/CLIPPING.md)

## Installation

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # pour la sélection par Claude
```

ffmpeg est fourni par `imageio-ffmpeg` si absent de la machine.

## Utilisation

```bash
# 5 clips, teaser = la chute du clip, fond flouté
python -m clipper mon_live.mp4 --count 5 --lang fr

# Format streamer : facecam en haut (x,y,w,h en pixels de la vidéo source), jeu en bas
python -m clipper mon_live.mp4 --layout split --facecam 1500,780,420,300

# Teaser pris dans un autre moment du live + musique de fond duckée
python -m clipper mon_live.mp4 --teaser cross --music beat.mp3

# Sans clé API : sélection sur les pics audio uniquement
python -m clipper mon_live.mp4 --no-llm

# Juste la liste des moments (pas de rendu), pour valider avant de monter
python -m clipper mon_live.mp4 --select-only
```

Sortie dans `out/` :
- `clip_01.mp4` … : 1080x1920, 30 fps, H.264, -14 LUFS
- `clip_01.ass` : sous-titres éditables (Aegisub) si besoin de retoucher
- `clips.json` : bornes, hook, titre, hashtags, scores, raison du choix
- `<live>.transcript.json` : transcript en cache (relancer = pas de re-transcription)

## Pipeline

| Module | Rôle |
|---|---|
| `clipper/transcribe.py` | Whisper mot-à-mot, mis en cache |
| `clipper/signals.py` | Courbe d'excitation audio (dB au-dessus de la médiane locale), pics |
| `clipper/moments.py` | Sélection par Claude (sorties structurées) ou heuristique, recalage sur les phrases |
| `clipper/captions.py` | Sous-titres karaoké + hook texte (.ass) |
| `clipper/sfx.py` | Whoosh / impact / pop synthétisés |
| `clipper/render.py` | Montage ffmpeg en une passe : teaser, jump cuts, layout 9:16, zooms, SFX, musique, loudness |
