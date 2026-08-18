# Knihovna: Mapa + Rejstřík — design

Datum: 2026-08-18
Stav: schváleno v brainstormu, čeká na implementační plán

## Problém

Knihovna je dnes jediný dvouúrovňový akordeon (`components/panels/wiki.tsx`): 7 kategorií, 32 článků. Bolí čtyři věci: chybí přehled celku, špatně se hledá konkrétní fakt, vstup působí jako stěna panelů a chybí zážitek objevování, který by ladil s kaichi tajemstvími. Mezi články neexistuje žádné propojení — slug se nepoužívá k navigaci.

Cílové zařízení: desktop/notebook. Mobil musí zůstat použitelný přes Rejstřík, mapa je desktopový zážitek.

## Zvolený koncept

Hybrid „Mapa + Rejstřík + čtecí panel" (varianta C z brainstormu):

- Tab INFORMACE dostane hlavičku s přepínačem **Mapa | Rejstřík** a společným search boxem.
- **Mapa**: vlevo interaktivní graf článků (~60 % šířky), vpravo stálý čtecí panel. Klik na uzel otevře článek ve čtecím panelu (stávající `WikiRenderer`). Pod článkem řádek **Souvisí** s chipy odvozenými z hran; klik naviguje na cílový článek a zvýrazní jeho uzel v mapě.
- **Rejstřík**: dnešní akordeon beze změn, navíc filtrovaný search boxem (názvy i plný text). Články se v něm čtou inline jako dosud.
- Search v Mapě ztlumí neodpovídající uzly, v Rejstříku filtruje řádky. Filtr běží klientsky nad už načtenými články.
- Učitel vidí totéž co student. GM admin (`wiki-admin.tsx`) beze změn.

## Rozvržení mapy

Shluky podle kategorií s ručně danými středy, pozice uvnitř shluků počítá simulace:

- 7 středů shluků je konstanta v kódu — jediný ručně laděný vstup.
- `d3-force` (nová závislost, jen simulační modul): odpudivost uzlů, pružiny hran, přitahování uzlu ke středu jeho kategorie, kolize.
- Simulace doběhne při načtení s fixním počtem ticků a deterministickými výchozími pozicemi → layout je při každém načtení stejný a dá se „naučit".
- Obrys shluku: tónovaná obálka kolem uzlů kategorie s popiskem; velikost obálky vyplyne ze simulace, ne z ruční definice.
- Velikost uzlu podle stupně (počtu hran).
- Zoom/pan ručně: wheel + drag nad SVG `transform`, žádná další knihovna.
- Styl přes stávající CSS proměnné (`--c-*`), screen-print vzhled, zlatá pro kaichi prvky.

## Data: kanonické vazby

Nová tabulka `wiki_links`:

```sql
id SERIAL PRIMARY KEY,
from_slug TEXT NOT NULL,
to_slug TEXT NOT NULL,
label TEXT NOT NULL,
kaichi_required INT DEFAULT 0
```

- Hrany jsou ruční autorská rozhodnutí s krátkým slovesným labelem („zakázal", „vede k", „vytěžuje"). Očekávaný rozsah ~50–80 hran.
- Seed: `seed-wiki` route rozšířena o `LINKS` pole, stejný delete+insert vzor jako `ARTICLES`. Seed validuje, že oba sluggy existují — jinak spadne.
- GET `/api/wiki` vrací vedle článků i hrany. Odemčená hrana (kaichi postavy ≥ `kaichi_required`) jde celá; zamčená jde bez labelu jako `{ from, to, locked: true }`.
- Zamčená hrana se kreslí čárkovaně se zlatým ███ místo labelu — hráč vidí, ŽE spojení existuje, ne JAKÉ. Stejná filozofie jako `:::kN` bloky: viditelná cenzura je motor.
- Autorství hran: Claude navrhne z kanonu (32 článků + design doc knihovny + rozložení tajemství), Tomáš schválí tabulku, pak seed.
- GM admin umí vazby upravovat (doplněno při realizaci): sekce Vazby v admin panelu, CRUD přes `/api/wiki/links`, validace slugů na serveru. Pozor: re-seed přes `seed-wiki` ruční úpravy přepíše (stejně jako u článků).

## Ověření

- Unit test gatingu hran (vzor `lib/wiki-blocks.test.mjs`): odemčená vs. zamčená hrana, hranice kaichi.
- Validace slugů v seedu pokrytá testem nebo aspoň chybou při seedu.
- Vizuální kontrola v běžící appce (student s nízkým a vysokým kaichi — zamčené hrany, Souvisí chipy, search).

## Rozsah

- Nová větev `knihovna-mapa`, aby `knihovna-faze-1` šla mergnout samostatně.
- Mimo rozsah: mobilní verze mapy, wiki-linky `[[...]]` v textu článků, změny Rejstříku nad rámec search boxu.
