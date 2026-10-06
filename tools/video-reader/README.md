# video-reader : Claude Desktop lit YouTube, TikTok, Reels…

Un outil MCP local, `lire_video`, qui renvoie le titre, la description et la **transcription complète** d'une vidéo.

| Ordre | Méthode | Vitesse |
|---|---|---|
| 1 | Transcription officielle YouTube | ~1 s |
| 2 | Sous-titres (manuels ou auto) via yt-dlp | ~2 s |
| 3 | Audio téléchargé + Whisper en local (TikTok, Reels, vidéos sans sous-titres) | ~10-30 s par minute de vidéo |

Tout tourne sur notre machine : c'est gratuit, sans clé API, et rien n'est envoyé à un service tiers.

## Installation (une seule fois)

1. Télécharger ce dossier `tools/video-reader` (GitHub → **Code → Download ZIP**, puis dézipper).
2. Lancer l'installeur :
   - **Mac** : ouvrir Terminal, taper `bash `, glisser `install-mac.sh` dans la fenêtre, puis Entrée.
   - **Windows** : double-cliquer sur `install-windows.bat`.
3. **Quitter complètement** Claude Desktop (Cmd+Q sur Mac, ou Quitter depuis la barre des tâches sur Windows), puis le rouvrir.

L'installeur s'occupe de tout : Python isolé (via `uv`), dépendances, modèle Whisper et config de Claude Desktop. L'ancienne config est sauvegardée en `.backup-…`.

## Utilisation

Dans Claude Desktop :

> Lis cette vidéo et extrais les étapes du tuto sous forme de checklist : https://www.tiktok.com/@…/video/…

## Réglages (facultatifs)

Ces variables d'environnement se mettent dans le bloc `"env"` du serveur, dans `claude_desktop_config.json` :

- `WHISPER_MODEL` : `base` par défaut. `small` est plus précis mais 2 à 3× plus lent.
- `MAX_WHISPER_MINUTES` : `20` par défaut. Au-delà, il faut passer par le terminal :
  `~/.claude-video-reader/.venv/bin/python ~/.claude-video-reader/server.py --cli "<URL>"`

## Si ça ne marche pas

- L'outil n'apparaît pas : Claude Desktop n'a pas été complètement quitté. Il faut le fermer puis le relancer.
- TikTok renvoie une erreur : yt-dlp n'est plus à jour. Il suffit de relancer l'installeur, qui met tout à jour.
- Les logs sont dans Claude Desktop → Réglages → Développeur → video-reader.
