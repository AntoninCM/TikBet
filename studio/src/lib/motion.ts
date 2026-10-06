import { spring, SpringConfig } from "remotion";

// Presets du Motion Reel Kit, convertis exactement en paramètres physiques Remotion
// (stiffness = ω², damping = 2ζω, mass = 1, avec ω = 2π / response).
export const SPRINGS = {
  // ~1,5 % de dépassement : boutons, toggles, bords d'attaque
  snappy: { mass: 1, stiffness: 815.7, damping: 45.7 },
  // ~0,5 % : cartes, conteneurs, caméra
  default: { mass: 1, stiffness: 246.7, damping: 27.02 },
  // aucun dépassement : gros texte, logos
  heavy: { mass: 1, stiffness: 157.9, damping: 25.13 },
  // ~20 % : mascottes uniquement, jamais sur l'UI ni le texte
  playful: { mass: 1, stiffness: 157.9, damping: 11.31 },
} satisfies Record<string, Partial<SpringConfig>>;

export type SpringPreset = keyof typeof SPRINGS;

/** Spring de 0 à 1 lancé à `delay` frames. */
export const enter = (
  frame: number,
  fps: number,
  delay = 0,
  preset: SpringPreset = "default",
) =>
  spring({
    frame: frame - delay,
    fps,
    config: SPRINGS[preset],
  });

/** Valeur qui suit plusieurs cibles : un spring par changement, chacun à son propre départ. */
export const track = (
  frame: number,
  fps: number,
  steps: { at: number; to: number; preset?: SpringPreset }[],
  initial = 0,
) =>
  steps.reduce(
    (value, step) =>
      value + (step.to - value) * enter(frame, fps, step.at, step.preset),
    initial,
  );
