"""Sous-titres « karaoké » TikTok (fichier .ass rendu par libass/ffmpeg).

- 1 à 3 mots à l'écran, mot actif en jaune, petit « pop » à chaque groupe.
- Hook texte en haut, dans une boîte, avec effet « slam » (grossit puis se pose).
"""
from __future__ import annotations

import re

W, H = 1080, 1920
YELLOW = "&H0000E5FF&"  # BGR
WHITE = "&H00FFFFFF&"


def _ts(t: float) -> str:
    t = max(0.0, t)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def _esc(txt: str) -> str:
    return txt.replace("\\", "").replace("{", "(").replace("}", ")").replace("\n", " ")


def header(font: str, caption_margin_v: int) -> str:
    return f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,{font},92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,3,2,60,60,{caption_margin_v},1
Style: Hook,{font},78,&H00000000,&H00FFFFFF,&H00FFFFFF,&H00FFFFFF,-1,0,0,0,100,100,0,0,3,18,0,8,70,70,230,1
Style: Tag,{font},48,&H00FFFFFF,&H00FFFFFF,&H000000FF,&H000000FF,-1,0,0,0,100,100,2,0,3,10,0,8,70,70,150,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def group_words(words: list[dict], max_words: int = 3, max_gap: float = 0.35) -> list[list[dict]]:
    groups: list[list[dict]] = []
    cur: list[dict] = []
    for w in words:
        if cur and (len(cur) >= max_words or w["start"] - cur[-1]["end"] > max_gap):
            groups.append(cur)
            cur = []
        cur.append(w)
        if re.search(r"[.!?,…]$", w["word"]):
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    return groups


def build(words_out: list[dict], hook_text: str, hook_until: float, font: str = "DejaVu Sans",
          caption_margin_v: int = 560, tag: tuple[str, float, float] | None = None, uppercase: bool = True) -> str:
    """words_out : mots déjà ramenés dans la timeline de SORTIE (start/end en s)."""
    ev = []
    if hook_text:
        ev.append(f"Dialogue: 2,{_ts(0)},{_ts(hook_until)},Hook,,0,0,0,,"
                  r"{\fscx135\fscy135\t(0,140,\fscx100\fscy100)\fad(0,150)}" + _esc(hook_text.upper()))
    if tag:
        text, a, b = tag
        ev.append(f"Dialogue: 3,{_ts(a)},{_ts(b)},Tag,,0,0,0,,{_esc(text)}")
    caps = []  # (début, fin, texte)
    for g in group_words(words_out):
        g_end = g[-1]["end"] + 0.12
        for i, w in enumerate(g):
            b = g[i + 1]["start"] if i + 1 < len(g) else g_end
            parts = []
            for j, x in enumerate(g):
                t = _esc(x["word"].upper() if uppercase else x["word"])
                parts.append((r"{\c" + YELLOW + "}" + t + r"{\c" + WHITE + "}") if j == i else t)
            pop = r"{\fscx80\fscy80\t(0,90,\fscx100\fscy100)}" if i == 0 else ""
            caps.append((w["start"], b, pop + " ".join(parts)))
    caps.sort(key=lambda c: c[0])
    for k, (a, b, text) in enumerate(caps):
        if k + 1 < len(caps):
            b = min(b, caps[k + 1][0])  # jamais deux sous-titres en même temps
        if b - a > 0.02:
            ev.append(f"Dialogue: 1,{_ts(a)},{_ts(b)},Cap,,0,0,0,,{text}")
    return header(font, caption_margin_v) + "\n".join(ev) + "\n"
