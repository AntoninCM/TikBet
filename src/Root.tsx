import { Composition, Folder } from "remotion";
import { PronoDuJour, DUREE_TOTALE } from "./PronoDuJour";
import exemple from "../data/prono-exemple.json";
import type { Prono } from "./types";
import { LivePromo } from "./liveup/LivePromo";
import { VARIANTES } from "./liveup/variantes";
import { dureeTotale } from "./liveup/durees";
import { DIMENSIONS } from "./liveup/theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PronoDuJour"
      component={PronoDuJour}
      durationInFrames={DUREE_TOTALE}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={exemple as Prono}
    />
    <Folder name="LiveUp">
      {VARIANTES.map((v) => (
        <Composition
          key={v.id}
          id={v.id}
          component={LivePromo}
          durationInFrames={dureeTotale(v.props.scenes)}
          fps={30}
          {...DIMENSIONS[v.props.format]}
          defaultProps={v.props}
        />
      ))}
    </Folder>
  </>
);
