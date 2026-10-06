// Tout le texte vient de livesuccess.app et liveupagency.fr (relevé le 06/10/2026).
// "*mot*" = mot surligné en or.
import type { Avis, Scene, Stat } from "./types";

export const URL = "livesuccess.app";

export const STATS: Record<string, Stat> = {
  createurs: { valeur: 10000, prefixe: "+", label: "créateurs accompagnés" },
  recompenses: { valeur: 300000, prefixe: "+", suffixe: " €", label: "de récompenses distribuées" },
  prix: { valeur: 8, prefixe: "+", label: "prix nationaux & internationaux" },
  agrement: { valeur: 2023, label: "1ère agence agréée TikTok LIVE" },
  talents: { valeur: 2500, prefixe: "+", label: "talents dans l'agence" },
  managers: { valeur: 50, prefixe: "+", label: "managers dédiés" },
};

export const AVIS: Avis[] = [
  { texte: "Vous êtes vraiment une agence au top du TOP ! Merci pour tout ce que vous faites pour nous ♥", auteur: "anita_officiel" },
  { texte: "Agence et agente très réactives, à l'écoute et de bons conseils", auteur: "flokerache" },
  { texte: "Je progresse tous les jours, on grandit et on apprend avec des jeux et des rigolades", auteur: "dj.benofficiel" },
  { texte: "Ils nous apprennent des méthodes pour nous améliorer. Très bonne agence", auteur: "the_sliderontiktok" },
  { texte: "Toujours là pour soutenir ses créateurs, merci pour tout", auteur: "66e.n.d66" },
  { texte: "Manager au top, équipe au top", auteur: "bibou98809" },
];

export const SCENES = {
  probleme: { type: "probleme", lignes: ["Tu n'as pas *beaucoup* d'abonnés ?", "Tu ne sais pas *par où commencer* ?", "Tu galères *seul* en live ?"] },
  promesse14j: { type: "promesse", titre: "Transforme tes lives en *diamants*", sous: "Performe sur TikTok LIVE en 14 jours : plus de visibilité, plus d'abonnés, plus de diamants" },
  promesseFamille: { type: "promesse", titre: "Une vraie équipe. Une *famille*.", sous: "Des centaines de talents qui avancent fort en ce moment. #WeAreLiveUp" },
  promesseSetup: { type: "promesse", titre: "Des lives *structurés*, un setup *propre*", sous: "On t'aide à comprendre ce qui marche vraiment, et on t'accompagne sur les events TikTok" },
  conditionsChallenge: { type: "conditions", titre: "Le *Challenge* LiveUp", items: ["Dès *50 abonnés*", "Même *sans vidéos* TikTok", "Bilans réguliers", "Formations concrètes", "Managers impliqués"] },
  conditionsAccompagnement: { type: "conditions", titre: "Ce que tu *obtiens*", items: ["Un *manager* dédié", "Des *formations* concrètes", "Des *bilans* réguliers", "Le coaching *events TikTok*"] },
  ecosysteme: { type: "ecosysteme" },
} satisfies Record<string, Scene>;

export const CTA = {
  challenge: { type: "cta", titre: "Rejoins le *challenge*", bouton: "Rejoindre le challenge", url: URL, sous: "Dès 50 abonnés · sans vidéos TikTok" },
  equipe: { type: "cta", titre: "Rejoins la *team* LiveUp", bouton: "Je rejoins l'équipe", url: URL, sous: "#WeAreLiveUp" },
  cap: { type: "cta", titre: "Prêt à passer un *cap* ?", bouton: "Rejoindre le challenge", url: URL },
} satisfies Record<string, Scene>;
