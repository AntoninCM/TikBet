import fs from "node:fs";
import { BPM, DUREE, FPS, SCENES, SFX } from "../src/promo500k/timeline";
fs.writeFileSync(process.argv[2], JSON.stringify({ fps: FPS, bpm: BPM, duree: DUREE, scenes: SCENES, sfx: SFX }));
