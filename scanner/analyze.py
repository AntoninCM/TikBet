import json, sys, time, re, collections, glob
NOW = time.time()
FR_WORDS = re.compile(r"\b(je|tu|il|elle|nous|vous|les|des|est|pas|que|qui|avec|pour|mais|quand|trop|mdr|ptdr|frr|wesh|jsp|c'est|moi|toi|ma|mon|ta|ton)\b", re.I)
AFRO = re.compile(r"(🇨🇮|🇨🇲|🇬🇦|🇨🇩|🇨🇬|🇸🇳|🇲🇱|🇬🇳|🇧🇯|🇹🇬|🇧🇫|🇳🇪|🇲🇦|🇩🇿|🇹🇳|🇭🇹|abidjan|225|224|223|229|237|241|243|242|ivoir|gabon|cameroun|congo|senegal|sénégal|mali|guin|benin|bénin|togo|kinshasa|brazza|dakar|libreville|douala|mboka|haiti|haïti|maroc|alger|tunis)", re.I)
FRANCE = re.compile(r"(🇫🇷|\bparis\b|marseille|lyon|toulouse|lille|bordeaux|nantes|nice|\bfrance\b|\bfr\b|\b9[1-5]\b|\b13\b|\b69\b)", re.I)
def fr_score(it):
    a = it['author']; txt = it.get('desc', '') + ' ' + a.get('signature', '') + ' ' + a.get('nickname', '')
    s = 0
    if it.get('textLanguage') == 'fr': s += 3
    if len(FR_WORDS.findall(txt)) >= 2: s += 2
    if re.search(r"[éèàçêù]", txt): s += 1
    if FRANCE.search(txt): s += 2
    if AFRO.search(txt): s -= 3   # francophonie hors France
    return s
items = {}
for f in sys.argv[1:]:
    for l in open(f):
        r = json.loads(l); it = r['it']; i = it['id']
        src = ('son:' if '/music/' in r['src'] else 'tag:') + r['src'].rstrip('/').split('/')[-1][:30]
        if i not in items: items[i] = dict(it=it, srcs=set())
        items[i]['srcs'].add(src)
rows = []
for i, d in items.items():
    it = d['it']; age_h = max((NOW - int(it['createTime'])) / 3600, 0.5); v = int(it['stats']['playCount'])
    rows.append(dict(id=i, user=it['author']['uniqueId'], age_h=age_h, views=v, vph=v / age_h,
                     likes=int(it['stats']['diggCount']), shares=int(it['stats']['shareCount']), comments=int(it['stats']['commentCount']),
                     followers=int((it.get('authorStats') or {}).get('followerCount', 0)), fr=fr_score(it),
                     music=it['music'].get('title', ''), music_id=it['music']['id'], music_orig=it['music'].get('original', False),
                     desc=it.get('desc', '').replace('\n', ' '), srcs=d['srcs'],
                     url=f"https://www.tiktok.com/@{it['author']['uniqueId']}/video/{i}"))
json.dump([{**r, 'srcs': sorted(r['srcs'])} for r in rows], open('rows.json', 'w'), ensure_ascii=False)
print('vidéos uniques:', len(rows))
w7 = [r for r in rows if r['age_h'] <= 168]; print('publiées <7j:', len(w7))
fr7 = [r for r in w7 if r['fr'] >= 3]; print('<7j et FR (score>=3):', len(fr7))
