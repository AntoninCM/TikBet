import { Composition } from "remotion";
import { PronoDuJour, DUREE_TOTALE } from "./PronoDuJour";
import exemple from "../data/prono-exemple.json";
import type { Prono } from "./types";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PronoDuJour"
    component={PronoDuJour}
    durationInFrames={DUREE_TOTALE}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={exemple as Prono}
  />
);
