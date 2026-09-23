"""Helpers autour de ffmpeg : localisation du binaire, probe, exécution."""
from __future__ import annotations

import re
import shutil
import subprocess
from dataclasses import dataclass
from functools import lru_cache


@lru_cache(maxsize=1)
def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:  # pragma: no cover
        raise SystemExit("ffmpeg introuvable : installez ffmpeg ou `pip install imageio-ffmpeg`.") from exc


@dataclass
class MediaInfo:
    duration: float
    width: int
    height: int
    fps: float


def probe(path: str) -> MediaInfo:
    """Lit durée / résolution / fps depuis la sortie de `ffmpeg -i` (pas besoin de ffprobe)."""
    proc = subprocess.run([ffmpeg_bin(), "-hide_banner", "-i", path], capture_output=True, text=True)
    err = proc.stderr
    m = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", err)
    if not m:
        raise SystemExit(f"Impossible de lire la vidéo : {path}\n{err[-800:]}")
    h, mi, s = m.groups()
    duration = int(h) * 3600 + int(mi) * 60 + float(s)
    width, height, fps = 1920, 1080, 30.0
    for line in err.splitlines():
        if "Video:" in line:
            dm = re.search(r", (\d{2,5})x(\d{2,5})[, \[]", line)
            if dm:
                width, height = int(dm.group(1)), int(dm.group(2))
            fm = re.search(r"(\d+(?:\.\d+)?) fps", line)
            if fm:
                fps = float(fm.group(1))
            break
    return MediaInfo(duration, width, height, fps)


def run(args: list[str], quiet: bool = True) -> None:
    cmd = [ffmpeg_bin(), "-hide_banner", "-y"] + (["-loglevel", "error"] if quiet else []) + args
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError("ffmpeg a échoué :\n" + " ".join(cmd) + "\n\n" + proc.stderr[-3000:])
