import { interpolate, random, useCurrentFrame } from "remotion";
import { K, TEXTE, TITRE, clamp, fr } from "./ui";

// Maquette d'écran TikTok LIVE stylisée (pas de logo TikTok : juste les codes visuels)
export const Phone: React.FC<{ diamants: number; bloque?: boolean; cadeaux?: boolean; largeur?: number }> = ({ diamants, bloque, cadeaux, largeur = 560 }) => {
  const f = useCurrentFrame();
  const h = largeur * 1.85;
  const glitch = bloque ? (random(`g${Math.floor(f / 2)}`) - 0.5) * 10 : 0;
  return (
    <div style={{ position: "relative", width: largeur, height: h, borderRadius: 64, border: "10px solid #1d1d24", background: "#0e0e14", overflow: "hidden", boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 80px ${bloque ? K.rouge : K.violet}44` }}>
      {/* "streamer" stylisé */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 38%, ${K.rose}66 0%, ${K.violet}55 35%, #0e0e14 75%)` }} />
      <div style={{ position: "absolute", left: "50%", top: h * 0.27, width: largeur * 0.32, height: largeur * 0.32, borderRadius: "50%", transform: "translateX(-50%)", background: "linear-gradient(180deg,#2a2036,#16121f)" }} />
      <div style={{ position: "absolute", left: "50%", top: h * 0.45, width: largeur * 0.62, height: h * 0.5, borderRadius: "45% 45% 0 0", transform: "translateX(-50%)", background: "linear-gradient(180deg,#2a2036,#16121f)" }} />
      {/* barre du haut */}
      <div style={{ position: "absolute", top: 34, left: 24, right: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: K.degrade, border: "3px solid #fff" }} />
        <div style={{ fontFamily: TEXTE, fontWeight: 800, color: "#fff", fontSize: 24 }}>@toi</div>
        <div style={{ marginLeft: "auto", fontFamily: TEXTE, fontWeight: 800, fontSize: 20, color: "#fff", background: "#FE2C55", borderRadius: 8, padding: "4px 12px" }}>LIVE</div>
        <div style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 20, color: "#fff", background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "4px 10px" }}>👁 1,2K</div>
      </div>
      {/* compteur de diamants */}
      <div style={{ position: "absolute", top: 120, left: 24, display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.55)", border: `2px solid ${bloque ? K.rouge : K.or}`, borderRadius: 999, padding: "10px 22px", transform: `translateX(${glitch}px)` }}>
        <span style={{ fontSize: 32 }}>💎</span>
        <span style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 36, color: bloque ? K.rouge : K.orClair }}>{fr.format(Math.round(diamants))}</span>
        <span style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 20, color: K.gris }}>/mois</span>
      </div>
      {/* commentaires */}
      <div style={{ position: "absolute", bottom: 40, left: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        {["Lina: 🔥🔥🔥", "Max: on est là !", "Sarah a envoyé 🌹"].map((c, i) => (
          <div key={i} style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 20, color: "#fff", background: "rgba(0,0,0,0.4)", borderRadius: 14, padding: "8px 14px", alignSelf: "flex-start", opacity: interpolate(f % 90, [i * 20, i * 20 + 8], [0.3, 1], clamp) }}>{c}</div>
        ))}
      </div>
      {/* cadeaux qui montent */}
      {cadeaux &&
        Array.from({ length: 14 }).map((_, i) => {
          const debut = i * 9;
          const p = ((f - debut) % 70) / 70;
          if (f < debut) return null;
          return (
            <div key={i} style={{ position: "absolute", right: 30 + random(`c${i}`) * 140, bottom: 80 + p * h * 0.8, fontSize: 40 + random(`s${i}`) * 30, opacity: 1 - p, transform: `rotate(${(random(`r${i}`) - 0.5) * 40}deg)` }}>
              {["💎", "🌹", "🦁", "🎁", "🚀"][i % 5]}
            </div>
          );
        })}
    </div>
  );
};
