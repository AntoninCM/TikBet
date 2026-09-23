"""Effets sonores synthétisés avec ffmpeg (aucun asset externe, libres de droits).

Remplacez-les par vos propres .wav dans --sfx-dir (whoosh.wav, impact.wav, pop.wav) pour un rendu plus « pro ».
"""
from __future__ import annotations

import os

from .ff import run

RECIPES = {
    # souffle filtré : transition teaser -> clip
    "whoosh": "anoisesrc=d=0.7:c=pink:a=0.7:r=48000,bandpass=f=1400:width_type=o:w=2.5,"
              "afade=t=in:d=0.45:curve=exp,afade=t=out:st=0.45:d=0.25",
    # grosse caisse qui chute en fréquence : apparition du hook texte
    "impact": "aevalsrc='0.95*sin(2*PI*(42+110*exp(-22*t))*t)*exp(-4.5*t)':d=0.9:s=48000",
    # petit « pop » : zooms / punch-in
    "pop": "aevalsrc='0.7*sin(2*PI*(1100-700*t/0.09)*t)*exp(-38*t)':d=0.15:s=48000",
}


def ensure(sfx_dir: str) -> dict[str, str]:
    os.makedirs(sfx_dir, exist_ok=True)
    paths = {}
    for name, recipe in RECIPES.items():
        p = os.path.join(sfx_dir, f"{name}.wav")
        if not os.path.exists(p):
            run(["-f", "lavfi", "-i", recipe, "-ac", "2", p])
        paths[name] = p
    return paths
