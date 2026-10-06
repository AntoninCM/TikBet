import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, useU } from "../theme";
import { Cadre } from "./Cadre";

// Les 4 outils maison listés sur liveupagency.fr
const OUTILS = [
  { emoji: "🏆", nom: "LiveSuccess", desc: "Des quêtes pour progresser" },
  { emoji: "🎮", nom: "LiveShow", desc: "Des jeux vidéo dans tes lives" },
  { emoji: "⚔️", nom: "LiveMatch", desc: "Des matchs auto entre créateurs" },
  { emoji: "😇", nom: "LiveAngel", desc: "Le lien avec tes soutiens" },
];

export const Ecosysteme: React.FC<{ duree: number }> = ({ duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  const t = spring({ frame: f, fps });
  return (
    <Cadre duree={duree} padding={60}>
      <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 64 * u, color: L.blanc, textAlign: "center", marginBottom: 50 * u, opacity: t }}>
        L'écosystème <span style={{ color: L.or }}>LiveUp</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 * u, width: "100%" }}>
        {OUTILS.map((o, i) => {
          const s = spring({ frame: f - 30 - i * 28, fps, config: { damping: 12 } });
          return (
            <div
              key={o.nom}
              style={{
                opacity: s,
                transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`,
                background: "rgba(255,255,255,0.05)",
                border: `3px solid ${L.or}66`,
                borderRadius: 32 * u,
                padding: `${40 * u}px ${24 * u}px`,
                textAlign: "center",
                boxShadow: `0 0 40px ${L.violet}33`,
              }}
            >
              <div style={{ fontSize: 90 * u }}>{o.emoji}</div>
              <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 52 * u, color: L.or, marginTop: 10 * u }}>{o.nom}</div>
              <div style={{ fontFamily: POLICE, fontWeight: 600, fontSize: 36 * u, color: L.blanc, marginTop: 10 * u, lineHeight: 1.25 }}>{o.desc}</div>
            </div>
          );
        })}
      </div>
    </Cadre>
  );
};
