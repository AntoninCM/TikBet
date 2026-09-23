"""Sélection des moments viraux.

1. Le transcript horodaté + les pics audio sont envoyés à Claude, qui joue le rôle
   d'un monteur TikTok : il choisit début/fin, le hook texte, et le « teaser »
   (l'extrait le plus fort, remonté en tout début de clip).
2. Sans clé API (--no-llm) : heuristique basée uniquement sur les pics audio.
3. Dans les deux cas, les bornes sont recalées sur les phrases (jamais de coupe en plein mot).
"""
from __future__ import annotations

import math
from concurrent.futures import ThreadPoolExecutor
from typing import Literal

import numpy as np
from pydantic import BaseModel, Field

from . import signals

MODEL = "claude-opus-5"


class ClipIdea(BaseModel):
    start: float = Field(description="Début du clip en secondes (= début d'une ligne du transcript)")
    end: float = Field(description="Fin du clip en secondes (= fin d'une ligne, juste après la chute)")
    hook_text: str = Field(description="Texte affiché à l'écran les 3 premières secondes, 3 à 8 mots, MAJUSCULES OK")
    title: str = Field(description="Légende TikTok (1 phrase, curiosité, pas de spoil de la chute)")
    hashtags: list[str] = Field(description="4 à 6 hashtags pertinents, sans le #")
    teaser_start: float = Field(description="Début du teaser (moment le plus intense), en secondes")
    teaser_end: float = Field(description="Fin du teaser, 1.5 à 3.5 s après teaser_start")
    teaser_source: Literal["same_clip", "other_moment"]
    hook_score: int = Field(description="0-10 : les 2 premières secondes arrêtent-elles le scroll ?")
    retention_score: int = Field(description="0-10 : tension continue, zéro temps mort")
    payoff_score: int = Field(description="0-10 : chute / réaction / révélation forte à la fin")
    standalone_score: int = Field(description="0-10 : compréhensible sans contexte du live")
    why: str = Field(description="1-2 phrases : pourquoi ce moment peut percer")


class ClipIdeas(BaseModel):
    clips: list[ClipIdea]


SYSTEM = """Tu es le meilleur monteur TikTok francophone. On te donne le transcript horodaté d'un live \
(avec des marqueurs [PIC AUDIO +XdB] quand le son explose : cris, rires, réactions). \
Ta mission : trouver les extraits qui peuvent devenir viraux en format court vertical.

Critères, par ordre d'importance :
1. HOOK (0-2 s) : le clip doit commencer sur une phrase choc, une question, un enjeu, un conflit \
ou une réaction — jamais sur "euh", une salutation ou du contexte. Commence le plus tard possible.
2. STANDALONE : compréhensible par quelqu'un qui n'a jamais vu le streamer.
3. RÉTENTION : tension qui monte, pas de temps mort, une boucle ouverte (on veut savoir la suite).
4. PAYOFF : une chute, une réaction énorme, une révélation. Termine 0.5-1 s après la chute, jamais après.
5. Durée idéale 20-45 s (max {max_len} s, min {min_len} s).

TEASER (cold open) : choisis 1.5 à 3.5 s — le moment le plus intense (cri, punchline, réaction) — qui sera \
monté AVANT le clip pour accrocher, puis le clip démarre normalement.
- Mode demandé : {teaser_mode}.
- "same": le teaser est DANS le clip (teaser_source="same_clip"), idéalement la chute ou la réaction finale.
- "cross": le teaser vient d'un AUTRE moment du live (teaser_source="other_moment"), lié au même sujet et \
encore plus fort ; il doit être hors de [start, end].
- "auto": choisis le plus efficace des deux.

Les timestamps doivent correspondre à ceux du transcript. Hook texte et titre dans la langue du live. \
Ne propose que des moments réellement forts : mieux vaut 2 excellents clips que 8 moyens. \
Propose au maximum {n} clips, triés du meilleur au moins bon."""


def score(c: ClipIdea) -> float:
    return 0.35 * c.hook_score + 0.25 * c.retention_score + 0.25 * c.payoff_score + 0.15 * c.standalone_score


# ---------------------------------------------------------------- transcript -> texte pour le LLM

def _format_chunk(segments: list[dict], pk: list[tuple[float, float]]) -> str:
    lines, pi = [], 0
    pk = sorted(pk)
    for seg in segments:
        while pi < len(pk) and pk[pi][0] < seg["start"]:
            lines.append(f"[PIC AUDIO +{pk[pi][1]:.0f}dB @ {pk[pi][0]:.1f}]")
            pi += 1
        lines.append(f"[{seg['start']:.1f}-{seg['end']:.1f}] {seg['text']}")
    return "\n".join(lines)


def _chunks(segments: list[dict], chunk_s: float, overlap_s: float) -> list[list[dict]]:
    if not segments:
        return []
    out, t0, end = [], segments[0]["start"], segments[-1]["end"]
    while t0 < end:
        out.append([s for s in segments if s["end"] > t0 and s["start"] < t0 + chunk_s])
        t0 += chunk_s - overlap_s
    return [c for c in out if c]


def select_llm(transcript: dict, ex: np.ndarray, count: int, teaser_mode: str, min_len: float, max_len: float,
               chunk_minutes: float = 40) -> list[ClipIdea]:
    import anthropic

    client = anthropic.Anthropic()
    segments = transcript["segments"]
    all_peaks = signals.peaks(ex, min_db=6.0, min_gap_s=8.0)
    chunks = _chunks(segments, chunk_minutes * 60, 120)
    per_chunk = min(8, max(3, math.ceil(count * 1.5 / max(len(chunks), 1)) + 1))
    system = SYSTEM.format(max_len=max_len, min_len=min_len, teaser_mode=teaser_mode, n=per_chunk)

    def ask(chunk: list[dict]) -> list[ClipIdea]:
        a, b = chunk[0]["start"], chunk[-1]["end"]
        text = _format_chunk(chunk, [p for p in all_peaks if a <= p[0] <= b])
        resp = client.beta.messages.parse(
            model=MODEL,
            max_tokens=16000,
            thinking={"type": "adaptive"},
            output_config={"effort": "high"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            system=system,
            messages=[{"role": "user", "content": f"Transcript ({a:.0f}s → {b:.0f}s) :\n\n{text}"}],
            output_format=ClipIdeas,
        )
        if resp.stop_reason == "refusal" or resp.parsed_output is None:
            print(f"  [llm] pas de résultat pour {a:.0f}-{b:.0f}s (stop_reason={resp.stop_reason})")
            return []
        return resp.parsed_output.clips

    print(f"[sélection] {len(chunks)} bloc(s) de transcript envoyé(s) à {MODEL}")
    with ThreadPoolExecutor(max_workers=4) as pool:
        ideas = [c for res in pool.map(ask, chunks) for c in res]
    return _dedupe(sorted(ideas, key=score, reverse=True), count)


def _dedupe(ideas: list[ClipIdea], count: int) -> list[ClipIdea]:
    kept: list[ClipIdea] = []
    for c in ideas:
        overlap = any(min(c.end, k.end) - max(c.start, k.start) > 0.3 * min(c.end - c.start, k.end - k.start)
                      for k in kept)
        if not overlap:
            kept.append(c)
        if len(kept) >= count:
            break
    return kept


# ---------------------------------------------------------------- heuristique sans LLM

def select_heuristic(transcript: dict, ex: np.ndarray, count: int, min_len: float, max_len: float) -> list[ClipIdea]:
    ideas = []
    for t, strength in signals.peaks(ex, min_db=5.0, min_gap_s=max_len, top=count):
        start, end = max(0.0, t - 0.6 * max_len), t + 6.0  # montée en tension puis réaction, fin juste après
        first_seg = next((s["text"] for s in transcript.get("segments", []) if s["start"] >= start), "")
        first = " ".join(first_seg.split()[:8]) or "ATTENDS LA FIN"
        ideas.append(ClipIdea(
            start=start, end=end, hook_text=first.upper(), title=first, hashtags=["live", "stream", "fyp"],
            teaser_start=t - 1.0, teaser_end=t + 1.5, teaser_source="same_clip",
            hook_score=0, retention_score=0, payoff_score=min(10, int(strength)), standalone_score=0,
            why=f"Pic audio +{strength:.0f} dB à {t:.0f}s",
        ))
    return ideas


# ---------------------------------------------------------------- recalage sur les phrases

def snap(c: ClipIdea, transcript: dict, duration: float, min_len: float, max_len: float) -> ClipIdea:
    segs = transcript.get("segments", [])
    start, end = c.start, c.end
    if segs:
        starts = [s["start"] for s in segs]
        ends = [s["end"] for s in segs]
        # début : début de phrase le plus proche ; fin : fin de phrase la plus proche (+ petite marge pour la réaction)
        start = min(starts, key=lambda x: abs(x - start))
        cand = [e for e in ends if e > start + min_len] or [end]
        end = min(cand, key=lambda x: abs(x - end)) + 0.4
    start = max(0.0, start - 0.1)
    end = min(duration, max(end, start + min_len))
    if end - start > max_len:
        end = start + max_len

    ts, te = c.teaser_start, c.teaser_end
    te = min(max(te, ts + 1.5), ts + 3.5)
    if c.teaser_source == "same_clip" and not (start <= ts and te <= end):
        ts, te = max(start, end - 3.0), end  # par défaut : la chute
    ts, te = max(0.0, ts), min(duration, te)
    return c.model_copy(update={"start": round(start, 2), "end": round(end, 2),
                                "teaser_start": round(ts, 2), "teaser_end": round(te, 2)})
