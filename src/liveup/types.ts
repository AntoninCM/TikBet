import type { Format } from "./theme";

export type Stat = { valeur: number; prefixe?: string; suffixe?: string; label: string };
export type Avis = { texte: string; auteur: string };

export type Scene =
  | { type: "hook"; texte: string; sous?: string; mascotte?: boolean }
  | { type: "probleme"; lignes: string[] }
  | { type: "promesse"; titre: string; sous: string }
  | { type: "stats"; items: Stat[] }
  | { type: "ecosysteme" }
  | { type: "avis"; items: Avis[] }
  | { type: "conditions"; titre: string; items: string[] }
  | { type: "cta"; titre: string; bouton: string; url: string; sous?: string };

export type PromoProps = { format: Format; scenes: Scene[] };
