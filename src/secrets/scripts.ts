// Série A — les 6 vidéos "secrets" (copywriting : doc "LiveUp — Copywriting & argumentaire de vente").
// Structure fixe : hook → mythe → SECRET (drop musical, toujours sur une mesure : frame 300) → démonstration → hacks → CTA.
import type { Secret } from "./types";

export const SECRETS: Secret[] = [
  {
    id: "A1-duree",
    titre: "Doubler ses viewers",
    scenes: [
      { type: "hook", texte: "Pour *doubler* tes viewers, tu n'as PAS besoin de plus de monde.", visuel: { type: "emoji", e: "👀" } },
      { type: "mythe", croyance: "Plus de viewers = plus de monde qui arrive", verite: "Ça dépend surtout du *temps* qu'ils restent." },
      { type: "secret", numero: 1, titre: "L'équation des viewers" },
      { type: "equation" },
      { type: "liste", titre: "Pour les faire *rester* :", style: "num", items: ["Annonce une boucle : « dans 10\u00a0min… »", "Résumé de 20 s toutes les 15 min", "Salue chaque arrivée par son prénom", "Questions en 1 mot : « tape 1 ou 2 »", "Zéro temps mort : ton modo relance"] },
      { type: "cta", motcle: "DURÉE", sous: "et je t'envoie le plan détaillé" },
    ],
  },
  {
    id: "A2-notifs",
    titre: "Les notifs qui n'arrivent pas",
    scenes: [
      { type: "hook", texte: "Tes abonnés ne reçoivent *pas* la notif de ton live.", visuel: { type: "emoji", e: "🔔", barre: true } },
      { type: "mythe", croyance: "Quand je lance, tous mes abonnés sont prévenus", verite: "Seulement ceux qui ont *activé la cloche*." },
      { type: "secret", numero: 2, titre: "Le tuto cloche en 10 secondes" },
      { type: "etapes", titre: "Dis-leur de faire ça *en live* :", items: [{ e: "👤", texte: "Va sur mon profil" }, { e: "🔔", texte: "Touche la cloche" }, { e: "✅", texte: "Choisis « Tous les LIVE »" }] },
      { type: "liste", titre: "Et *5 autres* hacks :", style: "num", items: ["Programme ton live en événement LIVE", "Poste un teaser 30 à 60 min avant", "Lance à heures fixes", "Crée un canal d'alerte WhatsApp ou Snap", "Demande à tes modos de relayer"] },
      { type: "cta", sous: "Enregistre cette vidéo avant ton prochain live" },
    ],
  },
  {
    id: "A3-score",
    titre: "Le Score Algo/heure",
    scenes: [
      { type: "hook", texte: "Tu ne sais pas quelle *heure* de ton live te coûte des diamants.", visuel: { type: "emoji", e: "⏰" } },
      { type: "mythe", croyance: "Mon live s'est bien passé, en moyenne", verite: "Une *seule heure* peut plomber tout ton live." },
      { type: "secret", numero: 3, titre: "Le Score Algo/heure" },
      { type: "score", heures: [{ h: "21h", s: 104 }, { h: "22h", s: 128 }, { h: "23h", s: 62 }, { h: "00h", s: 71 }] },
      { type: "liste", titre: "On mesure *4 choses* par heure :", style: "num", items: ["Rétention : combien de temps ils restent", "Engagement : est-ce que le chat vit", "Conversion : est-ce qu'ils s'abonnent", "Valeur : est-ce qu'ils te soutiennent"] },
      { type: "cta", motcle: "SCORE", sous: "et on calcule le tien avec toi" },
    ],
  },
  {
    id: "A4-algo",
    titre: "L'algo te compare",
    scenes: [
      { type: "hook", texte: "L'algo ne t'a pas *lâché*. Il te _compare._", visuel: { type: "phone", diamants: 41_000 } },
      { type: "mythe", croyance: "TikTok m'a mis en shadowban", verite: "Le plus souvent : tes viewers restent *moins longtemps* qu'avant." },
      { type: "secret", numero: 4, titre: "Il te compare à 2 choses" },
      { type: "duo", titre: "L'algo regarde :", items: [{ e: "📉", titre: "Tes lives d'avant", sous: "Ils restent moins qu'avant ? Il en envoie moins." }, { e: "🕘", titre: "Les lives du même créneau", sous: "Créneau saturé ? Tu passes après les autres." }] },
      { type: "liste", titre: "Comment *remonter* :", style: "num", items: ["Démarre fort : pas de « je m'installe »", "Relance toutes les 15 minutes", "Change de créneau s'il est saturé", "Annonce un rendez-vous : « à 22\u00a0h, match »"] },
      { type: "cta", motcle: "ALGO", sous: "et on regarde ton créneau ensemble" },
    ],
  },
  {
    id: "A5-signalements",
    titre: "Les signalements",
    scenes: [
      { type: "hook", texte: "Un signalement ne coupe pas ton live. *Ceci*, oui.", visuel: { type: "phone", diamants: 100_000, bloque: true } },
      { type: "mythe", croyance: "Je me fais couper à cause des signalements", verite: "Le signalement déclenche une vérif. C'est *ce qu'elle trouve* qui coupe." },
      { type: "secret", numero: 5, titre: "Les 5 prises qu'ils visent" },
      { type: "liste", titre: "Retire ces *prises* :", style: "x", items: ["Musique protégée, même la radio du jeu", "Écran fixe, rediffusion, toi absent", "Un mineur visible ou audible", "Un mot sensible lu à voix haute", "Cadeaux contre promesse hors TikTok"] },
      { type: "liste", titre: "Ta checklist *zéro prise* :", style: "check", items: ["2 à 3 modérateurs nommés", "Filtres de mots-clés activés", "Journal d'incidents avec captures", "Appel à chaque sanction"] },
      { type: "cta", sous: "Enregistre la checklist pour ton prochain live" },
    ],
  },
  {
    id: "A6-donateurs",
    titre: "Les gros donateurs",
    scenes: [
      { type: "hook", texte: "Les gros donateurs n'achètent *pas* des cadeaux.", visuel: { type: "phone", diamants: 128_000, cadeaux: true } },
      { type: "mythe", croyance: "Il me faut juste un gros donateur", verite: "Il te faut des *moments* qui donnent envie de donner." },
      { type: "secret", numero: 6, titre: "Ils achètent un moment et un statut" },
      { type: "liste", titre: "Crée le *moment* :", style: "num", items: ["Un match ou un défi à heure fixe", "Un objectif de live visible à l'écran", "Une énergie qui monte avec le geste"] },
      { type: "liste", titre: "Rends le *statut* visible :", style: "num", items: ["Top soutien de la semaine remercié", "Rôle de modo ou fan club", "Merci par le prénom, à chaque fois"] },
      { type: "punchline", tag: "À RETENIR", texte: "Tes petits soutiens sont tes *futurs gros* donateurs." },
      { type: "cta", motcle: "STATUT", sous: "et je t'envoie le parcours donateur" },
    ],
  },
];
