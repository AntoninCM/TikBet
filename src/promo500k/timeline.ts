// Timeline unique (30 fps, 120 BPM → 1 temps = 15 frames, 1 mesure = 60 frames).
// Sert à la fois au montage (scènes) et à la génération de la bande-son (scripts/gen-audio-500k.py).
export const FPS = 30;
export const BPM = 120;
export const TEMPS = (FPS * 60) / BPM; // 15

export const SCENES = {
  hook: [0, 120],
  agitation: [120, 270],
  diagnostic: [270, 480],
  reveal: [480, 660],
  plan: [660, 960],
  preuve: [960, 1110],
  pourqui: [1110, 1260],
  cta: [1260, 1440],
} as const;
export type SceneId = keyof typeof SCENES;
export const DUREE = 1440; // 48 s

// Moments clés (frames absolues) — chaque son est calé sur une animation
export const EV = {
  hookStamp: 45,
  agitLignes: [135, 165, 210],
  diagTitre: 270,
  diagSous: 315,
  diagCartes: [345, 390, 435],
  riser: [420, 480],
  revealCompteur: [490, 570],
  revealCash: 575,
  revealStamp: 600,
  planPhases: [675, 765, 855],
  planManager: 930,
  preuveStats: [975, 1005, 1035],
  pourquiItems: [1125, 1145, 1165, 1185],
  ctaBouton: 1290,
};

export type Sfx = { t: number; type: "impact" | "whoosh" | "pop" | "stamp" | "glitch" | "tick" | "cash" | "riser" | "error" };

export const SFX: Sfx[] = [
  { t: 0, type: "impact" },
  { t: 8, type: "glitch" },
  { t: EV.hookStamp, type: "stamp" },
  ...(["agitation", "diagnostic", "plan", "preuve", "pourqui"] as SceneId[]).map((s) => ({ t: SCENES[s][0] - 6, type: "whoosh" as const })),
  ...EV.agitLignes.map((t) => ({ t, type: "pop" as const })),
  { t: EV.diagSous, type: "pop" },
  ...EV.diagCartes.map((t) => ({ t, type: "error" as const })),
  { t: EV.riser[0], type: "riser" },
  { t: SCENES.reveal[0], type: "impact" },
  ...Array.from({ length: 16 }, (_, i) => ({ t: EV.revealCompteur[0] + i * 5, type: "tick" as const })),
  { t: EV.revealCash, type: "cash" },
  { t: EV.revealStamp, type: "stamp" },
  ...EV.planPhases.map((t) => ({ t, type: "pop" as const })),
  { t: EV.planManager, type: "cash" },
  ...EV.preuveStats.map((t) => ({ t, type: "pop" as const })),
  ...EV.pourquiItems.map((t) => ({ t, type: "pop" as const })),
  { t: SCENES.cta[0], type: "impact" },
  { t: EV.ctaBouton, type: "cash" },
];
