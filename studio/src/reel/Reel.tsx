import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { enter } from "../lib/motion";

// Police locale (fonctionne hors ligne, rendu identique partout). Geist : SIL OFL, voir public/fonts.
const fontFamily = "Geist";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/geist.woff2"),
  weight: "100 900",
});

export type ReelProps = {
  hook: string;
  highlight: string;
  points: string[];
  cta: string;
  handle: string;
  accent: string;
  background: string;
  foreground: string;
};

// Rythme (en secondes) : hook ≤ 2 s, quelque chose de nouveau toutes les 2 à 4 s, carton final ≤ 2 s
const HOOK_S = 2;
const POINT_S = 2.5;
const CTA_S = 2;

export const calculateReelMetadata: CalculateMetadataFunction<ReelProps> = ({
  props,
}) => ({
  durationInFrames: Math.round(
    (HOOK_S + POINT_S * props.points.length + CTA_S) * 30,
  ),
});

const useScale = () => {
  const { width, height } = useVideoConfig();
  return Math.min(width, height) / 1080;
};

const Hook: React.FC<ReelProps> = ({ hook, highlight, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const words = hook.split(" ");

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", padding: 90 * s, textAlign: "left" }}
    >
      <div style={{ fontSize: 120 * s, fontWeight: 800, lineHeight: 1.05 }}>
        {words.map((word, i) => {
          const p = enter(frame, fps, i * 3, "heavy");
          const isKey = highlight
            .toLowerCase()
            .split(" ")
            .includes(word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""));
          const bar = enter(frame, fps, words.length * 3 + 4, "snappy");
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                position: "relative",
                marginRight: 28 * s,
                transform: `translateY(${(1 - p) * 140 * s}px)`,
                clipPath: `inset(-20% -10% ${(1 - p) * 100}% -10%)`,
              }}
            >
              {isKey && (
                <span
                  style={{
                    position: "absolute",
                    left: -8 * s,
                    right: -8 * s,
                    bottom: 8 * s,
                    height: 44 * s,
                    background: accent,
                    transform: `scaleX(${bar})`,
                    transformOrigin: "left",
                  }}
                />
              )}
              <span style={{ position: "relative" }}>{word}</span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Point: React.FC<{
  index: number;
  total: number;
  text: string;
  accent: string;
  durationInFrames: number;
}> = ({ index, total, text, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const s = useScale();

  const inP = enter(frame, fps, 0, "default");
  const outP = enter(frame, fps, durationInFrames - 8, "snappy");
  const y = (1 - inP) * height * 0.6 - outP * height * 0.6;
  const textP = enter(frame, fps, 6, "heavy");
  const num = Math.round(interpolate(inP, [0, 1], [0, index + 1]));

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 90 * s }}>
      <div style={{ transform: `translateY(${y}px)` }}>
        <div
          style={{
            fontSize: 260 * s,
            fontWeight: 800,
            color: accent,
            lineHeight: 1,
          }}
        >
          {String(num).padStart(2, "0")}
          <span style={{ fontSize: 80 * s, opacity: 0.5 }}>
            /{String(total).padStart(2, "0")}
          </span>
        </div>
        <div
          style={{
            fontSize: 84 * s,
            fontWeight: 600,
            lineHeight: 1.15,
            marginTop: 30 * s,
            transform: `translateY(${(1 - textP) * 60 * s}px)`,
            clipPath: `inset(0 0 ${(1 - textP) * 100}% 0)`,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<ReelProps> = ({ cta, handle, accent, background }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const pill = enter(frame, fps, 0, "snappy");
  const sub = enter(frame, fps, 8, "heavy");

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 40 * s }}
    >
      <div
        style={{
          background: accent,
          color: background,
          fontSize: 90 * s,
          fontWeight: 800,
          padding: `${36 * s}px ${70 * s}px`,
          borderRadius: 999,
          transform: `scale(${pill})`,
        }}
      >
        {cta}
      </div>
      <div
        style={{
          fontSize: 56 * s,
          fontWeight: 600,
          transform: `translateY(${(1 - sub) * 50 * s}px)`,
          clipPath: `inset(0 0 ${(1 - sub) * 100}% 0)`,
        }}
      >
        {handle}
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const hook = HOOK_S * fps;
  const point = POINT_S * fps;
  const ctaStart = hook + point * props.points.length;

  return (
    <AbsoluteFill
      style={{
        background: props.background,
        color: props.foreground,
        fontFamily,
      }}
    >
      {/* Barre de progression : retient l'attention jusqu'au CTA */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 10,
          width: (frame / durationInFrames) * width,
          background: props.accent,
        }}
      />
      <Sequence durationInFrames={hook} name="Hook">
        <Hook {...props} />
      </Sequence>
      {props.points.map((text, i) => (
        <Sequence
          key={i}
          from={hook + i * point}
          durationInFrames={point}
          name={`Point ${i + 1}`}
        >
          <Point
            index={i}
            total={props.points.length}
            text={text}
            accent={props.accent}
            durationInFrames={point}
          />
        </Sequence>
      ))}
      <Sequence from={ctaStart} name="CTA">
        <Cta {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
