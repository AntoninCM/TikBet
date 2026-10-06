"""Bande-son des vidéos : beat 120 BPM + bruitages calés sur la timeline exportée en JSON.
Usage : python3 scripts/gen-audio.py timeline.json sortie.wav  (via npm run audio:500k / audio:secrets)
Le JSON contient fps, bpm, duree, drop (frame du drop, idéalement sur une mesure) et sfx.
Tout est synthétisé (numpy) : aucun droit musical à gérer."""
import json, sys, wave
import numpy as np

SR = 44100
tl = json.load(open(sys.argv[1]))
FPS, BPM = tl["fps"], tl["bpm"]
DUREE_S = tl["duree"] / FPS + 0.5
N = int(DUREE_S * SR)
BEAT = 60 / BPM
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
f2s = lambda f: f / FPS
DROP = f2s(tl["drop"]); FIN = f2s(tl["duree"])

def add(sig, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * g * (1 - max(0, pan))
    R[i:i + len(sig)] += sig * g * (1 + min(0, pan))

def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def lp(x, a):  # passe-bas 1 pôle
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y

def hp(x): return np.diff(x, prepend=0)

# ---------- instruments ----------
def kick(n=0.45):
    t = np.arange(int(n * SR)) / SR
    f = 45 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.18) * 1.1
def clap():
    n = int(0.25 * SR); x = hp(rng.standard_normal(n))
    e = env(n, 0.001, 0.06) + 0.6 * np.concatenate([np.zeros(int(0.012 * SR)), env(n - int(0.012 * SR), 0.001, 0.05)])
    return x * e * 0.35
def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); x = hp(hp(rng.standard_normal(n)))
    return x * env(n, 0.0005, 0.06 if open_ else 0.012) * 0.18
def sub(freq, dur):
    t = np.arange(int(dur * SR)) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.3 * np.tanh(3 * np.sin(2 * np.pi * freq * t))
    return x * np.minimum(1, t / 0.005) * np.exp(-t / (dur * 0.8)) * 0.5
def pad(freqs, dur):
    t = np.arange(int(dur * SR)) / SR
    x = sum(((2 * ((f * d * t) % 1) - 1) for f in freqs for d in (0.997, 1.003)))
    x = lp(x / (len(freqs) * 2), 0.04)
    a = np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.4)
    return x * a * 0.22

# ---------- bruitages ----------
def impact():
    n = int(1.6 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-t * 12)) / SR) * np.exp(-t / 0.6)
    noise = lp(rng.standard_normal(n), 0.15) * np.exp(-t / 0.25)
    return (boom * 1.0 + noise * 0.5)
def whoosh():
    n = int(0.45 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); a = 0.02 + 0.5 * np.sin(np.pi * t / t[-1]) ** 2
    y = np.zeros(n); acc = 0.0
    for i in range(n): acc += a[i] * 0.25 * (x[i] - acc); y[i] = acc
    return y * np.sin(np.pi * t / t[-1]) * 0.9
def pop():
    n = int(0.09 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(1400 - 900 * t / t[-1]) / SR) * env(n, 0.001, 0.03) * 0.35
def tick():
    n = int(0.03 * SR); return np.sin(2 * np.pi * 2400 * np.arange(n) / SR) * env(n, 0.0005, 0.008) * 0.18
def cash():
    n = int(0.9 * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in ((2093, 0.35), (2637, 0.3), (3136, 0.25), (4186, 0.2)))
    return x * 0.12 + np.concatenate([np.zeros(int(0.06 * SR)), x[: n - int(0.06 * SR)] * 0.08])
def stamp():
    n = int(0.5 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(60 + 140 * np.exp(-t * 40)) / SR) * np.exp(-t / 0.15) * 0.9 + lp(rng.standard_normal(n), 0.3) * np.exp(-t / 0.05) * 0.4
def glitch():
    n = int(0.8 * SR); x = np.zeros(n)
    for k in range(10):
        a = int(rng.uniform(0, n - 3000)); m = int(rng.uniform(600, 3000))
        x[a:a + m] += np.sign(np.sin(2 * np.pi * rng.uniform(80, 900) * np.arange(m) / SR)) * 0.12
    return lp(x, 0.4)
def error():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return (np.sign(np.sin(2 * np.pi * 180 * t)) * 0.5 + np.sin(2 * np.pi * 120 * t)) * env(n, 0.002, 0.08) * 0.22
def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR; p = t / dur
    tone = np.sin(2 * np.pi * np.cumsum(200 + 1600 * p ** 2) / SR) * 0.15
    noise = hp(rng.standard_normal(n)) * 0.12
    return (tone + noise) * p ** 2

# ---------- musique ----------
PROG = [55.0, 43.65, 65.41, 49.0]  # La, Fa, Do, Sol (graves)
CHORDS = [[220, 261.6, 329.6], [174.6, 220, 261.6], [261.6, 329.6, 392], [196, 246.9, 293.7]]
mesure = 4 * BEAT
nb = int(FIN / mesure) + 1
for m in range(nb):
    t0 = m * mesure
    if t0 >= FIN: break
    k = m % 4
    add(pad(CHORDS[k], mesure), t0, 0.9 if t0 < DROP else 1.2, 0)
    energie = 0 if t0 < 2 * mesure else (1 if t0 < DROP - mesure else (0 if t0 < DROP else 2))
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= FIN: break
        if energie == 0 and t0 >= 2 * mesure:  # mesure de montée avant le drop : seulement des hats qui accélèrent
            for s in range(2 ** (b + 1)): add(hat(), tb + s * BEAT / 2 ** (b + 1), 0.8, 0.3)
            continue
        if energie >= 1:
            add(kick(), tb, 0.8 if energie == 1 else 1.0)
            for s in range(2 if energie == 1 else 4):
                add(hat(s % 2 == 1 and energie == 2), tb + s * BEAT / (2 if energie == 1 else 4), 0.8, 0.35 if s % 2 else -0.35)
        elif m < 2 and b in (0, 2):  # hook : battement de cœur
            add(kick(0.3), tb, 0.6)
        if energie == 2 and b in (1, 3):
            add(clap(), tb, 1.0)
        if energie >= 1 and b in (0, 2):
            add(sub(PROG[k], BEAT * 2), tb, 0.8 if energie == 1 else 1.0)

# sidechain : on creuse la musique sur chaque temps après le drop (effet "pompe")
t = np.arange(N) / SR
pompe = np.where(t >= DROP, 1 - 0.45 * np.exp(-((t - DROP) % BEAT) / 0.09), 1.0)
L *= pompe; R *= pompe
L *= 0.55; R *= 0.55  # la musique reste sous les bruitages

# ---------- bruitages calés image ----------
FX = {"impact": impact, "whoosh": whoosh, "pop": pop, "tick": tick, "cash": cash, "stamp": stamp, "glitch": glitch, "error": error}
GAIN = {"impact": 0.9, "whoosh": 0.5, "pop": 0.8, "tick": 1.0, "cash": 1.0, "stamp": 0.9, "glitch": 1.0, "error": 0.9}
for e in tl["sfx"]:
    if e["type"] == "riser":
        add(riser(DROP - f2s(e["t"])), f2s(e["t"]), 1.0)
    else:
        add(FX[e["type"]](), f2s(e["t"]), GAIN[e["type"]])

# fondu de fin + reverb légère + limiteur doux
fin = np.clip((FIN + 0.4 - t) / 0.6, 0, 1); L *= fin; R *= fin
ir = rng.standard_normal(int(0.9 * SR)) * np.exp(-np.arange(int(0.9 * SR)) / SR / 0.25) * 0.02
nfft = 1 << int(np.ceil(np.log2(N + len(ir))))
rev = lambda x: np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[:N]
L, R = L + rev(L) * 0.6, R + rev(R) * 0.6
st = np.stack([L, R], 1)
st = np.tanh(st * 1.4 / np.max(np.abs(st))) * 0.95
out = (st * 32767).astype(np.int16)
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print(f"OK {sys.argv[2]} ({DUREE_S:.1f}s)")
