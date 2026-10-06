import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { dureeScene } from "./durees";
import { L, useU } from "./theme";
import type { PromoProps, Scene } from "./types";
import { Fond } from "./scenes/Fond";
import { Hook } from "./scenes/Hook";
import { Probleme } from "./scenes/Probleme";
import { Promesse } from "./scenes/Promesse";
import { Stats } from "./scenes/Stats";
import { Ecosysteme } from "./scenes/Ecosysteme";
import { AvisScene } from "./scenes/AvisScene";
import { Conditions } from "./scenes/Conditions";
import { Cta } from "./scenes/Cta";

const rendu = (s: Scene, duree: number) => {
  switch (s.type) {
    case "hook": return <Hook {...s} duree={duree} />;
    case "probleme": return <Probleme {...s} duree={duree} />;
    case "promesse": return <Promesse {...s} duree={duree} />;
    case "stats": return <Stats {...s} duree={duree} />;
    case "ecosysteme": return <Ecosysteme duree={duree} />;
    case "avis": return <AvisScene {...s} duree={duree} />;
    case "conditions": return <Conditions {...s} duree={duree} />;
    case "cta": return <Cta {...s} duree={duree} />;
  }
};

const Watermark: React.FC = () => {
  const u = useU();
  return (
    <Img
      src={staticFile("liveup/logo.png")}
      style={{ position: "absolute", top: 50 * u, left: "50%", transform: "translateX(-50%)", width: 200 * u, opacity: 0.9, filter: `drop-shadow(0 0 12px ${L.or}66)` }}
    />
  );
};

export const LivePromo: React.FC<PromoProps> = ({ scenes }) => {
  let t = 0;
  const derniere = scenes.length - 1;
  return (
    <AbsoluteFill>
      <Fond />
      {scenes.map((s, i) => {
        const d = dureeScene(s);
        const from = t;
        t += d;
        return (
          <Sequence key={i} from={from} durationInFrames={d}>
            {rendu(s, d)}
            {i !== derniere && s.type !== "hook" && <Watermark />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
