// Rend toutes les variantes LiveUp (ou celles qui contiennent le filtre).
// Exemples :
//   npm run render:liveup                 -> tout
//   npm run render:liveup -- bumper       -> seulement les bumpers
//   npm run render:liveup -- douleur      -> seulement l'angle "douleur"
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const filtre = process.argv[2] ?? "";
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const dossier = "out/liveup";
fs.mkdirSync(dossier, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const compos = (await getCompositions(serveUrl, { browserExecutable })).filter(
  // sans filtre : les 50 variantes LiveUp ; avec filtre : toute composition qui le contient (ex. "Secret-")
  (c) => (filtre ? c.id.includes(filtre) : c.id.startsWith("LiveUp-")),
);
console.log(`🎬 ${compos.length} vidéos à rendre`);

for (const [i, composition] of compos.entries()) {
  const outputLocation = `${dossier}/${composition.id}.mp4`;
  await renderMedia({ composition, serveUrl, codec: "h264", outputLocation, browserExecutable });
  console.log(`✅ ${i + 1}/${compos.length} ${outputLocation}`);
}
