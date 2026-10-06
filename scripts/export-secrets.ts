// Exporte la timeline de chaque vidéo secret (pour scripts/gen-audio.py)
import fs from "node:fs";
import { BPM, FPS } from "../src/promo500k/timeline";
import { SECRETS } from "../src/secrets/scripts";
import { drop, dureeTotale, sfx } from "../src/secrets/timing";
const dir = process.argv[2];
fs.mkdirSync(dir, { recursive: true });
for (const v of SECRETS) fs.writeFileSync(`${dir}/${v.id}.json`, JSON.stringify({ fps: FPS, bpm: BPM, duree: dureeTotale(v), drop: drop(v), sfx: sfx(v) }));
console.log(SECRETS.map((v) => v.id).join(" "));
