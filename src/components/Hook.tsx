import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

export const Hook: React.FC<{ texte: string; sport: string }> = ({ texte, sport }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 12 } });
  const shake = f < 20 ? Math.sin(f * 2) * (20 - f) * 0.6 : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ fontFamily: FONT, color: C.texteDoux, fontSize: 48, fontWeight: 700, opacity: s, marginBottom: 40 }}>
        {sport}
      </div>
      <div
        style={{
          fontFamily: FONT,
          color: C.texte,
          fontSize: 104,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) translateX(${shake}px)`,
          textShadow: `0 0 40px ${C.accent}88`,
        }}
      >
        {texte}
      </div>
    </AbsoluteFill>
  );
};
