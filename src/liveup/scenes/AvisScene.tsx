import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, useU } from "../theme";
import type { Avis } from "../types";
import { Cadre } from "./Cadre";

export const AvisScene: React.FC<{ items: Avis[]; duree: number }> = ({ items, duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  return (
    <Cadre duree={duree} padding={60}>
      <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 56 * u, color: L.or, marginBottom: 40 * u }}>💬 Love Wall · 592 avis</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 * u, width: "100%" }}>
        {items.map((a, i) => {
          const s = spring({ frame: f - 10 - i * 75, fps, config: { damping: 14 } });
          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px) rotate(${(i % 2 ? 1 : -1) * interpolate(s, [0, 1], [4, 1])}deg)`,
                background: L.blanc,
                borderRadius: 36 * u,
                padding: `${36 * u}px ${44 * u}px`,
                boxShadow: `0 20px 60px ${L.rose}55`,
              }}
            >
              <div style={{ fontFamily: POLICE, fontWeight: 700, fontSize: 44 * u, color: L.noir, lineHeight: 1.3 }}>« {a.texte} »</div>
              <div style={{ fontFamily: POLICE, fontWeight: 800, fontSize: 34 * u, marginTop: 16 * u, background: L.degrade, WebkitBackgroundClip: "text", color: "transparent" }}>
                @{a.auteur}
              </div>
            </div>
          );
        })}
      </div>
    </Cadre>
  );
};
