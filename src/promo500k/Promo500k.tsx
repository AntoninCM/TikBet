import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Flash, Fond, Grain, Hud } from "./Decor";
import { Agitation, Cta, Diagnostic, Hook, Plan, PourQui, Preuve, Reveal } from "./Scenes";
import { SCENES, SceneId, TEMPS } from "./timeline";
import { clamp } from "./ui";

const COMPOSANTS: Record<SceneId, React.FC> = { hook: Hook, agitation: Agitation, diagnostic: Diagnostic, reveal: Reveal, plan: Plan, preuve: Preuve, pourqui: PourQui, cta: Cta };

// Caméra : léger "punch-in" sur chaque temps fort une fois le beat lancé + secousse sur les impacts
const useCamera = () => {
  const f = useCurrentFrame();
  const drop = SCENES.reveal[0];
  let zoom = 1;
  if (f >= drop) {
    const depuis = (f - drop) % (TEMPS * 2);
    zoom += 0.018 * Math.exp(-depuis / 5);
  }
  const impacts = [0, drop, SCENES.cta[0]];
  const shake = impacts.reduce((a, t) => a + (f >= t && f < t + 12 ? (12 - (f - t)) * 1.6 : 0), 0);
  const dx = Math.sin(f * 2.1) * shake;
  const dy = Math.cos(f * 1.7) * shake;
  return `translate(${dx}px, ${dy}px) scale(${zoom})`;
};

// Entrée de scène : zoom arrière + flou de mouvement sur 8 frames
const Entree: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, 8], [1.12, 1], clamp)})`, filter: `blur(${interpolate(f, [0, 8], [14, 0], clamp)}px)` }}>{children}</AbsoluteFill>
  );
};

export const Promo500k: React.FC = () => {
  const f = useCurrentFrame();
  const chaleur = interpolate(f, [SCENES.reveal[0] - 20, SCENES.reveal[0] + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#050507" }}>
      <Audio src={staticFile("promo500k/bande-son.wav")} />
      <AbsoluteFill style={{ transform: useCamera() }}>
        <Fond chaleur={chaleur} />
        {(Object.keys(SCENES) as SceneId[]).map((id) => {
          const [a, b] = SCENES[id];
          const C = COMPOSANTS[id];
          return (
            <Sequence key={id} from={a} durationInFrames={b - a} name={id}>
              <Entree>
                <C />
              </Entree>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Flash />
      <Grain />
      <Hud />
    </AbsoluteFill>
  );
};
