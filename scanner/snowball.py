import json, re, collections, sys
rows = json.load(open('rows.json'))
done_tags = {l.strip().rstrip('/').split('/')[-1].lower() for l in open('scanner/seeds_hashtags.txt') if l.strip()}
GENERIC = {'fyp','foryou','foryoupage','pourtoi','pourtoii','pourtoipage','viral','fypシ','fypシ゚viral','fy','trend','tiktok','capcut','fypage','videoviral','viralvideo','pourtoiii','humour','drole','france','paris','fr'}
seed = [r for r in rows if r['age_h'] <= 168 and r['fr'] >= 3 and r['views'] >= 30000]
tags = collections.Counter(); sons = collections.Counter(); names = {}
for r in seed:
    for t in set(re.findall(r'#([\wÀ-ÿ]+)', r['desc'])):
        t = t.lower()
        if t not in done_tags and t not in GENERIC and len(t) > 2: tags[t] += r['views']
    sons[r['music_id']] += r['views']; names[r['music_id']] = r['music']
n = int(sys.argv[1]) if len(sys.argv) > 1 else 15
with open('snow.txt', 'w') as f:
    for t, v in tags.most_common(n): f.write(f'https://www.tiktok.com/tag/{t}\n'); print('tag', t, v)
    for m, v in sons.most_common(n):
        slug = re.sub(r'[^A-Za-z0-9]+', '-', names[m]).strip('-') or 'son'
        f.write(f'https://www.tiktok.com/music/{slug}-{m}\n'); print('son', names[m][:30], v)
