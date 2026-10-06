import { Composition, Folder } from "remotion";
import { PronoDuJour, DUREE_TOTALE } from "./PronoDuJour";
import exemple from "../data/prono-exemple.json";
import type { Prono } from "./types";
import { LivePromo } from "./liveup/LivePromo";
import { VARIANTES } from "./liveup/variantes";
import { dureeTotale } from "./liveup/durees";
import { DIMENSIONS } from "./liveup/theme";
import { Promo500k } from "./promo500k/Promo500k";
import { DUREE as DUREE_500K } from "./promo500k/timeline";
import { SecretVideo } from "./secrets/SecretVideo";
import { SECRETS } from "./secrets/scripts";
import { dureeTotale as dureeSecret } from "./secrets/timing";

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
    <Composition id="Promo500k" component={Promo500k} durationInFrames={DUREE_500K} fps={30} width={1080} height={1920} />
    <Folder name="Secrets">
      {SECRETS.map((v) => (
        <Composition key={v.id} id={`Secret-${v.id}`} component={SecretVideo} durationInFrames={dureeSecret(v)} fps={30} width={1080} height={1920} defaultProps={{ id: v.id }} />
      ))}
    </Folder>
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
