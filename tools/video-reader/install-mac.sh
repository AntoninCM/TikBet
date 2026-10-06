#!/usr/bin/env bash
# Installe le MCP « video-reader » pour Claude Desktop (macOS, fonctionne aussi sous Linux).
# Usage : bash install-mac.sh
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/.claude-video-reader"
PACKAGES=("mcp>=1.2,<2" "yt-dlp[default,curl-cffi]" "youtube-transcript-api>=1.0" "faster-whisper" "av<17")

echo "▶ 1/5 Installation de uv (gestionnaire Python)…"
if ! command -v uv >/dev/null 2>&1 && [ ! -x "$HOME/.local/bin/uv" ]; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi
UV="$(command -v uv || echo "$HOME/.local/bin/uv")"

echo "▶ 2/5 Création de l'environnement Python dans $DEST…"
mkdir -p "$DEST"
cp "$SRC/server.py" "$SRC/configure_claude.py" "$DEST/"
"$UV" venv --quiet --allow-existing --python 3.12 "$DEST/.venv"
PY="$DEST/.venv/bin/python"

echo "▶ 3/5 Installation des dépendances (yt-dlp, Whisper, MCP)…"
"$UV" pip install --quiet --upgrade --python "$PY" "${PACKAGES[@]}"
"$PY" "$DEST/server.py" --selftest >/dev/null

echo "▶ 4/5 Téléchargement du modèle Whisper (une seule fois, ~150 Mo)…"
"$PY" -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"

echo "▶ 5/5 Configuration de Claude Desktop…"
"$PY" "$DEST/configure_claude.py" "$PY" "$DEST/server.py"

cat <<EOF

✅ Installation terminée.

👉 Quitte complètement Claude Desktop (Cmd+Q), puis rouvre-le.
👉 Teste avec : « Lis cette vidéo et résume-la en étapes : <lien YouTube ou TikTok> »

Transcrire une longue vidéo dans le terminal :
   "$PY" "$DEST/server.py" --cli "<URL>"
EOF
