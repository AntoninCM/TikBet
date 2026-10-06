import { Composition } from "remotion";
import { calculateReelMetadata, Reel, ReelProps } from "./reel/Reel";

// Contenu modifiable en direct dans le panneau « Props » du Studio
const defaultProps: ReelProps = {
  hook: "3 erreurs qui ruinent tes paris",
  highlight: "ruinent",
  points: [
    "Miser sans bankroll définie",
    "Courir après ses pertes",
    "Ignorer la valeur de la cote",
  ],
  cta: "Abonne-toi",
  handle: "@tikbet",
  accent: "#C6FF3D",
  background: "#0B0B0F",
  foreground: "#F5F5F7",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TikTok"
        component={Reel}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calculateReelMetadata}
      />
      <Composition
        id="YouTube"
        component={Reel}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        calculateMetadata={calculateReelMetadata}
      />
    </>
  );
};
