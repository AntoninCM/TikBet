import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Courbe } from "./Courbe";
import { Phone } from "./Phone";
import { EV, SCENES } from "./timeline";
import { K, Kinetic, SAFE, TEXTE, TITRE, Tag, clamp, fr, orMetal, useSpring } from "./ui";

const Zone: React.FC<{ children: React.ReactNode; justify?: React.CSSProperties["justifyContent"]; gap?: number }> = ({ children, justify = "center", gap = 40 }) => (
  <AbsoluteFill style={{ paddingTop: SAFE.haut, paddingBottom: SAFE.bas - 120, paddingLeft: SAFE.gauche, paddingRight: SAFE.droite, display: "flex", flexDirection: "column", justifyContent: justify, alignItems: "center", gap }}>
    {children}
  </AbsoluteFill>
);

// Tampon qui s'écrase à l'écran ("PLAFOND", "90 JOURS")
const Tampon: React.FC<{ texte: string; delai: number; couleur: string; rot?: number; taille?: number }> = ({ texte, delai, couleur, rot = -10, taille = 110 }) => {
  const s = useSpring(delai, 9, 0.6);
  const f = useCurrentFrame();
  if (f < delai) return null;
  return (
    <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: taille, color: couleur, border: `10px solid ${couleur}`, borderRadius: 24, padding: "4px 34px", transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [3, 1])})`, opacity: interpolate(s, [0, 0.2], [0, 1], clamp), textShadow: `0 0 40px ${couleur}`, boxShadow: `0 0 50px ${couleur}66, inset 0 0 30px ${couleur}44`, background: "rgba(5,5,7,0.6)" }}>
      {texte}
    </div>
  );
};

// ───────────── 1. HOOK (0–4 s) : pattern interrupt, le compteur bloqué ─────────────
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const d = 99_400 + Math.min(600, f * 25) + (f > 24 ? (random(`d${Math.floor(f / 3)}`) - 0.5) * 300 : 0);
  const zoom = interpolate(f, [0, 120], [1.08, 1]);
  return (
    <Zone justify="flex-start" gap={30}>
      <div style={{ marginTop: 40 }}>
        <Kinetic texte="Bloqué à *100K* 💎 par mois ?" taille={112} ecart={4} />
      </div>
      <div style={{ position: "relative", transform: `scale(${zoom})` }}>
        <Phone diamants={Math.min(100_000, d)} bloque largeur={500} />
        <div style={{ position: "absolute", top: 380, left: -40, right: -40, display: "flex", justifyContent: "center" }}>
          <Tampon texte="PLAFOND" delai={EV.hookStamp} couleur={K.rouge} />
        </div>
      </div>
    </Zone>
  );
};

// ───────────── 2. AGITATION : la douleur ─────────────
export const Agitation: React.FC = () => {
  const o = SCENES.agitation[0];
  const lignes = ["Tu lives *tous* les jours.", "Mêmes viewers. Mêmes donateurs.", "_Même_ _plafond._"];
  return (
    <Zone gap={60}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, alignSelf: "stretch" }}>
        {lignes.map((l, i) => (
          <Kinetic key={i} texte={l} taille={i === 2 ? 110 : 74} delai={EV.agitLignes[i] - o} align="left" ecart={2} />
        ))}
      </div>
      <Courbe mode="plafond" debut={0} fin={140} largeur={840} hauteur={460} />
    </Zone>
  );
};

// ───────────── 3. DIAGNOSTIC : 3 blocages ─────────────
const BLOCAGES = [
  { emoji: "📅", titre: "Aucune stratégie d'events", sous: "Tu rates les pics de visibilité TikTok" },
  { emoji: "🔁", titre: "Toujours les 5 mêmes donateurs", sous: "Ta communauté de soutien ne grandit pas" },
  { emoji: "🎲", titre: "Des matchs au hasard", sous: "Pas de partenaires, pas de dynamique" },
];
export const Diagnostic: React.FC = () => {
  const o = SCENES.diagnostic[0];
  return (
    <Zone justify="flex-start" gap={34}>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 20, marginTop: 30 }}>
        <Tag couleur={K.rouge}>LE DIAGNOSTIC</Tag>
        <Kinetic texte="Le problème c'est pas *toi*." taille={84} align="left" ecart={3} />
        <Kinetic texte="C'est 3 blocages 👇" taille={60} delai={EV.diagSous - o} align="left" style={{ color: K.gris }} />
      </div>
      {BLOCAGES.map((b, i) => (
        <Carte key={i} {...b} n={i + 1} delai={EV.diagCartes[i] - o} />
      ))}
    </Zone>
  );
};
const Carte: React.FC<{ emoji: string; titre: string; sous: string; n: number; delai: number }> = ({ emoji, titre, sous, n, delai }) => {
  const s = useSpring(delai, 14);
  const f = useCurrentFrame();
  const shake = f - delai < 8 && f >= delai ? Math.sin((f - delai) * 3) * 10 : 0;
  return (
    <div style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 28, padding: "30px 34px", borderRadius: 32, background: "linear-gradient(135deg, rgba(255,59,78,0.16), rgba(255,255,255,0.04))", border: `2px solid ${K.rouge}66`, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [300, 0]) + shake}px)` }}>
      <div style={{ width: 96, height: 96, borderRadius: 26, background: `${K.rouge}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, flexShrink: 0 }}>{emoji}</div>
      <div>
        <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 44, color: K.blanc, lineHeight: 1.05 }}>
          <span style={{ color: K.rouge }}>#{n} </span>
          {titre}
        </div>
        <div style={{ fontFamily: TEXTE, fontWeight: 600, fontSize: 32, color: K.gris, marginTop: 8 }}>{sous}</div>
      </div>
    </div>
  );
};

// ───────────── 4. REVEAL : la promesse ─────────────
export const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const o = SCENES.reveal[0];
  const [c0, c1] = [EV.revealCompteur[0] - o, EV.revealCompteur[1] - o];
  const v = interpolate(f, [c0, c1], [100_000, 500_000], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const sCash = useSpring(EV.revealCash - o, 8);
  return (
    <Zone justify="flex-start" gap={20}>
      <div style={{ marginTop: 40 }}>
        <Kinetic texte="On t'aide à passer de" taille={58} style={{ color: K.gris }} ecart={2} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 80, color: K.gris, textDecoration: "line-through", textDecorationColor: K.rouge, opacity: interpolate(f, [0, 10], [0, 1], clamp) }}>100K</span>
        <span style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 70, color: K.blanc }}>→</span>
      </div>
      <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 210, lineHeight: 0.95, letterSpacing: -6, ...orMetal, transform: `scale(${1 + sCash * 0.06 - (sCash > 0.99 ? 0.06 : 0)})` }}>
        {fr.format(Math.round(v / 1000))}K
      </div>
      <div style={{ fontFamily: TITRE, fontWeight: 800, fontSize: 48, color: K.blanc }}>💎 de diamants / mois</div>
      <div style={{ marginTop: 10 }}>
        <Courbe mode="croissance" debut={c0} fin={c1} largeur={820} hauteur={420} />
      </div>
      <div style={{ position: "absolute", bottom: SAFE.bas - 60, right: SAFE.droite + 20 }}>
        <Tampon texte="EN 90 JOURS" delai={EV.revealStamp - o} couleur={K.or} rot={-6} taille={74} />
      </div>
    </Zone>
  );
};

// ───────────── 5. PLAN 90 JOURS ─────────────
const PHASES = [
  { j: "J1 → J30", nom: "FONDATIONS", obj: "150K", points: ["Audit de tes lives", "Setup pro & planning", "Formation aux events TikTok"] },
  { j: "J31 → J60", nom: "ACCÉLÉRATION", obj: "300K", points: ["Matchs ciblés avec LiveMatch", "Events TikTok au bon moment", "Lives interactifs avec LiveShow"] },
  { j: "J61 → J90", nom: "SCALE", obj: "500K", points: ["Nouveaux soutiens avec LiveAngel", "Quêtes de progression LiveSuccess", "Bilan avec ton manager chaque semaine"] },
];
export const Plan: React.FC = () => {
  const f = useCurrentFrame();
  const o = SCENES.plan[0];
  const debuts = EV.planPhases.map((t) => t - o);
  const actif = debuts.filter((d) => f >= d).length - 1;
  const remplissage = interpolate(f, [debuts[0], debuts[2] + 60], [0, 1], clamp);
  const sMgr = useSpring(EV.planManager - o, 10);
  return (
    <Zone justify="flex-start" gap={26}>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
        <Tag>LA MÉTHODE LIVEUP</Tag>
        <Kinetic texte="Le plan *90 jours*" taille={92} align="left" />
      </div>
      <div style={{ alignSelf: "stretch", position: "relative", display: "flex", flexDirection: "column", gap: 22, paddingLeft: 70 }}>
        <div style={{ position: "absolute", left: 22, top: 20, bottom: 20, width: 8, borderRadius: 4, background: "#ffffff1a" }}>
          <div style={{ width: "100%", height: `${remplissage * 100}%`, borderRadius: 4, background: K.degrade, boxShadow: `0 0 20px ${K.rose}` }} />
        </div>
        {PHASES.map((p, i) => (
          <Phase key={i} {...p} delai={debuts[i]} actif={i === actif} />
        ))}
      </div>
      <div style={{ alignSelf: "stretch", textAlign: "center", fontFamily: TITRE, fontWeight: 800, fontSize: 40, color: K.noir, background: K.degradeOr, borderRadius: 999, padding: "20px 30px", opacity: sMgr, transform: `scale(${interpolate(sMgr, [0, 1], [0.6, 1])})`, boxShadow: `0 0 50px ${K.or}66` }}>
        🤝 Un manager dédié du J1 au J90
      </div>
    </Zone>
  );
};
const Phase: React.FC<{ j: string; nom: string; obj: string; points: string[]; delai: number; actif: boolean }> = ({ j, nom, obj, points, delai, actif }) => {
  const s = useSpring(delai, 14);
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", opacity: interpolate(s, [0, 1], [0, actif ? 1 : 0.55]), transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(${actif ? 1 : 0.96})`, transformOrigin: "left center" }}>
      <div style={{ position: "absolute", left: -66, top: 26, width: 44, height: 44, borderRadius: "50%", background: actif ? K.degrade : "#2a2a33", border: "4px solid #050507", boxShadow: actif ? `0 0 30px ${K.rose}` : "none" }} />
      <div style={{ borderRadius: 28, padding: "24px 30px", background: actif ? "linear-gradient(135deg, rgba(155,92,255,0.25), rgba(255,46,154,0.12))" : "rgba(255,255,255,0.04)", border: `2px solid ${actif ? K.violet : "#ffffff14"}` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontFamily: TEXTE, fontWeight: 800, fontSize: 28, color: K.rose }}>{j}</span>
          <span style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 44, color: K.blanc }}>{nom}</span>
          <span style={{ marginLeft: "auto", fontFamily: TITRE, fontWeight: 900, fontSize: 36, ...orMetal }}>{obj} 💎</span>
        </div>
        {points.map((pt, k) => (
          <div key={k} style={{ fontFamily: TEXTE, fontWeight: 600, fontSize: 30, color: K.blanc, marginTop: 10, opacity: interpolate(f, [delai + 8 + k * 6, delai + 16 + k * 6], [0, 1], clamp) }}>
            <span style={{ color: K.or }}>▸ </span>
            {pt}
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────── 6. PREUVE ─────────────
const PREUVES = [
  { v: 2023, pre: "", suf: "", label: "1ère agence agréée TikTok LIVE en France", emoji: "🏅" },
  { v: 10000, pre: "+", suf: "", label: "créateurs accompagnés", emoji: "👥" },
  { v: 8, pre: "+", suf: "", label: "prix nationaux & internationaux", emoji: "🏆" },
];
export const Preuve: React.FC = () => {
  const f = useCurrentFrame();
  const o = SCENES.preuve[0];
  return (
    <Zone gap={34}>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 16 }}>
        <Tag>POURQUOI NOUS</Tag>
        <Kinetic texte="On ne promet pas. On le *fait*." taille={78} align="left" />
      </div>
      {PREUVES.map((p, i) => {
        const d = EV.preuveStats[i] - o;
        const s = useSpring(d, 13);
        const v = p.v === 2023 ? 2023 : Math.round(interpolate(f, [d, d + 25], [0, p.v], clamp));
        return (
          <div key={i} style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 30, padding: "28px 34px", borderRadius: 32, background: "rgba(255,255,255,0.05)", border: `2px solid ${K.or}44`, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})` }}>
            <div style={{ fontSize: 70 }}>{p.emoji}</div>
            <div>
              <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 84, lineHeight: 1, ...orMetal }}>
                {p.pre}
                {p.v === 2023 ? "N°1" : fr.format(v)}
                {p.suf}
              </div>
              <div style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 32, color: K.blanc, marginTop: 6 }}>{p.label}</div>
            </div>
          </div>
        );
      })}
    </Zone>
  );
};

// ───────────── 7. POUR QUI (qualification) ─────────────
const CRITERES = ["Tu fais déjà ~*100K* 💎 / mois", "Tu lives *régulièrement*", "Tu as *18 ans* ou plus", "Tu veux passer *pro*"];
export const PourQui: React.FC = () => {
  const o = SCENES.pourqui[0];
  return (
    <Zone gap={36}>
      <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: 16 }}>
        <Tag couleur={K.vert}>POUR QUI ?</Tag>
        <Kinetic texte="Ce programme est pour toi si :" taille={74} align="left" />
      </div>
      {CRITERES.map((c, i) => {
        const s = useSpring(EV.pourquiItems[i] - o, 11);
        return (
          <div key={i} style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-120, 0])}px)` }}>
            <div style={{ width: 76, height: 76, borderRadius: 22, background: K.vert, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITRE, fontWeight: 900, fontSize: 46, color: K.noir, flexShrink: 0, transform: `scale(${s})`, boxShadow: `0 0 30px ${K.vert}88` }}>✓</div>
            <Kinetic texte={c} taille={50} align="left" delai={EV.pourquiItems[i] - o} ecart={1} style={{ textTransform: "none" }} />
          </div>
        );
      })}
    </Zone>
  );
};

// ───────────── 8. CTA ─────────────
export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const o = SCENES.cta[0];
  const sLogo = useSpring(0, 10);
  const sBtn = useSpring(EV.ctaBouton - o, 8);
  const pulse = 1 + Math.max(0, Math.sin(f / 4.5)) * 0.05;
  return (
    <Zone gap={34}>
      <Img src={staticFile("liveup/logo.png")} style={{ width: 460, transform: `scale(${sLogo})`, filter: `drop-shadow(0 0 40px ${K.or}aa)` }} />
      <Kinetic texte="Prêt à viser *500K* ?" taille={96} delai={6} />
      <div style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 40, color: K.gris, textAlign: "center", opacity: interpolate(f, [16, 26], [0, 1], clamp) }}>Écris-nous en commentaire 👇</div>
      <div style={{ fontFamily: TITRE, fontWeight: 900, fontSize: 92, color: K.blanc, background: K.degrade, borderRadius: 36, padding: "26px 70px", transform: `scale(${sBtn * pulse}) rotate(-2deg)`, boxShadow: `0 0 80px ${K.rose}aa` }}>« 500K »</div>
      <div style={{ fontFamily: TEXTE, fontWeight: 700, fontSize: 36, color: K.or, opacity: interpolate(f, [EV.ctaBouton - o + 10, EV.ctaBouton - o + 20], [0, 1], clamp) }}>ou postule sur livesuccess.app</div>
      <div style={{ position: "absolute", bottom: SAFE.bas - 200, left: SAFE.gauche, right: SAFE.droite, fontFamily: TEXTE, fontWeight: 500, fontSize: 26, color: "#ffffff80", textAlign: "center" }}>
        Objectif indicatif · les résultats dépendent de l'implication de chaque créateur · 18+
      </div>
    </Zone>
  );
};
