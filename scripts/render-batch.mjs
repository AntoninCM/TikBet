// Rend une vidéo par prono contenu dans data/pronos.json (tableau de Prono)
// Usage : npm run render:batch
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const fichier = process.argv[2] ?? "data/pronos.json";
const pronos = JSON.parse(fs.readFileSync(fichier, "utf8"));
fs.mkdirSync("out", { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });

for (const [i, prono] of pronos.entries()) {
  const composition = await selectComposition({ serveUrl, id: "PronoDuJour", inputProps: prono });
  const slug = `${prono.equipeDomicile}-${prono.equipeExterieur}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const outputLocation = `out/${String(i + 1).padStart(2, "0")}-${slug}.mp4`;
  await renderMedia({ composition, serveUrl, codec: "h264", outputLocation, inputProps: prono });
  console.log(`✅ ${outputLocation}`);
}
