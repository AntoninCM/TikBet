import { loadFont } from "@remotion/fonts";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Polices hébergées dans public/fonts : rendu identique partout, même hors ligne
for (const [family, weight] of [["Montserrat", "800"], ["Montserrat", "900"], ["Inter", "500"], ["Inter", "700"], ["Inter", "800"]]) {
  loadFont({ family, weight, url: staticFile(`fonts/${family}-${weight}.woff2`), format: "woff2" });
}
export const TITRE = "Montserrat, sans-serif";
export const TEXTE = "Inter, sans-serif";

export const K = {
  noir: "#050507",
  or: "#F2B500",
  orClair: "#FFD95A",
  rose: "#FF2E9A",
  violet: "#9B5CFF",
  rouge: "#FF3B4E",
  vert: "#2BE07A",
  blanc: "#FFFFFF",
  gris: "#9C9DB0",
  degrade: "linear-gradient(90deg, #FF2E9A 0%, #9B5CFF 100%)",
  degradeOr: "linear-gradient(180deg, #FFE38A 0%, #F2B500 55%, #C98A00 100%)",
};

// Zone sûre TikTok : on évite le haut (UI), la colonne de droite (boutons) et le bas (légende)
export const SAFE = { haut: 230, bas: 420, gauche: 80, droite: 150 };

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useSpring = (delai = 0, damping = 13, mass = 0.7) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delai, fps, config: { damping, mass } });
};

// Texte "or métal" pour les chiffres clés
export const orMetal: React.CSSProperties = {
  background: K.degradeOr,
  WebkitBackgroundClip: "text",
  color: "transparent",
  filter: "drop-shadow(0 6px 30px rgba(242,181,0,0.45))",
};

// Titre cinétique : mots qui tombent un par un, "*mot*" en or, "_mot_" en rose
export const Kinetic: React.FC<{ texte: string; taille: number; delai?: number; ecart?: number; align?: "center" | "left"; style?: React.CSSProperties }> = ({ texte, taille, delai = 0, ecart = 3, align = "center", style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Surlignage multi-mots : "*90 jours*" → les deux mots en or
  let etatOr = false;
  let etatRose = false;
  const mots = texte.split(" ").map((m) => {
    const or = etatOr || m.includes("*");
    const rose = etatRose || m.includes("_");
    if ((m.match(/\*/g) ?? []).length % 2) etatOr = !etatOr;
    if ((m.match(/_/g) ?? []).length % 2) etatRose = !etatRose;
    return { mot: m.replace(/[*_]/g, ""), or, rose };
  });
  return (
    <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: taille, lineHeight: 1.02, letterSpacing: -1, color: K.blanc, textAlign: align, textTransform: "uppercase", ...style }}>
      {mots.map(({ mot, or, rose }, i) => {
        const s = spring({ frame: f - delai - i * ecart, fps, config: { damping: 12, mass: 0.5 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: taille * 0.22,
              opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
              transform: `translateY(${interpolate(s, [0, 1], [taille * 0.6, 0])}px) scale(${interpolate(s, [0, 1], [1.5, 1])})`,
              filter: `blur(${interpolate(s, [0, 1], [8, 0])}px)`,
              ...(or ? orMetal : {}),
              ...(rose ? { color: K.rose, textShadow: `0 0 30px ${K.rose}88` } : {}),
            }}
          >
            {mot}
          </span>
        );
      })}
    </div>
  );
};

// Petite étiquette de section ("ÉTAPE 2", "LE PROBLÈME"...)
export const Tag: React.FC<{ children: React.ReactNode; delai?: number; couleur?: string }> = ({ children, delai = 0, couleur = K.or }) => {
  const s = useSpring(delai);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        fontFamily: TEXTE,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: 6,
        color: couleur,
        border: `2px solid ${couleur}88`,
        background: `${couleur}14`,
        borderRadius: 999,
        padding: "10px 26px",
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const fr = new Intl.NumberFormat("fr-FR");
