import type { Scene } from "./types";

export const dureeScene = (s: Scene): number => {
  switch (s.type) {
    case "hook": return 75;
    case "probleme": return 30 + s.lignes.length * 35 + 30;
    case "promesse": return 105;
    case "stats": return 30 + s.items.length * 35 + 45;
    case "ecosysteme": return 40 + 4 * 28 + 50;
    case "avis": return 20 + s.items.length * 75;
    case "conditions": return 30 + s.items.length * 20 + 50;
    case "cta": return 110;
  }
};
export const dureeTotale = (scenes: Scene[]) => scenes.reduce((t, s) => t + dureeScene(s), 0);
