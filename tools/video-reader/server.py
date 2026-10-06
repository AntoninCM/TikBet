"""MCP « video-reader » : permet à Claude Desktop de lire des vidéos YouTube, TikTok, Instagram, etc.

Stratégie (du plus rapide au plus lent) :
  1. YouTube : transcription officielle via youtube-transcript-api
  2. Sous-titres (manuels ou automatiques) exposés par yt-dlp
  3. Téléchargement de l'audio + transcription locale avec faster-whisper

Utilisation hors Claude :  python server.py --cli <URL> [langue]
"""

import html
import logging
import os
import re
import sys
import tempfile

logging.basicConfig(stream=sys.stderr, level=logging.WARNING)
log = logging.getLogger("video-reader")

WHISPER_MODEL = os.environ.get("WHISPER_MODEL", "base")
MAX_WHISPER_MINUTES = int(os.environ.get("MAX_WHISPER_MINUTES", "20"))
MAX_CHARS = 150_000

_whisper = None


class _StderrLogger:
    """yt-dlp ne doit jamais écrire sur stdout (réservé au protocole MCP)."""

    def debug(self, msg):
        pass

    def info(self, msg):
        pass

    def warning(self, msg):
        log.warning(msg)

    def error(self, msg):
        log.error(msg)


def _ydl_opts(**extra):
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "logger": _StderrLogger(),
    }
    opts.update(extra)
    return opts


def _youtube_id(url):
    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/|live/)([A-Za-z0-9_-]{11})", url)
    return m.group(1) if m else None


def _youtube_transcript(video_id, langue):
    from youtube_transcript_api import YouTubeTranscriptApi

    api = YouTubeTranscriptApi()
    try:
        fetched = api.fetch(video_id, languages=[langue, "fr", "en"])
    except Exception:
        # Aucune des langues préférées : on prend la première disponible
        transcripts = list(api.list(video_id))
        if not transcripts:
            return None
        fetched = transcripts[0].fetch()
    text = " ".join(s.text.replace("\n", " ") for s in fetched.snippets)
    return text, f"sous-titres YouTube ({fetched.language_code})"


def clean_vtt(raw):
    """Convertit un fichier VTT en texte brut, sans les doublons des sous-titres auto."""
    lines = []
    for line in raw.splitlines():
        line = line.strip()
        if (
            not line
            or line == "WEBVTT"
            or "-->" in line
            or line.isdigit()
            or re.match(r"^(Kind|Language|NOTE|STYLE)\b", line)
        ):
            continue
        line = html.unescape(re.sub(r"<[^>]+>", "", line)).strip()
        if line and (not lines or line != lines[-1]):
            lines.append(line)
    return " ".join(lines)


def _pick_subtitle(tracks, langue):
    if not tracks:
        return None, None
    candidates = [langue, "fr", "en"] + list(tracks.keys())
    for lang in candidates:
        for key in tracks:
            if key == lang or key.startswith(lang + "-"):
                for fmt in tracks[key]:
                    if fmt.get("ext") == "vtt":
                        return key, fmt["url"]
    return None, None


def _ytdlp_subtitles(ydl, info, langue):
    for source, label in (("subtitles", "sous-titres"), ("automatic_captions", "sous-titres auto")):
        lang, url = _pick_subtitle(info.get(source), langue)
        if url:
            raw = ydl.urlopen(url).read().decode("utf-8", errors="replace")
            text = clean_vtt(raw)
            if text:
                return text, f"{label} ({lang})"
    return None


def _get_whisper():
    global _whisper
    if _whisper is None:
        from faster_whisper import WhisperModel

        _whisper = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
    return _whisper


def _whisper_transcript(url, langue):
    import yt_dlp

    with tempfile.TemporaryDirectory() as tmp:
        opts = _ydl_opts(
            format="bestaudio/worst[acodec!=none]/best",
            outtmpl=os.path.join(tmp, "audio.%(ext)s"),
        )
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([url])
        files = os.listdir(tmp)
        if not files:
            raise RuntimeError("téléchargement de l'audio impossible")
        segments, info = _get_whisper().transcribe(
            os.path.join(tmp, files[0]),
            language=langue or None,
            vad_filter=True,
        )
        text = " ".join(seg.text.strip() for seg in segments)
        return text, f"transcription Whisper '{WHISPER_MODEL}' ({info.language})"


def read_video(url, langue="fr"):
    import yt_dlp

    with yt_dlp.YoutubeDL(_ydl_opts(skip_download=True)) as ydl:
        info = ydl.extract_info(url, download=False)

        result = None
        video_id = _youtube_id(url) if "youtu" in url else None
        if video_id:
            try:
                result = _youtube_transcript(video_id, langue)
            except Exception as e:
                log.warning("youtube-transcript-api : %s", e)
        if not result:
            try:
                result = _ytdlp_subtitles(ydl, info, langue)
            except Exception as e:
                log.warning("sous-titres yt-dlp : %s", e)

    duration = info.get("duration") or 0
    if not result:
        if duration > MAX_WHISPER_MINUTES * 60:
            result = (
                "",
                f"aucun sous-titre, et la vidéo dure plus de {MAX_WHISPER_MINUTES} min : "
                "lance `python server.py --cli <URL>` dans un terminal pour la transcrire sans limite de temps",
            )
        else:
            result = _whisper_transcript(url, langue)

    text, source = result
    if len(text) > MAX_CHARS:
        text = text[:MAX_CHARS] + " […transcription tronquée]"

    minutes, seconds = divmod(int(duration), 60)
    header = [
        f"Titre : {info.get('title', '?')}",
        f"Auteur : {info.get('uploader') or info.get('channel') or '?'}",
        f"Durée : {minutes} min {seconds:02d} s",
        f"Source du texte : {source}",
    ]
    description = (info.get("description") or "").strip()
    if description:
        header.append(f"Description : {description[:2000]}")
    return "\n".join(header) + "\n\n--- TRANSCRIPTION ---\n" + text


def main():
    from mcp.server.fastmcp import FastMCP

    mcp = FastMCP("video-reader")

    @mcp.tool()
    def lire_video(url: str, langue: str = "fr") -> str:
        """Lit une vidéo (YouTube, TikTok, Instagram Reels, X, Vimeo…) et renvoie son titre,
        sa description et la transcription complète de ce qui est dit.

        Args:
            url: lien de la vidéo
            langue: code langue préféré pour la transcription (fr, en, es…)
        """
        try:
            return read_video(url, langue)
        except Exception as e:
            return f"Erreur en lisant la vidéo : {e}"

    mcp.run()


if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "--cli":
        if len(sys.argv) < 3:
            sys.exit("Usage : python server.py --cli <URL> [langue]")
        MAX_WHISPER_MINUTES = 10_000
        print(read_video(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "fr"))
    elif len(sys.argv) >= 2 and sys.argv[1] == "--selftest":
        import faster_whisper, mcp, youtube_transcript_api, yt_dlp  # noqa: E401,F401

        print("OK")
    else:
        main()
