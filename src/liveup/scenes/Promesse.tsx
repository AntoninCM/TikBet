import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, surligne, useU } from "../theme";
import { Cadre } from "./Cadre";

export const Promesse: React.FC<{ titre: string; sous: string; duree: number }> = ({ titre, sous, duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  const s = spring({ frame: f, fps, config: { damping: 9 } });
  const s2 = spring({ frame: f - 18, fps, config: { damping: 14 } });
  return (
    <Cadre duree={duree}>
      <div style={{ fontSize: 150 * u, transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-30, 0])}deg)` }}>💎</div>
      <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 96 * u, color: L.blanc, textAlign: "center", lineHeight: 1.1, marginTop: 30 * u, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})` }}>
        {surligne(titre)}
      </div>
      <div style={{ fontFamily: POLICE, fontWeight: 600, fontSize: 48 * u, color: L.gris, textAlign: "center", lineHeight: 1.3, marginTop: 40 * u, opacity: s2, transform: `translateY(${interpolate(s2, [0, 1], [30, 0])}px)` }}>
        {sous}
      </div>
    </Cadre>
  );
};
