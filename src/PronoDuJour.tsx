import { AbsoluteFill, Sequence } from "remotion";
import { Fond } from "./components/Fond";
import { Hook } from "./components/Hook";
import { Match } from "./components/Match";
import { Arguments, ECART_ARG } from "./components/Arguments";
import { Verdict } from "./components/Verdict";
import { Outro } from "./components/Outro";
import { Mention } from "./components/Mention";
import type { Prono } from "./types";

// Timing (30 fps) — total 17 s, format optimal pour la rétention TikTok
const HOOK = 60;                       // 2 s
const MATCH = 75;                      // 2,5 s
const ARGS = 3 * ECART_ARG + 60;       // 6,5 s
const VERDICT = 120;                   // 4 s
const OUTRO = 60;                      // 2 s
export const DUREE_TOTALE = HOOK + MATCH + ARGS + VERDICT + OUTRO;

export const PronoDuJour: React.FC<Prono> = (p) => {
  let t = 0;
  const at = (d: number) => {
    const from = t;
    t += d;
    return { from, durationInFrames: d };
  };
  return (
    <AbsoluteFill>
      <Fond />
      <Sequence {...at(HOOK)}>
        <Hook texte={p.accroche} sport={p.sport} />
      </Sequence>
      <Sequence {...at(MATCH)}>
        <Match dom={p.equipeDomicile} ext={p.equipeExterieur} date={p.date} />
      </Sequence>
      <Sequence {...at(ARGS)}>
        <Arguments items={p.arguments} />
      </Sequence>
      <Sequence {...at(VERDICT)}>
        <Verdict pari={p.pari} cote={p.cote} confiance={p.confiance} />
      </Sequence>
      <Sequence {...at(OUTRO)}>
        <Outro />
      </Sequence>
      <Mention />
    </AbsoluteFill>
  );
};
