// Exporte le catalogue des variantes LiveUp en CSV (à importer dans Google Sheets pour suivre les tests pub)
import fs from "node:fs";
import { VARIANTES } from "../src/liveup/variantes";
import { dureeTotale } from "../src/liveup/durees";

const usage = (id: string) =>
  id.includes("bumper") ? "Pub - test d'accroche" : id.includes("presentation") ? "Présentation complète" : /4x5|1x1/.test(id) ? "Pub feed (Meta)" : "Organique TikTok / Reels + pub 9:16";
const esc = (s: string) => `"${s.replace(/\*/g, "").replace(/"/g, '""')}"`;
const lignes = [
  "id;angle;accroche;format;duree_s;usage;fichier;publie_le;budget;impressions;ctr;cpc;inscriptions;verdict",
  ...VARIANTES.map((v) => {
    const hook = v.props.scenes[0];
    const angle = v.id.split("-")[1];
    return [v.id, angle, esc(hook.type === "hook" ? hook.texte : ""), v.props.format, (dureeTotale(v.props.scenes) / 30).toFixed(1), usage(v.id), `out/liveup/${v.id}.mp4`, "", "", "", "", "", "", ""].join(";");
  }),
];
fs.writeFileSync("data/liveup-variantes.csv", lignes.join("\n") + "\n");
console.log(`${VARIANTES.length} variantes -> data/liveup-variantes.csv`);
