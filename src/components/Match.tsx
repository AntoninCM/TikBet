import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

const Equipe: React.FC<{ nom: string; delai: number; dir: 1 | -1 }> = ({ nom, delai, dir }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delai, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 120,
        fontWeight: 900,
        color: C.texte,
        transform: `translateX(${interpolate(s, [0, 1], [dir * 800, 0])}px)`,
        textAlign: "center",
      }}
    >
      {nom}
    </div>
  );
};

export const Match: React.FC<{ dom: string; ext: string; date: string }> = ({ dom, ext, date }) => {
  const f = useCurrentFrame();
  const vs = interpolate(f, [12, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
      <Equipe nom={dom} delai={0} dir={-1} />
      <div style={{ fontFamily: FONT, fontSize: 90, fontWeight: 900, color: C.accent, opacity: vs, transform: `scale(${vs})` }}>
        VS
      </div>
      <Equipe nom={ext} delai={6} dir={1} />
      <div style={{ fontFamily: FONT, fontSize: 44, color: C.texteDoux, marginTop: 50, opacity: vs }}>{date}</div>
    </AbsoluteFill>
  );
};
