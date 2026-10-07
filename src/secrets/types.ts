export type Visuel =
  | { type: "phone"; diamants: number; bloque?: boolean; cadeaux?: boolean }
  | { type: "emoji"; e: string; barre?: boolean };

export type Scene =
  | { type: "hook"; texte: string; visuel: Visuel; tag?: string }
  | { type: "mythe"; croyance: string; verite: string }
  | { type: "secret"; numero?: number; label?: string; titre: string }
  | { type: "equation" }
  | { type: "etapes"; titre: string; items: { e: string; texte: string }[] }
  | { type: "score"; heures: { h: string; s: number }[] }
  | { type: "duo"; titre: string; items: { e: string; titre: string; sous: string }[] }
  | { type: "liste"; titre: string; style: "num" | "check" | "x"; items: string[] }
  | { type: "punchline"; tag: string; texte: string }
  | { type: "cta"; motcle?: string; sous: string };

// badge : texte en haut à droite (par défaut "SECRET n/6")
export type Secret = { id: string; titre: string; badge?: string; scenes: Scene[] };
