import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, useU } from "../theme";
import type { Stat } from "../types";
import { Cadre } from "./Cadre";

const fr = new Intl.NumberFormat("fr-FR");

export const Stats: React.FC<{ items: Stat[]; duree: number }> = ({ items, duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  return (
    <Cadre duree={duree}>
      <div style={{ display: "flex", flexDirection: "column", gap: 56 * u, alignItems: "center" }}>
        {items.map((st, i) => {
          const debut = 10 + i * 35;
          const s = spring({ frame: f - debut, fps, config: { damping: 14 } });
          const v = Math.round(interpolate(f, [debut, debut + 30], [0, st.valeur], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          return (
            <div key={i} style={{ textAlign: "center", opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})` }}>
              <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 130 * u, color: L.or, textShadow: `0 0 40px ${L.or}88`, lineHeight: 1 }}>
                {st.prefixe ?? ""}{fr.format(v)}{st.suffixe ?? ""}
              </div>
              <div style={{ fontFamily: POLICE, fontWeight: 700, fontSize: 44 * u, color: L.blanc, marginTop: 10 * u }}>{st.label}</div>
            </div>
          );
        })}
      </div>
    </Cadre>
  );
};
