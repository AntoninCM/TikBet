import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { DUREE, SCENES } from "./timeline";
import { K, clamp } from "./ui";

// Fond : noir profond + 3 halos colorés qui dérivent lentement + paillettes
export const Fond: React.FC<{ chaleur: number }> = ({ chaleur }) => {
  const f = useCurrentFrame();
  const halo = (x: number, y: number, c: string, r: number) => (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${c} 0%, transparent 65%)` }} />
  );
  return (
    <AbsoluteFill style={{ background: K.noir, overflow: "hidden" }}>
      {halo(200 + Math.sin(f / 70) * 120, 500 + Math.cos(f / 90) * 150, `${K.violet}55`, 700)}
      {halo(900 + Math.cos(f / 80) * 100, 1300 + Math.sin(f / 60) * 140, `${K.rose}44`, 650)}
      <div style={{ opacity: chaleur }}>{halo(540, 900 + Math.sin(f / 50) * 80, `${K.or}55`, 800)}</div>
      {Array.from({ length: 45 }).map((_, i) => {
        const y = (((random(`y${i}`) * 1920 - f * (0.5 + random(`v${i}`) * 1.5)) % 1920) + 1920) % 1920;
        const t = 2 + random(`t${i}`) * 4;
        return (
          <div key={i} style={{ position: "absolute", left: random(`x${i}`) * 1080, top: y, width: t, height: t, borderRadius: "50%", background: K.orClair, opacity: (0.2 + 0.6 * Math.abs(Math.sin(f / 15 + i))) * (0.4 + chaleur * 0.6), boxShadow: `0 0 ${t * 3}px ${K.or}` }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Grain argentique + vignette : donne le rendu "pub" au lieu du rendu "slide"
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

// Flash blanc sur chaque coupe
export const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const coupes = Object.values(SCENES).map((s) => s[0]).filter((t) => t > 0);
  const o = Math.max(0, ...coupes.map((t) => interpolate(f, [t - 1, t, t + 5], [0, 0.55, 0], clamp)));
  return <AbsoluteFill style={{ background: K.blanc, opacity: o, mixBlendMode: "screen" }} />;
};

// Barre de progression + logo (rétention : le spectateur voit que ça avance)
export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(f / DUREE) * 100}%`, background: K.degrade, boxShadow: `0 0 20px ${K.rose}` }} />
      <Img src={staticFile("liveup/logo.png")} style={{ position: "absolute", top: 120, left: 70, width: 170, opacity: 0.95 }} />
    </AbsoluteFill>
  );
};
