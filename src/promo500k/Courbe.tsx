import { interpolate, useCurrentFrame } from "remotion";
import { K, TEXTE, TITRE, clamp } from "./ui";

// Graphique "revenus LIVE" : plat sous le plafond (mode "plafond") ou en croissance (mode "croissance")
export const Courbe: React.FC<{ mode: "plafond" | "croissance"; debut: number; fin: number; largeur?: number; hauteur?: number }> = ({ mode, debut, fin, largeur = 860, hauteur = 520 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [debut, fin], [0, 1], clamp);
  const N = 60;
  const yPlafond = hauteur * 0.62;
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const x = t * largeur;
    const y =
      mode === "plafond"
        ? yPlafond + 18 + Math.sin(i * 1.7) * 10 + Math.cos(i * 0.9) * 6 // oscille sous le plafond
        : yPlafond + 18 - (Math.pow(t, 2.2) * (yPlafond - 30)) + Math.sin(i * 1.3) * 5 * (1 - t);
    return [x, y] as const;
  });
  const visibles = pts.slice(0, Math.max(2, Math.ceil(p * N) + 1));
  const d = visibles.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = visibles[visibles.length - 1];
  const couleur = mode === "plafond" ? K.rouge : K.or;
  return (
    <svg width={largeur} height={hauteur} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`aire-${mode}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={couleur} stopOpacity="0.45" />
          <stop offset="100%" stopColor={couleur} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={0} x2={largeur} y1={hauteur * g} y2={hauteur * g} stroke="#ffffff12" strokeWidth={2} />
      ))}
      <line x1={0} x2={largeur} y1={yPlafond} y2={yPlafond} stroke={K.rouge} strokeWidth={4} strokeDasharray="16 12" opacity={mode === "plafond" ? 1 : 0.35} />
      <text x={largeur} y={yPlafond - 16} textAnchor="end" fill={K.rouge} style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 30 }}>
        PLAFOND 100K 💎
      </text>
      <path d={`${d} L${lx},${hauteur} L0,${hauteur} Z`} fill={`url(#aire-${mode})`} />
      <path d={d} fill="none" stroke={couleur} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${couleur})` }} />
      <circle cx={lx} cy={ly} r={16} fill={couleur} style={{ filter: `drop-shadow(0 0 20px ${couleur})` }} />
      {mode === "croissance" && p > 0.95 && (
        <text x={lx - 30} y={ly + 14} textAnchor="end" fill={K.orClair} style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 44 }}>
          500K 💎
        </text>
      )}
      <text x={0} y={hauteur + 46} fill={K.gris} style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 26 }}>
        {mode === "plafond" ? "Tes diamants / mois" : "Objectif sur 90 jours"}
      </text>
    </svg>
  );
};
