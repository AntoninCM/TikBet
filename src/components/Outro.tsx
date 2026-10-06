import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, gap: 40 }}>
      <div style={{ fontFamily: FONT, fontSize: 96, fontWeight: 900, color: C.texte, textAlign: "center", transform: `scale(${s})` }}>
        Tu le joues ? 👇
      </div>
      <div style={{ fontFamily: FONT, fontSize: 56, fontWeight: 700, color: C.accent, textAlign: "center" }}>
        Abonne-toi pour le prono de demain
      </div>
    </AbsoluteFill>
  );
};
