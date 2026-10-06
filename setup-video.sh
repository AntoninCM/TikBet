#!/bin/sh
# Installe tout le studio vidéo de TikBet (macOS / Linux / WSL). Sans risque si on le relance.
#   sh setup-video.sh
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
SKILL="$ROOT/.claude/skills/motion-reel"

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }
ok() { printf '  ✓ %s\n' "$1"; }
warn() { printf '  ! %s\n' "$1"; }

say "1/4  Vérification des outils"
if ! command -v node >/dev/null || ! command -v ffmpeg >/dev/null; then
  if command -v brew >/dev/null; then
    brew install node ffmpeg
  else
    echo "Il manque Node 20+ ou ffmpeg. Sur Mac, installe Homebrew (https://brew.sh) puis relance ce script."; exit 1
  fi
fi
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
[ "$NODE_MAJOR" -ge 20 ] && ok "node $(node -v)" || { echo "Node $(node -v) est trop ancien : il faut Node 20+ (brew upgrade node)."; exit 1; }
ok "ffmpeg"

say "2/4  Remotion (studio/)"
(cd "$ROOT/studio" && npm install --no-audit --no-fund --loglevel=error) && ok "dépendances Remotion installées"

say "3/4  Motion Reel Kit : Playwright + Chromium"
(cd "$SKILL" && npm install --no-audit --no-fund --loglevel=error && npx --yes playwright install chromium >/dev/null) \
  && ok "playwright + chromium prêts" || warn "échec : /motion-reel ne pourra pas rendre (Remotion n'est pas concerné)"

say "4/4  Motion Reel Kit : librairies audio Python"
if python3 -c "import numpy, scipy, soundfile, librosa, PIL" 2>/dev/null; then
  ok "déjà installées"
elif python3 -m pip install --user -q -r "$SKILL/requirements.txt" 2>/dev/null \
  || python3 -m pip install --user -q --break-system-packages -r "$SKILL/requirements.txt" 2>/dev/null; then
  ok "installées"
else
  warn "pip a refusé : musique et mix de /motion-reel indisponibles (Remotion n'est pas concerné)"
fi

say "✅ Terminé"
echo "  Preview :   cd studio && npm run dev        (ouvre http://localhost:3000)"
echo "  Rendu   :   cd studio && npx remotion render TikTok out/tiktok.mp4"
echo "  Claude  :   lancer 'claude' dans ce dossier : les skills Remotion et /motion-reel sont chargées."
