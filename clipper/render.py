"""Montage final d'un clip vertical 1080x1920 en une seule passe ffmpeg.

Timeline de sortie :
  [TEASER 1.5-3.5 s] --flash blanc + whoosh--> [CLIP avec jump cuts]
Par-dessus : hook texte (slam + impact), sous-titres karaoké, punch-in zooms (+ pop)
sur les pics audio, musique de fond « duckée » sous la voix, loudness -14 LUFS.
"""
from __future__ import annotations

import os
from dataclasses import dataclass

import numpy as np

from . import captions, signals
from .ff import MediaInfo, run
from .moments import ClipIdea

W, H = 1080, 1920


@dataclass
class RenderOpts:
    layout: str = "blur"  # blur | crop | split
    facecam: tuple[int, int, int, int] | None = None  # x,y,w,h dans la vidéo source (layout split)
    crop_x: float = 0.5  # 0 = gauche, 1 = droite (layouts crop/split)
    split_ratio: float = 0.4  # part de la hauteur donnée à la facecam
    teaser: bool = True
    jumpcuts: bool = True
    max_pause: float = 0.45  # silences plus longs = coupés
    zooms: bool = True
    sfx: dict | None = None  # {"whoosh": path, "impact": path, "pop": path}
    music: str | None = None
    music_db: float = -20.0
    font: str = "DejaVu Sans"
    hook_seconds: float = 2.5
    fps: int = 30
    crf: int = 20
    preset: str = "medium"


# ---------------------------------------------------------------- timeline

def keep_ranges(words: list[dict], start: float, end: float, max_pause: float) -> list[tuple[float, float]]:
    """Plages à garder dans [start, end] : on supprime les silences > max_pause (jump cuts)."""
    ws = [w for w in words if w["end"] > start and w["start"] < end]
    if not ws:
        return [(start, end)]
    ranges = [[start, ws[0]["end"] + 0.12]]
    for w in ws[1:]:
        a = max(start, w["start"] - 0.08)
        if a - ranges[-1][1] > max_pause - 0.2:
            ranges.append([a, w["end"] + 0.12])
        else:
            ranges[-1][1] = w["end"] + 0.12
    ranges[-1][1] = end  # on garde toujours la fin (réaction / rire)
    return [(round(a, 3), round(min(b, end), 3)) for a, b in ranges if min(b, end) - a > 0.15]


def map_words(words: list[dict], segments: list[tuple[float, float, float]]) -> list[dict]:
    """Projette les mots source dans la timeline de sortie. segments = (src_a, src_b, out_offset)."""
    out = []
    for a, b, off in segments:
        for w in words:
            if w["start"] >= a - 0.05 and w["end"] <= b + 0.1:
                s = off + max(0.0, w["start"] - a)
                e = off + min(b - a, w["end"] - a)
                if e > s:
                    out.append({"start": s, "end": e, "word": w["word"]})
    out.sort(key=lambda w: w["start"])
    return out


def map_time(t: float, segments: list[tuple[float, float, float]]) -> float | None:
    for a, b, off in segments:
        if a <= t <= b:
            return off + (t - a)
    return None


# ---------------------------------------------------------------- filtres

def _layout(src: str, dst: str, tag: str, info: MediaInfo, o: RenderOpts) -> str:
    if o.layout == "crop":
        return (f"[{src}]scale={W}:{H}:force_original_aspect_ratio=increase,"
                f"crop={W}:{H}:(in_w-{W})*{o.crop_x}:(in_h-{H})/2,setsar=1[{dst}]")
    if o.layout == "split" and o.facecam:
        x, y, w, h = o.facecam
        top = int(H * o.split_ratio) // 2 * 2
        bot = H - top
        return (f"[{src}]split[fc{tag}][gp{tag}];"
                f"[fc{tag}]crop={w}:{h}:{x}:{y},scale={W}:{top}:force_original_aspect_ratio=increase,"
                f"crop={W}:{top}[fco{tag}];"
                f"[gp{tag}]scale=-2:{bot},crop={W}:{bot}:(in_w-{W})*{o.crop_x}:0[gpo{tag}];"
                f"[fco{tag}][gpo{tag}]vstack,setsar=1[{dst}]")
    # blur : vidéo entière au centre, fond flouté (idéal quand tout l'écran compte)
    return (f"[{src}]split[bg{tag}][fg{tag}];"
            f"[bg{tag}]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,gblur=sigma=12,"
            f"scale={W}:{H},eq=brightness=-0.10:saturation=1.3[bgo{tag}];"
            f"[fg{tag}]scale={W}:-2[fgo{tag}];"
            f"[bgo{tag}][fgo{tag}]overlay=(W-w)/2:(H-h)/2,setsar=1[{dst}]")


def _between(ranges: list[tuple[float, float]]) -> str:
    return "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in ranges)


def _escape_path(p: str) -> str:
    return os.path.abspath(p).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")


def render(video: str, info: MediaInfo, clip: ClipIdea, words: list[dict], ex: np.ndarray, out_path: str,
           o: RenderOpts) -> dict:
    s, e = clip.start, clip.end
    ts, te = clip.teaser_start, clip.teaser_end
    tdur = (te - ts) if o.teaser else 0.0

    ranges = keep_ranges(words, s, e, o.max_pause) if o.jumpcuts else [(s, e)]
    rel = [(a - s, b - s) for a, b in ranges]  # relatif à l'entrée « main » (seekée à s)

    segments: list[tuple[float, float, float]] = []
    if o.teaser:
        segments.append((ts, te, 0.0))
    off = tdur
    for a, b in ranges:
        segments.append((a, b, off))
        off += b - a
    total = off
    main_segments = segments[1:] if o.teaser else segments

    # --- zooms sur les pics audio du clip + au démarrage du clip
    zooms: list[tuple[float, float, float]] = []  # (début, fin, facteur)
    if o.zooms:
        if o.teaser:
            zooms.append((0.0, tdur, 1.12))
        for t, _ in signals.peaks_in(ex, s, e):
            ot = map_time(t, main_segments)
            if ot is not None and ot > tdur + 1.0:
                zooms.append((max(tdur, ot - 0.25), min(total, ot + 1.4), 1.18))

    # --- sous-titres + hook
    words_out = map_words(words, segments)
    tag = ("PLUS TARD DANS LE LIVE...", 0.0, tdur) if (o.teaser and clip.teaser_source == "other_moment") else None
    ass_path = os.path.splitext(out_path)[0] + ".ass"
    margin = 540 if o.layout == "blur" else 620
    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(captions.build(words_out, clip.hook_text, tdur + o.hook_seconds, o.font, margin, tag))

    # --- entrées ffmpeg
    args: list[str] = []
    n_in = 0
    if o.teaser:
        args += ["-ss", f"{ts:.3f}", "-t", f"{tdur:.3f}", "-i", video]
        i_teaser = n_in
        n_in += 1
    args += ["-ss", f"{s:.3f}", "-t", f"{e - s:.3f}", "-i", video]
    i_main = n_in
    n_in += 1

    fc: list[str] = []
    # clip principal : jump cuts via select/aselect
    fc.append(f"[{i_main}:v]fps={o.fps},select='{_between(rel)}',setpts=N/FRAME_RATE/TB[mv0]")
    fc.append(_layout("mv0", "mv1", "m", info, o))
    fc.append(f"[{i_main}:a]aselect='{_between(rel)}',asetpts=N/SR/TB,aresample=48000,"
              f"aformat=channel_layouts=stereo[ma]")
    if o.teaser:
        fc.append(f"[mv1]fade=t=in:st=0:d=0.25:color=white[mv]")
        fc.append(f"[{i_teaser}:v]fps={o.fps},setpts=PTS-STARTPTS[tv0]")
        fc.append(_layout("tv0", "tv1", "t", info, o))
        fc.append(f"[tv1]fade=t=out:st={max(0, tdur - 0.12):.3f}:d=0.12:color=white[tv]")
        fc.append(f"[{i_teaser}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
                  f"afade=t=out:st={max(0, tdur - 0.2):.3f}:d=0.2[ta]")
        fc.append("[tv][ta][mv][ma]concat=n=2:v=1:a=1[vc][ac]")
    else:
        fc.append("[mv1]null[vc]")
        fc.append("[ma]anull[ac]")

    if zooms:
        z = "+".join(f"between(in_time,{a:.3f},{b:.3f})*{k - 1:.3f}" for a, b, k in zooms)
        fc.append(f"[vc]zoompan=z='1+{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={o.fps}[vz]")
    else:
        fc.append("[vc]null[vz]")
    fc.append(f"[vz]ass=filename='{_escape_path(ass_path)}',format=yuv420p[vout]")

    # --- audio : voix + sfx + musique duckée
    mix = ["[voice]"]
    if o.music:
        fc.append("[ac]asplit[voice][vkey]")
    else:
        fc.append("[ac]anull[voice]")
    if o.sfx:
        cues = [("impact", 0.0, -4.0)]
        if o.teaser:
            cues.append(("whoosh", max(0.0, tdur - 0.35), -6.0))
        cues += [("pop", a, -12.0) for a, _, k in zooms if k > 1.15]
        for n, (name, t, db) in enumerate(cues):
            args += ["-i", o.sfx[name]]
            ms = int(t * 1000)
            fc.append(f"[{n_in}:a]aresample=48000,aformat=channel_layouts=stereo,volume={db}dB,"
                      f"adelay={ms}|{ms}[sfx{n}]")
            mix.append(f"[sfx{n}]")
            n_in += 1
    if o.music:
        args += ["-stream_loop", "-1", "-i", o.music]
        fc.append(f"[{n_in}:a]aresample=48000,aformat=channel_layouts=stereo,volume={o.music_db}dB,"
                  f"atrim=0:{total:.3f}[mus]")
        fc.append("[mus][vkey]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=350[musd]")
        mix.append("[musd]")
        n_in += 1
    fc.append(f"{''.join(mix)}amix=inputs={len(mix)}:duration=first:normalize=0,"
              f"loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]")

    args += ["-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]", "-t", f"{total:.3f}",
             "-c:v", "libx264", "-preset", o.preset, "-crf", str(o.crf), "-pix_fmt", "yuv420p", "-r", str(o.fps),
             "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out_path]
    run(args)
    return {"file": out_path, "duration": round(total, 2), "kept_ranges": ranges,
            "cut_seconds": round((e - s) - (total - tdur), 2), "zooms": zooms}
