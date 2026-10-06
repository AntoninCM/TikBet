// Génère toutes les variantes : angle × accroche × format.
// Ajouter une accroche ou un angle ici = nouvelles vidéos automatiquement.
import { AVIS, CTA, SCENES, STATS } from "./contenu";
import type { Format } from "./theme";
import type { PromoProps, Scene } from "./types";

type Angle = {
  id: string;
  accroches: { texte: string; sous?: string; mascotte?: boolean }[];
  corps: Scene[];
  cta: Scene;
};

export const ANGLES: Angle[] = [
  {
    id: "preuve",
    accroches: [
      { texte: "*+10 000* créateurs accompagnés. Voici pourquoi 👇" },
      { texte: "La *1ère* agence TikTok LIVE agréée en France 🇫🇷" },
      { texte: "*300 000 €* de récompenses pour nos créateurs", sous: "Et ce n'est que le début" },
    ],
    corps: [{ type: "stats", items: [STATS.createurs, STATS.recompenses, STATS.prix] }, { type: "avis", items: AVIS.slice(0, 2) }],
    cta: CTA.challenge,
  },
  {
    id: "douleur",
    accroches: [
      { texte: "Tu fais des lives… mais *personne* ne vient ?" },
      { texte: "Tu lances un live et tu parles dans le *vide* ?" },
      { texte: "Pas beaucoup d'abonnés ? *Regarde ça* 👀" },
    ],
    corps: [SCENES.probleme, SCENES.promesse14j, SCENES.conditionsChallenge],
    cta: CTA.challenge,
  },
  {
    id: "ecosysteme",
    accroches: [
      { texte: "Une agence qui a créé ses *propres outils* pour tes lives", mascotte: true },
      { texte: "*4 outils* qu'aucune autre agence ne te donne" },
      { texte: "Tes lives en mode *jeu vidéo* 🎮", mascotte: true },
    ],
    corps: [SCENES.ecosysteme, { type: "stats", items: [STATS.createurs, STATS.agrement] }],
    cta: CTA.cap,
  },
  {
    id: "communaute",
    accroches: [
      { texte: "*592 avis*. Voilà ce que disent nos talents." },
      { texte: "Arrête de galérer *seul* en live" },
      { texte: "Ici, t'arrives pas dans un *truc froid*." },
    ],
    corps: [{ type: "avis", items: AVIS.slice(2, 5) }, SCENES.promesseFamille],
    cta: CTA.equipe,
  },
  {
    id: "challenge",
    accroches: [
      { texte: "*14 jours* pour transformer tes lives 💎" },
      { texte: "Challenge TikTok LIVE : dès *50 abonnés*" },
      { texte: "Même *sans vidéos* TikTok, tu peux percer en live" },
    ],
    corps: [SCENES.promesse14j, SCENES.conditionsChallenge, { type: "stats", items: [STATS.createurs] }],
    cta: CTA.challenge,
  },
  {
    id: "methode",
    accroches: [
      { texte: "Ce que font les *meilleurs* streamers TikTok de France" },
      { texte: "Ton live stagne ? Il te manque *une équipe*." },
      { texte: "Arrête d'improviser tes *lives*" },
    ],
    corps: [SCENES.promesseSetup, SCENES.conditionsAccompagnement, { type: "stats", items: [STATS.talents, STATS.managers] }],
    cta: CTA.cap,
  },
];

export type Variante = { id: string; props: PromoProps };

const id = (...p: (string | number)[]) => ["LiveUp", ...p].join("-").replace(/:/g, "x");

export const VARIANTES: Variante[] = [];

for (const a of ANGLES) {
  a.accroches.forEach((h, i) => {
    const hook: Scene = { type: "hook", ...h };
    // 1) Contenu organique 9:16 : toutes les accroches
    VARIANTES.push({ id: id(a.id, `h${i + 1}`, "9x16"), props: { format: "9:16", scenes: [hook, ...a.corps, a.cta] } });
    // 2) Pubs : formats feed (4:5, 1:1) sur la 1ère accroche de chaque angle
    if (i === 0) {
      for (const format of ["4:5", "1:1"] as Format[]) {
        VARIANTES.push({ id: id(a.id, `h${i + 1}`, format), props: { format, scenes: [hook, ...a.corps, a.cta] } });
      }
    }
    // 3) Bumpers ~6 s (accroche + CTA) pour tester les hooks en pub à petit budget
    VARIANTES.push({ id: id(a.id, `h${i + 1}`, "bumper"), props: { format: "9:16", scenes: [hook, a.cta] } });
  });
}

// 4) Version longue "présentation complète" (YouTube / site / présentation partenaire)
const complete: Scene[] = [
  { type: "hook", texte: "LiveUp : la *1ère* agence TikTok LIVE de France", mascotte: true },
  SCENES.probleme,
  SCENES.promesse14j,
  SCENES.ecosysteme,
  { type: "stats", items: [STATS.createurs, STATS.recompenses, STATS.prix] },
  { type: "avis", items: AVIS.slice(0, 3) },
  SCENES.conditionsChallenge,
  CTA.challenge,
];
for (const format of ["9:16", "16:9"] as Format[]) {
  VARIANTES.push({ id: id("presentation", format), props: { format, scenes: complete } });
}
