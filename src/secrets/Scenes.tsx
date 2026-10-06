import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { Phone } from "../promo500k/Phone";
import { K, Kinetic, SAFE, TEXTE, TITRE, Tag, clamp, fr, orMetal, useSpring } from "../promo500k/ui";
import { LISTE_DEBUT, LISTE_ECART, T, duree } from "./timing";
import type { Scene } from "./types";

type P<S extends Scene["type"]> = Extract<Scene, { type: S }>;

// Espaces insécables de la typographie française : « », : ? ! ne se retrouvent jamais seuls en bord de ligne
const typo = (t: string) => t.replace(/« /g, "«\u00a0").replace(/ ([»:?!])/g, "\u00a0$1");

const Zone: React.FC<{ children: React.ReactNode; justify?: React.CSSProperties["justifyContent"]; gap?: number }> = ({ children, justify = "center", gap = 40 }) => (
  <AbsoluteFill style={{ paddingTop: SAFE.haut, paddingBottom: SAFE.bas - 120, paddingLeft: SAFE.gauche, paddingRight: SAFE.droite, display: "flex", flexDirection: "column", justifyContent: justify, alignItems: "center", gap }}>
    {children}
  </AbsoluteFill>
);

const Tampon: React.FC<{ texte: string; delai: number; couleur: string; rot?: number; taille?: number }> = ({ texte, delai, couleur, rot = -8, taille = 96 }) => {
  const s = useSpring(delai, 9, 0.6);
  const f = useCurrentFrame();
  if (f < delai) return null;
  return (
    <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: taille, color: couleur, border: `9px solid ${couleur}`, borderRadius: 22, padding: "2px 30px", transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [3, 1])})`, opacity: interpolate(s, [0, 0.2], [0, 1], clamp), textShadow: `0 0 40px ${couleur}`, boxShadow: `0 0 50px ${couleur}66, inset 0 0 30px ${couleur}44`, background: "rgba(5,5,7,0.65)" }}>
      {texte}
    </div>
  );
};

// ───────── HOOK ─────────
export const Hook: React.FC<P<"hook">> = ({ texte, visuel }) => {
  const f = useCurrentFrame();
  const s = useSpring(10, 10);
  const flotte = Math.sin(f / 10) * 10;
  return (
    <Zone justify="flex-start" gap={50}>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 24, marginTop: 30 }}>
        <Tag couleur={K.rose}>CE QUE PERSONNE NE TE DIT</Tag>
        <Kinetic texte={texte} taille={94} align="left" ecart={3} />
      </div>
      {visuel.type === "phone" ? (
        <div style={{ transform: `scale(${interpolate(f, [0, 120], [1.06, 0.98])})` }}>
          <Phone diamants={visuel.diamants} bloque={visuel.bloque} cadeaux={visuel.cadeaux} largeur={430} />
        </div>
      ) : (
        <div style={{ position: "relative", marginTop: 40, transform: `scale(${s}) translateY(${flotte}px)` }}>
          <div style={{ fontSize: 300, filter: `drop-shadow(0 0 60px ${visuel.barre ? K.rouge : K.or})` }}>{visuel.e}</div>
          {visuel.barre && <div style={{ position: "absolute", left: -20, right: -20, top: "50%", height: 22, borderRadius: 11, background: K.rouge, transform: `rotate(-35deg) scaleX(${interpolate(f, [25, 35], [0, 1], clamp)})`, boxShadow: `0 0 40px ${K.rouge}` }} />}
        </div>
      )}
    </Zone>
  );
};

// ───────── MYTHE ─────────
export const Mythe: React.FC<P<"mythe">> = ({ croyance, verite }) => {
  const f = useCurrentFrame();
  const barre = interpolate(f, [T.mythe.barre, T.mythe.barre + 8], [0, 1], clamp);
  return (
    <Zone gap={50}>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 24 }}>
        <Tag couleur={K.gris}>TOUT LE MONDE CROIT</Tag>
        <div style={{ position: "relative", opacity: interpolate(f, [T.mythe.barre, T.mythe.barre + 10], [1, 0.45], clamp) }}>
          <Kinetic texte={`« ${croyance} »`} taille={66} align="left" delai={T.mythe.croyance} ecart={2} style={{ textTransform: "none" }} />
          {/* une rayure rouge par ligne de texte (hauteur de ligne = 66 × 1,02) */}
          <div style={{ position: "absolute", left: -8, top: 0, bottom: 0, width: `${barre * 102}%`, background: `repeating-linear-gradient(180deg, transparent 0px, transparent 33px, ${K.rouge} 33px, ${K.rouge} 41px, transparent 41px, transparent 67.32px)`, filter: `drop-shadow(0 0 10px ${K.rouge})` }} />
        </div>
      </div>
      <div style={{ alignSelf: "flex-end", marginTop: -30 }}>
        <Tampon texte="FAUX" delai={T.mythe.barre + 4} couleur={K.rouge} taille={84} />
      </div>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 20 }}>
        <Tag delai={T.mythe.verite}>LA VÉRITÉ</Tag>
        <Kinetic texte={verite} taille={74} align="left" delai={T.mythe.verite + 4} ecart={2} />
      </div>
    </Zone>
  );
};

// ───────── SECRET (le drop) ─────────
export const SecretCard: React.FC<P<"secret">> = ({ numero, titre }) => {
  const f = useCurrentFrame();
  const s = useSpring(0, 9, 0.6);
  const ouvert = f >= 10;
  const rayons = interpolate(f, [0, 90], [0, 60]);
  return (
    <Zone gap={34}>
      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from ${rayons}deg at 50% 42%, ${K.or}00, ${K.or}22, ${K.or}00 12%, ${K.or}22 25%, ${K.or}00 37%, ${K.or}22 50%, ${K.or}00 62%, ${K.or}22 75%, ${K.or}00 87%, ${K.or}22)`, opacity: interpolate(f, [0, 15], [0, 1], clamp), maskImage: "radial-gradient(circle at 50% 42%, black 0%, transparent 60%)", WebkitMaskImage: "radial-gradient(circle at 50% 42%, black 0%, transparent 60%)" }} />
      <div style={{ fontSize: 200, transform: `scale(${interpolate(s, [0, 1], [2.2, 1])}) rotate(${ouvert ? 0 : -8}deg)`, filter: `drop-shadow(0 0 50px ${K.or})` }}>{ouvert ? "🔓" : "🔒"}</div>
      <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 150, letterSpacing: -4, lineHeight: 1, ...orMetal, transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})` }}>SECRET #{numero}</div>
      <Kinetic texte={titre} taille={70} delai={12} ecart={2} />
    </Zone>
  );
};

// ───────── ÉQUATION (A1) ─────────
export const Equation: React.FC = () => {
  const f = useCurrentFrame();
  const e = T.equation;
  const minutes = interpolate(f, [e.change, e.change + 20], [1.5, 3], clamp);
  const viewers = f < e.res2 ? Math.round(interpolate(f, [e.res1, e.res1 + 24], [0, 30], clamp)) : Math.round(interpolate(f, [e.res2, e.res2 + 32], [30, 60], clamp));
  const sCh = useSpring(e.change, 8);
  const Bloc: React.FC<{ label: string; valeur: string; delai: number; accent?: boolean; or?: boolean }> = ({ label, valeur, delai, accent, or }) => {
    const s = useSpring(delai, 12);
    return (
      <div style={{ alignSelf: "stretch", borderRadius: 32, padding: "22px 34px", background: accent ? "linear-gradient(135deg, rgba(155,92,255,0.28), rgba(255,46,154,0.14))" : "rgba(255,255,255,0.05)", border: `2px solid ${accent ? K.violet : or ? `${K.or}88` : "#ffffff1c"}`, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`, boxShadow: accent ? `0 0 50px ${K.violet}55` : "none" }}>
        <span style={{ fontFamily: TEXTE, fontWeight: 800, fontSize: 32, color: K.gris, letterSpacing: 2 }}>{label}</span>
        <span style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 108, lineHeight: 1, ...(or ? orMetal : { color: K.blanc }) }}>{valeur}</span>
      </div>
    );
  };
  const op = (t: string, d: number) => <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 70, color: K.rose, lineHeight: 0.8, opacity: interpolate(f, [d, d + 6], [0, 1], clamp) }}>{t}</div>;
  return (
    <Zone gap={18}>
      <Bloc label="ARRIVÉES / MIN" valeur="20" delai={e.l1} />
      {op("×", e.l1 + 8)}
      <div style={{ alignSelf: "stretch", transform: `scale(${1 + (sCh > 0.01 && sCh < 0.99 ? Math.sin(sCh * Math.PI) * 0.06 : 0)})` }}>
        <Bloc label="MINUTES VUES" valeur={fr.format(Math.round(minutes * 10) / 10)} delai={e.l1 + 12} accent />
      </div>
      {op("=", e.res1 - 6)}
      <Bloc label="VIEWERS" valeur={String(viewers)} delai={e.res1 - 4} or />
      <div style={{ height: 120, display: "flex", alignItems: "center" }}>
        <Tampon texte="×2 VIEWERS" delai={e.stamp} couleur={K.or} taille={80} />
      </div>
      <div style={{ fontFamily: TEXTE, fontWeight: 600, fontSize: 30, color: K.gris, opacity: interpolate(f, [e.stamp + 10, e.stamp + 20], [0, 1], clamp) }}>Sans un seul visiteur en plus.</div>
    </Zone>
  );
};

// ───────── ÉTAPES (A2) ─────────
export const Etapes: React.FC<P<"etapes">> = ({ titre, items }) => {
  const f = useCurrentFrame();
  const actif = T.etapes.filter((t) => f >= t).length - 1;
  return (
    <Zone gap={34}>
      <div style={{ alignSelf: "stretch" }}>
        <Kinetic texte={titre} taille={70} align="left" />
      </div>
      {items.map((it, i) => {
        const s = useSpring(T.etapes[i], 11);
        const on = i === actif;
        return (
          <div key={i} style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 30, padding: "30px 34px", borderRadius: 34, background: on ? "linear-gradient(135deg, rgba(155,92,255,0.3), rgba(255,46,154,0.16))" : "rgba(255,255,255,0.05)", border: `2px solid ${on ? K.violet : "#ffffff1c"}`, opacity: interpolate(s, [0, 1], [0, on ? 1 : 0.6]), transform: `translateX(${interpolate(s, [0, 1], [200, 0])}px) scale(${on ? 1.03 : 1})`, boxShadow: on ? `0 0 50px ${K.violet}66` : "none" }}>
            <div style={{ width: 92, height: 92, borderRadius: 26, background: K.degrade, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITRE, fontWeight: 900, fontSize: 54, color: K.blanc, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 70 }}>{it.e}</div>
            <div style={{ fontFamily: TITRE, fontWeight: 800, fontSize: 46, color: K.blanc, lineHeight: 1.1 }}>{typo(it.texte)}</div>
            {on && <div style={{ marginLeft: "auto", fontSize: 64, transform: `translateY(${Math.sin(f / 4) * 10}px)` }}>👈</div>}
          </div>
        );
      })}
    </Zone>
  );
};

// ───────── SCORE ALGO/HEURE (A3) ─────────
export const Score: React.FC<P<"score">> = ({ heures }) => {
  const f = useCurrentFrame();
  const H = 640;
  const y = (v: number) => H - (v / 140) * H;
  const couleur = (v: number) => (v >= 120 ? K.or : v < 80 ? K.rouge : K.violet);
  const alerte = f >= T.score.alerte;
  return (
    <Zone gap={26}>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 14 }}>
        <Tag>TON LIVE, HEURE PAR HEURE</Tag>
        <Kinetic texte="Score *Algo/heure*" taille={84} align="left" />
      </div>
      <div style={{ position: "relative", alignSelf: "stretch", height: H, marginTop: 30 }}>
        {[80, 100, 120].map((v) => (
          <div key={v} style={{ position: "absolute", left: 70, right: 0, top: y(v), borderTop: `3px dashed ${v === 80 ? K.rouge : v === 120 ? K.or : "#ffffff30"}`, opacity: v === 100 ? 0.6 : 0.9 }}>
            <span style={{ position: "absolute", left: -74, top: -20, fontFamily: TEXTE, fontWeight: 800, fontSize: 28, color: v === 80 ? K.rouge : v === 120 ? K.or : K.gris }}>{v}</span>
          </div>
        ))}
        <div style={{ position: "absolute", left: 90, right: 10, top: 0, bottom: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
          {heures.map((h, i) => {
            const s = useSpring(T.score.barres[i], 13);
            const c = couleur(h.s);
            const flash = alerte && h.s < 80 ? 0.6 + 0.4 * Math.abs(Math.sin(f / 4)) : 1;
            return (
              <div key={i} style={{ width: 130, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 52, color: c, opacity: s, textShadow: `0 0 20px ${c}` }}>{Math.round(h.s * s)}</div>
                <div style={{ width: "100%", height: ((h.s / 140) * H - 70) * s, borderRadius: "22px 22px 6px 6px", background: `linear-gradient(180deg, ${c}, ${c}55)`, boxShadow: `0 0 40px ${c}88`, opacity: flash }} />
                <div style={{ position: "absolute", bottom: -60, fontFamily: TEXTE, fontWeight: 800, fontSize: 34, color: K.blanc, transform: `translateX(${0}px)` }}>{h.h}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 10, marginTop: 70, opacity: interpolate(f, [T.score.legende, T.score.legende + 10], [0, 1], clamp) }}>
        <div style={{ fontFamily: TEXTE, fontWeight: 800, fontSize: 32, color: K.or }}>● Plus de 120 : heure en or, on la garde</div>
        <div style={{ fontFamily: TEXTE, fontWeight: 800, fontSize: 32, color: K.rouge }}>● Sous 80 deux fois : on change ou on coupe</div>
        <div style={{ fontFamily: TEXTE, fontWeight: 500, fontSize: 24, color: K.gris }}>Exemple illustratif · 100 = une heure normale pour toi</div>
      </div>
    </Zone>
  );
};

// ───────── DUO (A4) ─────────
export const Duo: React.FC<P<"duo">> = ({ titre, items }) => (
  <Zone gap={40}>
    <div style={{ alignSelf: "stretch" }}>
      <Kinetic texte={titre} taille={80} align="left" />
    </div>
    {items.map((it, i) => {
      const s = useSpring(T.duo[i], 12);
      return (
        <div key={i} style={{ alignSelf: "stretch", borderRadius: 36, padding: "36px 38px", background: "linear-gradient(135deg, rgba(242,181,0,0.14), rgba(255,255,255,0.04))", border: `2px solid ${K.or}66`, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px) rotate(${(i ? 1 : -1) * interpolate(s, [0, 1], [3, 0.6])}deg)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 80, ...orMetal }}>{i + 1}</div>
            <div style={{ fontSize: 70 }}>{it.e}</div>
            <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 48, color: K.blanc, lineHeight: 1.05 }}>{it.titre}</div>
          </div>
          <div style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 36, color: K.gris, marginTop: 16, lineHeight: 1.25 }}>{typo(it.sous)}</div>
        </div>
      );
    })}
  </Zone>
);

// ───────── LISTE ─────────
export const Liste: React.FC<P<"liste">> = ({ titre, style, items }) => {
  const couleur = style === "x" ? K.rouge : style === "check" ? K.vert : K.violet;
  return (
    <Zone gap={26}>
      <div style={{ alignSelf: "stretch", marginBottom: 16 }}>
        <Kinetic texte={titre} taille={78} align="left" />
      </div>
      {items.map((it, i) => {
        const d = LISTE_DEBUT + i * LISTE_ECART;
        const s = useSpring(d, 11);
        const f = useCurrentFrame();
        const shake = style === "x" && f >= d && f < d + 8 ? Math.sin((f - d) * 3) * 8 : 0;
        return (
          <div key={i} style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 26, padding: "20px 26px", borderRadius: 28, background: style === "x" ? "rgba(255,59,78,0.1)" : "rgba(255,255,255,0.05)", border: `2px solid ${couleur}44`, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-160, 0]) + shake}px)` }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITRE, fontWeight: 900, fontSize: 42, color: style === "check" ? K.noir : K.blanc, background: style === "num" ? K.degrade : couleur, boxShadow: `0 0 26px ${couleur}88`, transform: `scale(${s})` }}>
              {style === "num" ? i + 1 : style === "check" ? "✓" : "✕"}
            </div>
            <div style={{ fontFamily: TEXTE, fontWeight: 800, fontSize: 40, color: K.blanc, lineHeight: 1.15 }}>{typo(it)}</div>
          </div>
        );
      })}
    </Zone>
  );
};

// ───────── PUNCHLINE ─────────
export const Punchline: React.FC<P<"punchline">> = ({ tag, texte }) => (
  <Zone gap={30}>
    <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 24 }}>
      <Tag>{tag}</Tag>
      <Kinetic texte={texte} taille={100} align="left" ecart={3} />
    </div>
  </Zone>
);

// ───────── CTA ─────────
export const Cta: React.FC<P<"cta"> & { logo: string }> = ({ motcle, sous, logo }) => {
  const f = useCurrentFrame();
  const sLogo = useSpring(0, 10);
  const sBtn = useSpring(T.cta.bouton, 8);
  const pulse = 1 + Math.max(0, Math.sin(f / 4.5)) * 0.05;
  return (
    <Zone gap={34}>
      <Img src={logo} style={{ width: 400, transform: `scale(${sLogo})`, filter: `drop-shadow(0 0 40px ${K.or}aa)` }} />
      <Kinetic texte={motcle ? "Commente" : "Enregistre"} taille={90} delai={6} />
      <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: motcle ? 104 : 120, color: K.blanc, background: K.degrade, borderRadius: 36, padding: "22px 64px", transform: `scale(${sBtn * pulse}) rotate(-2deg)`, boxShadow: `0 0 80px ${K.rose}aa` }}>
        {motcle ? `« ${motcle} »` : "📌"}
      </div>
      <div style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 40, color: K.blanc, textAlign: "center", opacity: interpolate(f, [T.cta.bouton + 10, T.cta.bouton + 20], [0, 1], clamp) }}>{sous}</div>
      <div style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 32, color: K.or, opacity: interpolate(f, [T.cta.bouton + 25, T.cta.bouton + 35], [0, 1], clamp) }}>Abonne-toi pour les prochains secrets</div>
    </Zone>
  );
};

export const sceneDuree = duree;
