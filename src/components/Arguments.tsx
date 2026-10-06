import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

export const ECART_ARG = 45; // frames entre chaque argument

export const Arguments: React.FC<{ items: string[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 80, gap: 50 }}>
      <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 900, color: C.accent2, marginBottom: 20 }}>
        📊 POURQUOI ?
      </div>
      {items.slice(0, 3).map((t, i) => {
        const s = spring({ frame: f - i * ECART_ARG, fps, config: { damping: 15 } });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
              background: "rgba(255,255,255,0.06)",
              borderLeft: `10px solid ${C.accent}`,
              borderRadius: 24,
              padding: "36px 40px",
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 70, fontWeight: 900, color: C.accent }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.texte, lineHeight: 1.2 }}>{t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
