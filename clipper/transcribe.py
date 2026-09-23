"""Transcription mot-à-mot (faster-whisper) avec cache JSON.

Format du transcript (aussi accepté via --transcript) :
{"language": "fr", "segments": [{"start": 1.2, "end": 4.8, "text": "...",
  "words": [{"start": 1.2, "end": 1.5, "word": "Salut"}, ...]}]}
"""
from __future__ import annotations

import json
import os


def load(path: str) -> dict:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    for seg in data.get("segments", []):
        seg.setdefault("words", [])
    return data


def transcribe(video: str, cache_path: str, model_size: str = "small", language: str | None = None) -> dict:
    if os.path.exists(cache_path):
        return load(cache_path)
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise SystemExit("faster-whisper manquant : `pip install faster-whisper` (ou fournissez --transcript).") from exc

    print(f"[transcription] modèle whisper '{model_size}' — ~1-3x temps réel sur CPU, bien plus rapide sur GPU")
    model = WhisperModel(model_size, device="auto", compute_type="auto")
    segments, info = model.transcribe(video, word_timestamps=True, vad_filter=True, language=language)
    out = {"language": info.language, "segments": []}
    for seg in segments:
        out["segments"].append(
            {
                "start": round(seg.start, 2),
                "end": round(seg.end, 2),
                "text": seg.text.strip(),
                "words": [
                    {"start": round(w.start, 2), "end": round(w.end, 2), "word": w.word.strip()}
                    for w in (seg.words or [])
                ],
            }
        )
        print(f"  {seg.start:7.1f}s  {seg.text.strip()[:80]}", flush=True)
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    return out


def all_words(transcript: dict) -> list[dict]:
    words = []
    for seg in transcript.get("segments", []):
        if seg.get("words"):
            words.extend(w for w in seg["words"] if w.get("word"))
        elif seg.get("text"):
            # Pas de timing mot-à-mot : on répartit le segment uniformément.
            toks = seg["text"].split()
            step = (seg["end"] - seg["start"]) / max(len(toks), 1)
            for i, t in enumerate(toks):
                words.append({"start": seg["start"] + i * step, "end": seg["start"] + (i + 1) * step, "word": t})
    return words
