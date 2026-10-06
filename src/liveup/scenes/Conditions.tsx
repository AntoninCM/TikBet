import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, surligne, useU } from "../theme";
import { Cadre } from "./Cadre";

export const Conditions: React.FC<{ titre: string; items: string[]; duree: number }> = ({ titre, items, duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  return (
    <Cadre duree={duree}>
      <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 76 * u, color: L.blanc, textAlign: "center", marginBottom: 50 * u, lineHeight: 1.1 }}>{surligne(titre)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 * u }}>
        {items.map((it, i) => {
          const s = spring({ frame: f - 25 - i * 20, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 * u, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})` }}>
              <span style={{ width: 64 * u, height: 64 * u, borderRadius: "50%", background: L.degrade, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 * u, color: L.blanc, fontWeight: 900, flexShrink: 0 }}>✓</span>
              <span style={{ fontFamily: POLICE, fontWeight: 700, fontSize: 52 * u, color: L.blanc }}>{surligne(it)}</span>
            </div>
          );
        })}
      </div>
    </Cadre>
  );
};
