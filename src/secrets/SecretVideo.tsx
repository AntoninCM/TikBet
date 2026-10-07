import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Fond, Grain } from "../promo500k/Decor";
import { TEMPS } from "../promo500k/timeline";
import { K, TEXTE, clamp } from "../promo500k/ui";
import { Cta, Duo, Equation, Etapes, Hook, Liste, Mythe, Punchline, Score, SecretCard } from "./Scenes";
import { PROFILS, SECRETS } from "./scripts";
import { debuts, drop, duree, dureeTotale } from "./timing";
import type { Scene } from "./types";

const rendu = (s: Scene) => {
  switch (s.type) {
    case "hook": return <Hook {...s} />;
    case "mythe": return <Mythe {...s} />;
    case "secret": return <SecretCard {...s} />;
    case "equation": return <Equation />;
    case "etapes": return <Etapes {...s} />;
    case "score": return <Score {...s} />;
    case "duo": return <Duo {...s} />;
    case "liste": return <Liste {...s} />;
    case "punchline": return <Punchline {...s} />;
    case "cta": return <Cta {...s} logo={staticFile("liveup/logo.png")} />;
  }
};

const Entree: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, 8], [1.12, 1], clamp)})`, filter: `blur(${interpolate(f, [0, 8], [14, 0], clamp)}px)` }}>{children}</AbsoluteFill>;
};

export const SecretVideo: React.FC<{ id: string }> = ({ id }) => {
  const v = [...SECRETS, ...PROFILS].find((x) => x.id === id)!;
  const f = useCurrentFrame();
  const d0 = debuts(v);
  const dr = drop(v);
  const total = dureeTotale(v);
  const ctaDebut = d0[v.scenes.length - 1];
  // caméra : punch sur chaque temps fort après le drop + secousse sur les impacts
  let zoom = 1;
  if (f >= dr) zoom += 0.018 * Math.exp(-((f - dr) % (TEMPS * 2)) / 5);
  const shake = [0, dr, ctaDebut].reduce((a, t) => a + (f >= t && f < t + 12 ? (12 - (f - t)) * 1.6 : 0), 0);
  const flash = Math.max(0, ...d0.slice(1).map((t) => interpolate(f, [t - 1, t, t + 5], [0, 0.5, 0], clamp)));
  const numero = v.scenes.flatMap((s) => (s.type === "secret" ? [s.numero] : []))[0];
  const badge = v.badge ?? `SECRET ${numero}/6`;
  const chaleur = interpolate(f, [dr - 20, dr + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: K.noir }}>
      <Audio src={staticFile(`secrets/${id}.wav`)} />
      <AbsoluteFill style={{ transform: `translate(${Math.sin(f * 2.1) * shake}px, ${Math.cos(f * 1.7) * shake}px) scale(${zoom})` }}>
        <Fond chaleur={chaleur} />
        {v.scenes.map((s, i) => (
          <Sequence key={i} from={d0[i]} durationInFrames={duree(s)} name={s.type}>
            <Entree>{rendu(s)}</Entree>
          </Sequence>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: K.blanc, opacity: flash, mixBlendMode: "screen" }} />
      <Grain />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(f / total) * 100}%`, background: K.degrade, boxShadow: `0 0 20px ${K.rose}` }} />
        <Img src={staticFile("liveup/logo.png")} style={{ position: "absolute", top: 120, left: 70, width: 170 }} />
        <div style={{ position: "absolute", top: 136, right: 150, fontFamily: TEXTE, fontWeight: 800, fontSize: 26, color: K.or, letterSpacing: 3, border: `2px solid ${K.or}66`, borderRadius: 999, padding: "6px 18px" }}>{badge}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
