// usage: node collect.js urls.txt out.jsonl scrolls
const { chromium } = require(process.env.PWPATH);
const fs = require('fs');
const [urlsFile, outFile, scrolls='8'] = process.argv.slice(2);
const urls = fs.readFileSync(urlsFile,'utf8').split('\n').map(s=>s.trim()).filter(Boolean);
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ['--ignore-certificate-errors'] });
  const ctx = await b.newContext({ locale: 'fr-FR', timezoneId: 'Europe/Paris', ignoreHTTPSErrors: true, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36' });
  for (const url of urls) {
    const p = await ctx.newPage(); let n = 0;
    p.on('response', async r => {
      const u = r.url();
      if (!/\/api\/(challenge|music|prefetch\/explore|explore|post|repost)\/item_list/.test(u)) return;
      try { const j = await r.json(); for (const it of (j.itemList||j.item_list||[])) { n++; fs.appendFileSync(outFile, JSON.stringify({src: url, api: u.split('?')[0].split('/api/')[1], it})+'\n'); } } catch(e){}
    });
    try {
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await p.waitForTimeout(8000);
      for (let i=0;i<+scrolls;i++){ await p.mouse.wheel(0, 5000); await p.waitForTimeout(2500); }
    } catch(e) { console.error('ERR', url, e.message); }
    console.log(n, url);
    await p.close();
  }
  await b.close();
})();
