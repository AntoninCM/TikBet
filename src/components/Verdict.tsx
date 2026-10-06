import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

export const Verdict: React.FC<{ pari: string; cote: number; confiance: number }> = ({ pari, cote, confiance }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 10 } });
  // la cote "compte" de 1.00 jusqu'à la vraie valeur
  const coteAffichee = interpolate(f, [10, 40], [1, cote], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70, gap: 50 }}>
      <div style={{ fontFamily: FONT, fontSize: 60, fontWeight: 900, color: C.texteDoux }}>🎯 NOTRE PRONO</div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 88,
          fontWeight: 900,
          color: C.fond1,
          background: C.accent,
          borderRadius: 30,
          padding: "40px 50px",
          textAlign: "center",
          transform: `scale(${s})`,
        }}
      >
        {pari}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 160, fontWeight: 900, color: C.accent2, transform: `scale(${pulse})` }}>
        @{coteAffichee.toFixed(2).replace(".", ",")}
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = interpolate(f, [40 + n * 5, 46 + n * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span key={n} style={{ fontSize: 80, opacity: n <= confiance ? 0.25 + on * 0.75 : 0.15 }}>
              🔥
            </span>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 40, color: C.texteDoux }}>Indice de confiance {confiance}/5</div>
    </AbsoluteFill>
  );
};
