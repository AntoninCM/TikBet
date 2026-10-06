import { useVideoConfig } from "remotion";

// Charte reprise de liveupagency.fr / livesuccess.app : noir, or, dégradé rose → violet
export const L = {
  noir: "#07070A",
  or: "#F2B500",
  orClair: "#F2CA5D",
  rose: "#FF2E9A",
  violet: "#B36BFF",
  blanc: "#FFFFFF",
  gris: "#A8A9B8",
  degrade: "linear-gradient(90deg, #FF2E9A 0%, #B36BFF 100%)",
};
export const POLICE = "'Inter', 'Helvetica Neue', Arial, sans-serif";

export type Format = "9:16" | "4:5" | "1:1" | "16:9";
export const DIMENSIONS: Record<Format, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "4:5": { width: 1080, height: 1350 },
  "1:1": { width: 1080, height: 1080 },
  "16:9": { width: 1920, height: 1080 },
};

// Unité responsive : 1 en 9:16, plus petite dans les formats moins hauts
export const useU = () => {
  const { width, height } = useVideoConfig();
  if (width > height) return (height / 1080) * 0.85; // paysage : on grossit, la largeur est bornée par Cadre
  return Math.min(width, height * 0.75) / 1080;
};

// "*mot*" → mot surligné en or
export const surligne = (texte: string) =>
  texte.split(/(\*[^*]+\*)/g).map((p, i) =>
    p.startsWith("*") ? (
      <span key={i} style={{ color: L.or, textShadow: `0 0 30px ${L.or}99` }}>
        {p.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
