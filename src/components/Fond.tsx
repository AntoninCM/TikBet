import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

export const Fond: React.FC = () => {
  const f = useCurrentFrame();
  const angle = interpolate(f, [0, 600], [140, 220]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${C.fond1} 0%, ${C.fond2} 55%, #0d2a1c 100%)`,
      }}
    />
  );
};
