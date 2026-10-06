import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, surligne, useU } from "../theme";
import { Cadre } from "./Cadre";

export const Hook: React.FC<{ texte: string; sous?: string; mascotte?: boolean; duree: number }> = ({ texte, sous, mascotte, duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  const mots = texte.split(" ");
  return (
    <>
      {mascotte && (
        <AbsoluteFill style={{ opacity: 0.45 }}>
          <OffthreadVideo src={staticFile("liveup/fond.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      <Cadre duree={duree}>
        <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 108 * u, lineHeight: 1.08, color: L.blanc, textAlign: "center" }}>
          {mots.map((m, i) => {
            const s = spring({ frame: f - i * 3, fps, config: { damping: 11, mass: 0.6 } });
            return (
              <span key={i} style={{ display: "inline-block", marginRight: 24 * u, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [1.4, 1])})` }}>
                {surligne(m)}
              </span>
            );
          })}
        </div>
        {sous && (
          <div style={{ fontFamily: POLICE, fontWeight: 600, fontSize: 46 * u, color: L.gris, marginTop: 40 * u, textAlign: "center", opacity: interpolate(f, [20, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            {sous}
          </div>
        )}
      </Cadre>
    </>
  );
};
