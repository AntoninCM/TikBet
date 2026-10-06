import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useU } from "../theme";

// Fondu d'entrée/sortie commun à toutes les scènes
export const Cadre: React.FC<{ duree: number; children: React.ReactNode; padding?: number }> = ({ duree, children, padding = 80 }) => {
  const f = useCurrentFrame();
  const u = useU();
  const o = interpolate(f, [0, 6, duree - 6, duree], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", padding, flexDirection: "column" }}>
      <div style={{ width: "100%", maxWidth: 1080 * u, display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
    </AbsoluteFill>
  );
};
