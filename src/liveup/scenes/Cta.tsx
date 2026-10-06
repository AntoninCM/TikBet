import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { L, POLICE, surligne, useU } from "../theme";
import { Cadre } from "./Cadre";

export const Cta: React.FC<{ titre: string; bouton: string; url: string; sous?: string; duree: number }> = ({ titre, bouton, url, sous, duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  const s = spring({ frame: f, fps, config: { damping: 12 } });
  const b = spring({ frame: f - 15, fps, config: { damping: 8 } });
  const pulse = 1 + Math.max(0, Math.sin((f - 30) / 5)) * 0.05;
  const doigt = Math.sin(f / 4) * 14;
  return (
    <Cadre duree={duree + 6 /* pas de fondu de sortie en fin de vidéo */}>
      <Img src={staticFile("liveup/logo.png")} style={{ width: 520 * u, transform: `scale(${s})`, filter: `drop-shadow(0 0 30px ${L.or}aa)` }} />
      <div style={{ fontFamily: POLICE, fontWeight: 900, fontSize: 80 * u, color: L.blanc, textAlign: "center", lineHeight: 1.1, marginTop: 50 * u, opacity: s }}>{surligne(titre)}</div>
      <div
        style={{
          marginTop: 60 * u,
          background: L.degrade,
          borderRadius: 999,
          padding: `${34 * u}px ${70 * u}px`,
          fontFamily: POLICE,
          fontWeight: 800,
          fontSize: 54 * u,
          color: L.blanc,
          transform: `scale(${b * pulse})`,
          boxShadow: `0 0 60px ${L.rose}aa`,
        }}
      >
        {bouton} →
      </div>
      <div style={{ fontSize: 80 * u, transform: `translateY(${doigt}px)`, marginTop: 20 * u, opacity: b }}>👆</div>
      <div style={{ fontFamily: POLICE, fontWeight: 800, fontSize: 50 * u, color: L.or, marginTop: 10 * u, opacity: interpolate(f, [30, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{url}</div>
      {sous && <div style={{ fontFamily: POLICE, fontWeight: 600, fontSize: 38 * u, color: L.gris, marginTop: 16 * u }}>{sous}</div>}
    </Cadre>
  );
};
