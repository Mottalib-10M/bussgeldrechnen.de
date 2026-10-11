#!/usr/bin/env python3
"""
Baut src/data/bkat-2026.json aus dem amtlichen XML der Bußgeldkatalog-Verordnung
(gesetze-im-internet.de/bkatv_2013/xml.zip, Datei data-src/bkatv.xml).

Rejouable : python3 scripts/bkat/build-bkat.py
Mise à jour annuelle : retélécharger le zip, remplacer data-src/bkatv.xml, relancer, puis
`npx vitest run` (tests/bkat.test.ts vérifie les cas de référence lus dans le texte).

Ce que le script fait :
  1. lit chaque ligne du tableau de l'Anlage (laufende Nummer, Tatbestand, Vorschriften, Regelsatz) ;
  2. lit les tableaux du Anhang (Tabelle 1 Geschwindigkeit, Tabelle 2 Abstand, Tabelle 4 Erhöhung) ;
  3. ajoute les points de l'Anlage 13 FeV et la classe A/B de l'Anlage 12 FeV (Probezeit),
     codées ci-dessous à partir des listes de numéros du texte officiel (FeV, Stand 12.8.2026).
"""
import html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'data-src' / 'bkatv.xml'
OUT = ROOT / 'src' / 'data' / 'bkat-2026.json'

x = SRC.read_text(encoding='utf8')
stand = re.search(r'<standkommentar>(.*?)</standkommentar>', x).group(1)
norms = re.findall(r'<norm.*?</norm>', x, re.S)

def clean(s: str) -> str:
    s = re.sub(r'<BR\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

def rows(n: str):
    for r in re.findall(r'<row[^>]*>(.*?)</row>', n, re.S):
        yield [clean(c) for c in re.findall(r'<entry[^>]*>(.*?)</entry>', r, re.S)]

def norm_titled(prefix: str) -> str:
    for n in norms:
        t = re.search(r'<titel[^>]*>(.*?)</titel>', n, re.S)
        e = re.search(r'<enbez>(.*?)</enbez>', n)
        label = clean((e.group(1) if e else '') + ' ' + (t.group(1) if t else ''))
        if label.startswith(prefix):
            return n
    sys.exit(f'Norm introuvable : {prefix}')

# --------------------------------------------------------------------------- Anlage
anlage = norm_titled('Anlage (zu § 1 Absatz 1)')
NR = re.compile(r'^\(?\d+[a-z]?(\.\d+[a-z]?)*\)?$')
AMOUNT = re.compile(r'^([\d ]+) €')
FV = re.compile(r'Fahrverbot (\d) Monat')
entries, heading, part = [], '', ''
parent_text: dict[str, str] = {}
for c in rows(anlage):
    if len(c) == 1 and c[0]:
        if re.match(r'^[A-Z]\. ', c[0]) or re.match(r'^[a-f]\) ', c[0]):
            part = c[0]
        elif '§' not in c[0] and 'lfd. Nr.' not in c[0] and len(c[0]) < 90:
            heading = c[0]
        continue
    if not c or not NR.match(c[0]):
        continue
    nr = c[0]
    if nr.startswith('('):
        continue  # (aufgehoben)
    text = c[1] if len(c) > 1 else ''
    last = c[-1] if len(c) > 2 else ''
    refs = c[2] if len(c) >= 4 else ''
    m = AMOUNT.match(last.replace(' ', ' '))
    fine = int(m.group(1).replace(' ', '')) if m else None
    fv = FV.search(last)
    table = re.search(r'Tabelle (\d) Buchstabe ([abc])', last)
    parent = nr.rsplit('.', 1)[0] if '.' in nr else None
    full = text
    if parent and parent in parent_text and (text.startswith('–') or text[:1].islower()):
        full = parent_text[parent] + ' ' + text
    parent_text[nr] = full
    if text in ('(weggefallen)', '(aufgehoben)', '( aufgehoben )') or full.rstrip().endswith('–'):
        continue  # lignes eKFV dont le libellé « – mit … » manque dans le XML
    entries.append({
        'nr': nr, 'text': full, 'heading': heading, 'part': part, 'refs': refs,
        'fine': fine, 'fv': int(fv.group(1)) if fv else 0,
        'table': f'{table.group(1)}{table.group(2)}' if table else None,
        'soweit': 'soweit' in last,
    })

# --------------------------------------------------------------------------- Anhang
def months(s: str) -> int:
    m = re.search(r'(\d) Monat', s)
    return int(m.group(1)) if m else 0

t1 = norm_titled('Anhang (zu Nummer 11 der Anlage)')
speed = []
for c in rows(t1):
    if c and re.match(r'^11\.[123]\.\d+$', c[0]):
        band = c[1]
        nums = [int(v) for v in re.findall(r'\d+', band)]
        if 'über' in band:
            lo, hi = nums[0] + 1, None
        elif 'bis' in band and 'Minuten' in band:
            continue  # « bis 15 für mehr als 5 Minuten » : cas Lkw particulier, hors calculateur
        elif 'bis' in band:
            lo, hi = 0, nums[0]
        else:
            lo, hi = nums[0], nums[1]
        speed.append({'nr': c[0], 'cls': {'1': 'a', '2': 'b', '3': 'c'}[c[0][3]], 'lo': lo, 'hi': hi,
                      'inner': int(c[2].replace(' ', '')), 'outer': int(c[3].replace(' ', '')),
                      'fvInner': months(c[4]) if len(c) > 4 else 0, 'fvOuter': months(c[5]) if len(c) > 5 else 0})

t2 = norm_titled('Anhang (zu Nummer 12 der Anlage)')
distance = []
for c in rows(t2):
    if c and re.match(r'^12\.[567]\.\d$', c[0]):
        tenth = int(re.search(r'weniger als (\d) / 10', c[1]).group(1))
        distance.append({'nr': c[0], 'speedFrom': {'5': 80, '6': 100, '7': 130}[c[0][3]], 'tenths': tenth,
                         'fine': int(c[2].replace(' ', '')), 'fv': months(c[3]) if len(c) > 3 else 0})

t4 = norm_titled('Anhang (zu § 3 Absatz 3)')
increase = []
for c in rows(t4):
    if len(c) == 3 and c[0].replace(' ', '').isdigit():
        increase.append({'base': int(c[0].replace(' ', '')), 'danger': int(c[1].replace(' ', '')), 'damage': int(c[2].replace(' ', ''))})

# --------------------------------------------------------------------------- FeV Anlage 13 (points)
# Listes reprises du texte de l'Anlage 13 FeV (zu § 40), numéros du BKat.
TWO = ['241', '241.1', '241.2', '242', '242.1', '242.2', '243a', '243a.1', '243a.2', '243', '243.1', '243.2',
       '19.1.1', '19.1.2', '21.1', '21.2', '50', '50.1', '50.2', '50.3', '50a', '50a.1', '50a.2', '50a.3', '83.3',
       '89b.2', '244', '132.1', '132.2', '132.3', '132.3.1', '132.3.2', '135', '135.1', '135.2', '246.2', '246.3']
ONE = ['243b', '4.1', '4.2', '5a', '5a.1', '6', '8.1', '9', '10', '15', '17', '18', '19', '19.1', '153a', '21', '22', '34',
       '39.1', '41', '42.1', '44', '45', '51b.3', '53.1', '51a.1', '51a.2', '51a.3', '52a.1', '52a.2', '52a.2.1', '52a.3',
       '52a.4', '54a.1', '54a.2', '54a.3', '58.1', '58.1.1', '58.1.2', '58.2', '58.2.1', '66', '76', '79', '80.1', '82',
       '83.1', '83.2', '85', '87a', '88', '89', '89a', '89b.1', '136', '245', '92.1', '92.2', '93', '95.1', '95.2',
       '99.1', '99.2', '102.1', '102.1.1', '102.2.1', '104', '108', '109', '246.1', '247', '113', '116', '123', '129',
       '132', '132a', '132a.1', '132a.2', '132a.3', '132a.3.1', '132a.3.2', '133.1', '133.2', '133.3.1', '133.3.2',
       '150', '151.1', '151.2', '152', '152.1', '157.3', '159b', '164', '166', '171', '172', '251a', '175', '253',
       '186.1.3', '186.1.4', '186.2.3', '187a', '189.1.1', '189.1.2', '189.2.1', '189.2.2', '189.3.1', '189.3.2',
       '189a.1', '189a.2', '192', '193', '195', '196', '201', '202', '212', '213', '213a', '214.1', '214.2',
       '214a.1', '214a.2', '217', '223', '224', '233']
# Anlage 12 FeV, Abschnitt A (schwerwiegend) : Rechtsfahrgebot § 2 II, Geschwindigkeit § 3, Abstand § 4 I,
# Überholen § 5, Vorfahrt § 8 II, Abbiegen § 9, Rettungsgasse § 11 II, Autobahn § 2 I / § 18 II-V, VII,
# Bahnübergänge § 19, Busse § 20, Handy § 23 Ia, Fußgängerüberweg § 26, § 29, Ampel § 36/37, Blaulicht § 38,
# FZV § 3/4, § 24a/24c StVG, FeV § 48 und § 48a. Toute autre décision inscrite (avec points) : B.
A_CLASS = ['243b', '241', '241.1', '241.2', '242', '242.1', '242.2', '243', '243.1', '243.2', '243a', '243a.1', '243a.2',
           '4.1', '4.2', '8.1', '9', '10', '17', '18', '19', '19.1', '19.1.1', '19.1.2', '153a', '21', '21.1', '21.2',
           '22', '34', '39.1', '41', '42.1', '44', '45', '50', '50.1', '50.2', '50.3', '50a', '50a.1', '50a.2', '50a.3',
           '80.1', '82', '83.1', '83.2', '83.3', '88', '89', '89a', '89b.1', '89b.2', '244', '136', '245',
           '92.1', '92.2', '93', '95.1', '95.2', '246.1', '246.2', '246.3', '113', '116', '129', '132', '132.1', '132.2',
           '132.3', '132.3.1', '132.3.2', '132a', '132a.1', '132a.2', '132a.3', '132a.3.1', '132a.3.2', '133.1', '133.2',
           '133.3.1', '133.3.2', '135', '135.1', '135.2', '150', '171', '172', '251a', '175']

known = {e['nr'] for e in entries}
missing = [n for n in TWO + ONE if n not in known]
if missing:
    sys.exit(f'Numéros de l’Anlage 13 absents du BKat lu : {missing}')
for e in entries:
    e['points'] = 2 if e['nr'] in TWO else 1 if e['nr'] in ONE else 0
    e['probe'] = ('A' if e['nr'] in A_CLASS else 'B') if e['points'] else None

# Points des tableaux (Anlage 13 : 2.2.3, 2.2.4, 3.2.2, 3.2.3).
def speed_points(s):
    i = int(s['nr'].split('.')[2]); cls = s['cls']
    two_from = {'a': 6, 'b': 5, 'c': 6}[cls]       # 11.1.6 / 11.2.5 / 11.3.6 : 2 points innerorts seulement
    one = {'a': (3, 6), 'b': (2, 5), 'c': (4, 6)}[cls]
    pin = 2 if i > two_from or i == two_from else (1 if one[0] <= i <= one[1] else 0)
    pout = 2 if i > two_from else (1 if one[0] <= i <= one[1] else 0)
    if cls == 'b' and i == 2:
        pout = 0  # 11.2.2 : 1 point innerorts seulement
    return pin, pout
for s in speed:
    s['ptInner'], s['ptOuter'] = speed_points(s)
for d in distance:
    d['points'] = 2 if d['nr'] in ('12.6.3', '12.6.4', '12.6.5', '12.7.3', '12.7.4', '12.7.5') else 1

data = {
    '_source': 'Bußgeldkatalog-Verordnung (BKatV) vom 14. März 2013, ' + stand + '. Points : FeV Anlage 13 ; Probezeit : FeV Anlage 12.',
    '_url': 'https://www.gesetze-im-internet.de/bkatv_2013/',
    '_generated_by': 'scripts/bkat/build-bkat.py',
    'stand': stand,
    'entries': entries, 'speed': speed, 'distance': distance, 'increase': increase,
}
OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf8')
# Version allégée pour la recherche côté navigateur (accueil) : sans les références légales.
slim = [[e['nr'], e['text'], e['heading'], e['fine'], e['fv'], e['points'], e['probe'] or ''] for e in entries if e['fine'] is not None]
(ROOT / 'src' / 'data' / 'bkat-slim.json').write_text(json.dumps(slim, ensure_ascii=False, separators=(',', ':')), encoding='utf8')
(ROOT / 'src' / 'data' / 'bkat-tables.json').write_text(json.dumps({'stand': stand, 'speed': speed, 'distance': distance, 'increase': increase}, ensure_ascii=False, separators=(',', ':')), encoding='utf8')
print(f'{len(entries)} Tatbestände, {len(speed)} lignes Tabelle 1, {len(distance)} Tabelle 2, {len(increase)} Tabelle 4 → {OUT.relative_to(ROOT)}')
print('avec points :', sum(1 for e in entries if e['points']), '· classe A :', sum(1 for e in entries if e['probe'] == 'A'))
