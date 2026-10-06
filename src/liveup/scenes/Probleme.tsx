import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, surligne, useU } from "../theme";
import { Cadre } from "./Cadre";

export const Probleme: React.FC<{ lignes: string[]; duree: number }> = ({ lignes, duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  return (
    <Cadre duree={duree}>
      <div style={{ display: "flex", flexDirection: "column", gap: 44 * u, width: "100%" }}>
        {lignes.map((l, i) => {
          const s = spring({ frame: f - 10 - i * 35, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30 * u, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-80, 0])}px)` }}>
              <span style={{ fontSize: 70 * u }}>❌</span>
              <span style={{ fontFamily: POLICE, fontWeight: 800, fontSize: 64 * u, color: L.blanc, lineHeight: 1.15 }}>{surligne(l)}</span>
            </div>
          );
        })}
      </div>
    </Cadre>
  );
};
