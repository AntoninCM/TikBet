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

// Série B — un secret par profil de créateur (angles du doc "Copywriting & argumentaire de vente")
export const PROFILS: Secret[] = [
  {
    id: "B1-matcheurs",
    titre: "Matcheurs",
    badge: "SÉRIE PROFILS",
    scenes: [
      { type: "hook", tag: "SPÉCIAL MATCHEURS", texte: "Tu perds tes matchs à cause d'*une seule* décision. Et ce n'est pas pendant le match.", visuel: { type: "emoji", e: "🥊" } },
      { type: "mythe", croyance: "Je perds parce que ma commu donne moins", verite: "Tu perds quand tu *choisis* ton adversaire." },
      { type: "secret", label: "LE SECRET", titre: "Le bon adversaire vaut plus que le bon soir" },
      { type: "duo", titre: "Le bon adversaire :", items: [{ e: "🎯", titre: "Même niveau que toi", sous: "Un match serré fait donner les deux camps." }, { e: "🤝", titre: "Une commu compatible", sous: "Ses viewers peuvent devenir les tiens." }] },
      { type: "liste", titre: "Les hacks des *matcheurs* :", style: "num", items: ["Un calendrier de matchs à heures fixes", "Alterne matchs à enjeu et matchs plaisir", "Remercie le camp adverse après le match", "Après une défaite : annonce la revanche"] },
      { type: "cta", motcle: "MATCH", sous: "et je te présente LiveMatch" },
    ],
  },
  {
    id: "B2-gamers",
    titre: "Gamers",
    badge: "SÉRIE PROFILS",
    scenes: [
      { type: "hook", tag: "SPÉCIAL GAMERS", texte: "Tu as *500 viewers* sur Minecraft et 0 diamant ? Voilà pourquoi.", visuel: { type: "emoji", e: "🎮" } },
      { type: "mythe", croyance: "Mes viewers sont radins", verite: "Une partie d'entre eux *ne peut pas* t'envoyer de cadeaux." },
      { type: "secret", label: "LE SECRET", titre: "Il faut avoir 18 ans pour envoyer des cadeaux" },
      { type: "duo", titre: "Ce que ça change :", items: [{ e: "🧒", titre: "Un public très jeune", sous: "Beaucoup de viewers, peu de diamants." }, { e: "🌙", titre: "Attire aussi les adultes", sous: "Horaires plus tardifs, formats défis, ton adapté." }] },
      { type: "liste", titre: "Les hacks *gamers* :", style: "num", items: ["Facecam et voix en permanence", "Coupe la musique du jeu", "Le chat décide et déclenche des événements", "Défis chronométrés + objectif visible"] },
      { type: "cta", motcle: "GAME", sous: "et je te montre LiveShow" },
    ],
  },
  {
    id: "B3-gta-rp",
    titre: "GTA RP",
    badge: "SÉRIE PROFILS",
    scenes: [
      { type: "hook", tag: "SPÉCIAL GTA RP", texte: "La radio de *GTA* peut couper ton live. Personne ne te le dit.", visuel: { type: "emoji", e: "📻" } },
      { type: "mythe", croyance: "On m'a coupé à cause d'un hater", verite: "Souvent, c'est la *musique protégée* en fond." },
      { type: "secret", label: "LE SECRET", titre: "La musique du jeu compte comme de la musique" },
      { type: "liste", titre: "Ce qui *coupe* un live GTA :", style: "x", items: ["La radio de la voiture allumée", "Une musique en fond sur Discord", "Un écran de jeu sans toi ni ta voix", "Un mineur visible ou audible"] },
      { type: "liste", titre: "Fais de ton RP une *série* :", style: "num", items: ["Un personnage avec une histoire", "Des rendez-vous à heure fixe", "Le chat choisit la suite"] },
      { type: "cta", motcle: "RP", sous: "et on vérifie ton setup GTA" },
    ],
  },
  {
    id: "B4-artistes",
    titre: "Artistes",
    badge: "SÉRIE PROFILS",
    scenes: [
      { type: "hook", tag: "SPÉCIAL ARTISTES", texte: "Tu chantes juste et *personne* ne reste ? Le problème n'est pas ta voix.", visuel: { type: "emoji", e: "🎤" } },
      { type: "mythe", croyance: "Il me faut une performance parfaite", verite: "Ton public veut *participer* à la création." },
      { type: "secret", label: "LE SECRET", titre: "Le chat choisit, toi tu crées" },
      { type: "etapes", titre: "Le vote en *3 temps* :", items: [{ e: "💬", texte: "« 1 = ballade, 2 = son qui bouge »" }, { e: "🔥", texte: "Annonce le gagnant en direct" }, { e: "🎶", texte: "Joue-le pour eux" }] },
      { type: "liste", titre: "Les hacks *artistes* :", style: "num", items: ["Priorise tes créations originales", "Montre le processus : l'erreur, la correction", "Dédicaces et mercis par le prénom", "Jamais de dédicace vendue contre des cadeaux"] },
      { type: "cta", motcle: "SCÈNE", sous: "et on construit ton format de live" },
    ],
  },
  {
    id: "B5-discussion",
    titre: "Lives discussion",
    badge: "SÉRIE PROFILS",
    scenes: [
      { type: "hook", tag: "SPÉCIAL LIVES DISCUSSION", texte: "Tu parles dans le *vide* en live ? Ce n'est pas ton contenu, c'est ta structure.", visuel: { type: "emoji", e: "🎙️" } },
      { type: "mythe", croyance: "Il me faut de meilleurs sujets", verite: "Un live qui marche est une *émission*, pas une discussion." },
      { type: "secret", label: "LE SECRET", titre: "4 rubriques par heure" },
      { type: "liste", titre: "Ton *heure type* :", style: "num", items: ["00 : la question du jour", "15 : le débat « team A ou team B »", "30 : l'invité surprise en live", "45 : l'objectif de live"] },
      { type: "liste", titre: "Pour qu'ils *reviennent* :", style: "check", items: ["Annonce le thème du prochain live", "Un invité chaque soir", "Toujours aux mêmes heures"] },
      { type: "cta", motcle: "ÉMISSION", sous: "et on construit ton heure type" },
    ],
  },
];
