"""CLI : python -m clipper LIVE.mp4 --count 5

Pipeline : transcription -> signaux audio -> sélection (Claude) -> recalage -> montage vertical.
"""
from __future__ import annotations

import argparse
import json
import os
import sys

from . import moments, sfx, signals, transcribe
from .ff import probe
from .render import RenderOpts, render


def main(argv: list[str] | None = None) -> None:
    p = argparse.ArgumentParser(prog="clipper", description="Extrait automatiquement des clips TikTok d'un live.")
    p.add_argument("video")
    p.add_argument("--out", default="out", help="dossier de sortie")
    p.add_argument("--count", type=int, default=5, help="nombre de clips voulus")
    p.add_argument("--min-len", type=float, default=15)
    p.add_argument("--max-len", type=float, default=60)
    p.add_argument("--transcript", help="transcript JSON existant (sinon faster-whisper)")
    p.add_argument("--whisper-model", default="small", help="tiny|base|small|medium|large-v3")
    p.add_argument("--lang", default=None, help="langue du live (ex: fr), auto sinon")
    p.add_argument("--no-llm", action="store_true", help="sélection par pics audio uniquement (pas d'API)")
    p.add_argument("--teaser", choices=["same", "cross", "auto", "none"], default="same",
                   help="same = la chute du clip en ouverture ; cross = un moment d'ailleurs dans le live")
    p.add_argument("--layout", choices=["blur", "crop", "split"], default="blur")
    p.add_argument("--facecam", help="x,y,w,h de la webcam dans la vidéo source (layout split)")
    p.add_argument("--crop-x", type=float, default=0.5)
    p.add_argument("--no-jumpcuts", action="store_true")
    p.add_argument("--no-zooms", action="store_true")
    p.add_argument("--no-sfx", action="store_true")
    p.add_argument("--sfx-dir", help="dossier avec vos propres whoosh.wav / impact.wav / pop.wav")
    p.add_argument("--music", help="musique de fond (sera baissée automatiquement quand ça parle)")
    p.add_argument("--music-db", type=float, default=-20)
    p.add_argument("--font", default="DejaVu Sans", help="ex: 'Montserrat Black' si installée")
    p.add_argument("--preset", default="medium", help="x264 preset (ultrafast pour tester)")
    p.add_argument("--select-only", action="store_true", help="n'écrit que clips.json, sans rendu")
    a = p.parse_args(argv)

    os.makedirs(a.out, exist_ok=True)
    info = probe(a.video)
    print(f"[vidéo] {info.duration / 60:.1f} min, {info.width}x{info.height} @ {info.fps:g} fps")

    base = os.path.splitext(os.path.basename(a.video))[0]
    if a.transcript:
        tr = transcribe.load(a.transcript)
    else:
        tr = transcribe.transcribe(a.video, os.path.join(a.out, f"{base}.transcript.json"), a.whisper_model, a.lang)
    words = transcribe.all_words(tr)

    print("[audio] calcul de la courbe d'excitation…")
    ex = signals.excitement(signals.loudness_curve(a.video))

    if a.no_llm:
        ideas = moments.select_heuristic(tr, ex, a.count, a.min_len, a.max_len)
    else:
        mode = "same" if a.teaser == "none" else a.teaser
        ideas = moments.select_llm(tr, ex, a.count, mode, a.min_len, a.max_len)
    ideas = [moments.snap(c, tr, info.duration, a.min_len, a.max_len) for c in ideas]
    if not ideas:
        sys.exit("Aucun moment trouvé. Essayez --no-llm ou baissez --min-len.")

    opts = RenderOpts(
        layout=a.layout,
        facecam=tuple(int(v) for v in a.facecam.split(",")) if a.facecam else None,
        crop_x=a.crop_x, teaser=a.teaser != "none", jumpcuts=not a.no_jumpcuts, zooms=not a.no_zooms,
        sfx=None if a.no_sfx else sfx.ensure(a.sfx_dir or os.path.join(a.out, "_sfx")),
        music=a.music, music_db=a.music_db, font=a.font, preset=a.preset,
    )
    if a.layout == "split" and not opts.facecam:
        sys.exit("--layout split demande --facecam x,y,w,h")

    report = []
    for i, c in enumerate(ideas, 1):
        entry = {"rank": i, "score": round(moments.score(c), 2), **c.model_dump()}
        print(f"\n#{i}  {c.start:.1f}s → {c.end:.1f}s  score {entry['score']}  «{c.hook_text}»\n    {c.why}")
        if not a.select_only:
            out = os.path.join(a.out, f"clip_{i:02d}.mp4")
            entry["render"] = render(a.video, info, c, words, ex, out, opts)
            print(f"    ✔ {out} ({entry['render']['duration']} s, {entry['render']['cut_seconds']} s de blancs coupés)")
        report.append(entry)

    with open(os.path.join(a.out, "clips.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"\nTerminé → {a.out}/clips.json (titres, hashtags, scores)")


if __name__ == "__main__":
    main()
