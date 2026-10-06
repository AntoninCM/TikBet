// Durée et bruitages de chaque type de scène (frames à 30 fps, 1 temps = 15 frames).
// Le même fichier sert au montage ET à l'export de la bande-son : son et image ne peuvent pas se décaler.
import type { Sfx } from "../promo500k/timeline";
import type { Scene, Secret } from "./types";

export const LISTE_DEBUT = 30;
export const LISTE_ECART = 36;

export const duree = (s: Scene): number => {
  switch (s.type) {
    case "hook": return 120;
    case "mythe": return 180;
    case "secret": return 90;
    case "equation": return 240;
    case "etapes": return 180;
    case "score": return 210;
    case "duo": return 180;
    case "liste": return LISTE_DEBUT + s.items.length * LISTE_ECART + 45;
    case "punchline": return 105;
    case "cta": return 150;
  }
};

// Moments clés relatifs au début de la scène (utilisés par les composants)
export const T = {
  mythe: { croyance: 6, barre: 60, verite: 78 },
  equation: { l1: 10, res1: 45, change: 105, res2: 140, stamp: 170 },
  etapes: [12, 62, 112],
  score: { barres: [12, 36, 60, 84], alerte: 120, legende: 150 },
  duo: [15, 75],
  cta: { bouton: 30 },
};

const relatifs = (s: Scene): Sfx[] => {
  switch (s.type) {
    case "hook": return [{ t: 0, type: "impact" }, { t: 6, type: "glitch" }];
    case "mythe": return [{ t: T.mythe.croyance, type: "pop" }, { t: T.mythe.barre, type: "error" }, { t: T.mythe.barre + 4, type: "stamp" }, { t: T.mythe.verite, type: "pop" }];
    case "secret": return [{ t: -60, type: "riser" }, { t: 0, type: "impact" }];
    case "equation": return [
      { t: T.equation.l1, type: "pop" },
      ...Array.from({ length: 6 }, (_, i) => ({ t: T.equation.res1 + i * 4, type: "tick" as const })),
      { t: T.equation.change, type: "whoosh" },
      ...Array.from({ length: 8 }, (_, i) => ({ t: T.equation.res2 + i * 4, type: "tick" as const })),
      { t: T.equation.res2 + 32, type: "cash" },
      { t: T.equation.stamp, type: "stamp" },
    ];
    case "etapes": return T.etapes.map((t) => ({ t, type: "pop" as const }));
    case "score": return [...T.score.barres.map((t) => ({ t, type: "pop" as const })), { t: T.score.alerte, type: "error" }, { t: T.score.legende, type: "cash" }];
    case "duo": return T.duo.map((t) => ({ t, type: "pop" as const }));
    case "liste": return s.items.map((_, i) => ({ t: LISTE_DEBUT + i * LISTE_ECART, type: (s.style === "x" ? "error" : "pop") as Sfx["type"] }));
    case "punchline": return [{ t: 0, type: "stamp" }];
    case "cta": return [{ t: 0, type: "impact" }, { t: T.cta.bouton, type: "cash" }];
  }
};

export const debuts = (v: Secret) => {
  let t = 0;
  return v.scenes.map((s) => {
    const d = t;
    t += duree(s);
    return d;
  });
};
export const dureeTotale = (v: Secret) => v.scenes.reduce((a, s) => a + duree(s), 0);
export const drop = (v: Secret) => debuts(v)[v.scenes.findIndex((s) => s.type === "secret")];

export const sfx = (v: Secret): Sfx[] => {
  const d = debuts(v);
  const out: Sfx[] = [];
  v.scenes.forEach((s, i) => {
    if (i > 0 && s.type !== "secret" && s.type !== "cta") out.push({ t: d[i] - 6, type: "whoosh" });
    for (const e of relatifs(s)) out.push({ ...e, t: d[i] + e.t });
  });
  return out.filter((e) => e.t >= 0).sort((a, b) => a.t - b.t);
};
