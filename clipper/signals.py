"""Signaux audio : courbe d'« excitation » (volume relatif au niveau local).

Un pic = le streamer crie / rit / le chat explose / une musique de victoire.
C'est le signal n°1 qu'utilisent les outils type Eklipse en plus du texte.
"""
from __future__ import annotations

import subprocess

import numpy as np

from .ff import ffmpeg_bin

HOP = 0.5  # secondes par fenêtre
SR = 8000


def loudness_curve(video: str) -> np.ndarray:
    """dBFS RMS par fenêtre de HOP secondes, lu en streaming (OK pour un live de 10h)."""
    cmd = [ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-i", video, "-vn", "-ac", "1", "-ar", str(SR),
           "-f", "s16le", "-"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    win = int(SR * HOP)
    out, buf = [], b""
    assert proc.stdout is not None
    while True:
        chunk = proc.stdout.read(win * 2 * 256)
        if not chunk:
            break
        buf += chunk
        n = len(buf) // (win * 2)
        if n:
            a = np.frombuffer(buf[: n * win * 2], dtype=np.int16).astype(np.float32).reshape(n, win) / 32768.0
            rms = np.sqrt((a**2).mean(axis=1) + 1e-10)
            out.extend(20 * np.log10(rms))
            buf = buf[n * win * 2:]
    proc.wait()
    return np.array(out, dtype=np.float32)


def excitement(db: np.ndarray, baseline_s: float = 60.0) -> np.ndarray:
    """Volume au-dessus de la médiane glissante (en dB). Robuste aux changements de niveau du micro."""
    if len(db) == 0:
        return db
    k = max(3, int(baseline_s / HOP))
    pad = np.pad(db, (k // 2, k // 2), mode="edge")
    # médiane glissante approximée par blocs (rapide même sur 72 000 fenêtres)
    step = max(1, k // 8)
    idx = np.arange(0, len(db), step)
    med = np.array([np.median(pad[i: i + k]) for i in idx])
    base = np.interp(np.arange(len(db)), idx, med)
    ex = db - base
    return np.convolve(ex, np.ones(3) / 3, mode="same")  # lissage 1.5 s


def peaks(ex: np.ndarray, min_db: float = 6.0, min_gap_s: float = 20.0, top: int | None = None) -> list[tuple[float, float]]:
    """Liste (temps_s, force_dB) des pics d'excitation, du plus fort au plus faible."""
    order = np.argsort(-ex)
    gap = int(min_gap_s / HOP)
    taken: list[int] = []
    for i in order:
        if ex[i] < min_db:
            break
        if all(abs(i - j) > gap for j in taken):
            taken.append(int(i))
            if top and len(taken) >= top:
                break
    return [(i * HOP, float(ex[i])) for i in taken]


def peaks_in(ex: np.ndarray, start: float, end: float, min_db: float = 4.0, max_n: int = 3, min_gap_s: float = 4.0):
    a, b = int(start / HOP), int(end / HOP)
    sub = ex[a:b]
    return [(start + t, s) for t, s in peaks(sub, min_db=min_db, min_gap_s=min_gap_s, top=max_n)]
