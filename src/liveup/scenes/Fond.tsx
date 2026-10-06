import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../theme";

// Fond noir + paillettes dorées qui montent (rappel du hero de livesuccess.app)
export const Fond: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: L.noir, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${L.or}22 0%, transparent 60%), radial-gradient(ellipse at 50% 110%, ${L.violet}33 0%, transparent 55%)`,
        }}
      />
      {Array.from({ length: 70 }).map((_, i) => {
        const x = random(`x${i}`) * width;
        const vitesse = 0.4 + random(`v${i}`) * 1.6;
        const y = (((random(`y${i}`) * height - f * vitesse) % height) + height) % height;
        const taille = 2 + random(`t${i}`) * 5;
        const scint = 0.3 + 0.7 * Math.abs(Math.sin(f / (8 + random(`s${i}`) * 20) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: taille,
              height: taille,
              borderRadius: "50%",
              background: L.orClair,
              opacity: scint * 0.8,
              boxShadow: `0 0 ${taille * 3}px ${L.or}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
