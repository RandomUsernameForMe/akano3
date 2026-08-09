# Knihovna Akano3 — naplnění skutečným obsahem

Datum: 2026-08-06

Nahrazuje placeholderový obsah v `app/api/admin/seed-wiki/route.ts` (Velký Pád,
Rada Devíti, Klan Červeného Draka, Seikido, Prvotní Pečeti) skutečným herním
světem z Google Docs. Placeholdery se světem Akano3 nesdílejí nic — jde o
kompletní přepis, ne editaci.

## Zdroje

| Dokument | ID | Role |
|---|---|---|
| Svět Akano3 | `1rMpHPnuOnQE0EywZ2Z6-MVX4V3gPw7fmrA8EbpWONLM` | Primární zdroj pravdy |
| Kruhy | `1H4lfMlb4URmjONweoUYUMQMXChdI7bzucYxVpyxa9Vg` | Zdroj pro články o kruzích |
| Designový dokument | `1z2Ddso47RfYnhu-bW4xB4rY5BWoVh2IxMbpy-H28T84` | Mimo rozsah. Nese jen strohý náčrt settingu, knihovna ho needituje ani neduplikuje. |

Přístup přes MCP `google-workspace`, účet `guth.jarkovsky.tomas@gmail.com`.

## Rozhodnutí

| # | Otázka | Rozhodnutí |
|---|---|---|
| R1 | Účel knihovny | Referenční příručka během hry + předehra/atmosféra. **Ne** primárně odměna za kaichi, **ne** primárně palivo pro konflikt. |
| R2 | Význam kaichi gradientu | Smíšeně podle tématu — někde jen více detailu, jinde vyšší úroveň přepisuje nižší. Režim se rozhoduje článek po článku. |
| R3 | Rozsah vůči designáku | Knihovna nese svět kompletně. Designák zůstává strohý, neřešíme ho. |
| R4 | Diegetický hlas | **Státní/školní terminál.** Oficiální databáze Akano3, kurátorovaná režimem. Suchý, autoritativní, místy propagandistický. |
| R5 | Přístup | Všechny role — student, učitel, Růže, dospělí. Každý má nějaké kaichi. |
| R6 | Kaichi ve hře | Start II–IV, roste během hry, na ceremoniálu V. |
| R7 | Tón na nárokových úrovních (I–III) | **Ospravedlnění, ne přiznání.** Fakt se předá úplně, ale zabalený do doktríny. Sedí na radikální konfucianismus režimu. |
| R8 | Délka článku | 1500–2500 znaků. Nadpis, 2–3 sekce, 1–2 utajené bloky. |
| R9 | Pořadí plnění | Svislý řez (3 články napříč I–VIII), pak šířka. |

## Kánon — vyřešené rozpory

Zdroje si na 17 místech odporují. Rozhodnutí níže jsou závazná pro veškerý
psaný obsah. Neuzavřené položky nesou návrh k dodatečnému schválení.

### Vyřešeno

**K1 — Mapa tajemství podle kaichi.** *Tajemství (DONE)* je závazné.
*Ukončení studia (WIP)* má překlep: „Slavnostní odhalení KAICHI VI" má být
**KAICHI V**.

| Kaichi | Milník | Tajemství |
|---|---|---|
| I | 10 let | Dřív jsme byli vyspělejší civilizace. Lidstvo žije, protože zabíjíme monstra. Co jsou lovci. |
| II | 15 let | Před ~40 lety proběhla genocida. Pustina za oceánem je po našich atomovkách. |
| III | 18 let | Lidé se můžou stát monstry. |
| IV | Mimořádná služba režimu | Návrat: jde to vrátit, každý lovec má 1 shot vrátit jedno monstrum na člověka. |
| V | Dokončení Akademie | Lovci nesmí mít rodinu — a je tomu fyzicky zabráněno. |
| VI | Vstup mezi lovce | Návrat (IV) je lež. |
| VII | Strategické elity | Kdo ztratí význam/řád, stává se monstrem. Fašismus je záměr, ne selhání. |
| VIII | „Pečující" | Měsíc je tělo mrtvého monstra. |

Řetěz je vnitřně konzistentní: VI se dozvíš „když se opravdu staneš lovcem",
což je přesně milník VI. Veřejně se uznává 7 úrovní; VIII není potvrzena.

**K2 — Kdo dostane Kaichi VI.** Ceremoniál uděluje **V** všem absolventům.
**VI** dostávají jen ti, kdo skutečně vstoupí mezi lovce (nebo do výzkumu či
velení). Plyne z K1.

**K3 — Co je Měsíc.** Platí *Vznik Země (DONE)*: Cukujomi je tvořivá entita,
vyslala Kaguju, každý zásah ji vyčerpával, zemřela spokojená ~10 000 let zpět.
Věta „Měsíc je tělo mrtvého monstra" zůstává doslova jako Kaichi VIII, ale je
to **režimní rámování**, které ospravedlňuje těžbu. Sekce
`______starší verze ____` v tabu *Junkin a monstra* je neplatná jako kosmologie;
její formulace „Cukujomi napadl Zemi a prohrál" se v knihovně objeví pouze jako
citovaná doktrína, nikdy jako vypravěčský fakt.

**K4 — Kaichi 0 neexistuje.** Nejnižší úroveň je I, nároková v 10 letech.

Stav v `lib/data.ts`: devět postav má `kaichiLevel: 0`, ale jsou to GM,
šest učitelů a dvě obrazovky — **ne studenti**. Opravit je potřeba takto:

- **Učitelé** (TCH1–TCH6) → **V–VII**. Jsou to dospělí ve školských a
  velitelských strukturách, kaichi 0 je u nich nesmysl.
- **GM a obrazovky** (GM1, DSP1, DSP2) → nediegetické, kaichi je u nich
  bezvýznamné. GM čte knihovnu přes admin API, které gating obchází.
  Ponechat 0.
- **Studenti s kaichi I** (S012 Ren, S024 Haruka) → **II nebo III**. Kaichi II
  je nároková v 15 letech a všem studentům je 15–19. Kaichi I je u nich
  nemožná.
- **Studenti s kaichi V** (S007 Ikai, S019 Shiho) → **IV**. Kaichi V se uděluje
  za dokončení Akademie; student ji mít na začátku nemůže.
Placeholderová škála (0 Novicové / I–II Učni / III–IV Praktici / V–VI Mistři /
VII–VIII Velitelé, povyšuje Rada) zaniká celá.

**K5 — Kanji.** 階知 „úroveň poznání". Placeholderové 開知 „Otevřené poznání"
zaniká.

**K6 — Mocnosti.** *Historie 2120* a *Upravené děti* říkají tři velmoci;
*Geopolitika* vyjmenovává čtyři další vedle Shin Junkinu.
→ **Tři velmoci** (Shin Junkin, Konfederace, Pakt Europa) plus **dvě menší
mocnosti** mimo velmocenský status: Meridián (putovní, bez území) a Země obrody
(mikrostáty). „Velmoc" a „mocnost" nejsou totéž — oba zdroje platí. V *Historii
2120* dostane „národ 2 inspirovaný Amerikou" jméno Konfederace a „národ 3
inspirovaný Evropou" jméno Pakt Europa.

**K7 — Časová osa.** *Historie* si protiřečí sama: nadpis 2100 + „po pěti
letech" dává úder 2105, ale nadpis 2111 + „po deseti letech" dává úder 2101.
*Lovci* píší „Během války (2095–2100)".
→ Závazná osa:

| Rok | Událost |
|---|---|
| 2095–2100 | Rozpad, frakční boje, miliony mrtvých. **Předehra, ne válka.** |
| 2100 | Vyhlášená Světová válka konce |
| 2101 | Atomový úder, desky se dávají do pohybu |
| 2101–2111 | Ozvěna zkázy — tektonická fáze |
| 2111 | Desky se zastavují |
| 2111–2120 | **巡灯 (Juntō) — „Putující světla"**. Přežívání, mrchožrouti, putující lovci, vznik kovenantu a prvních shidōsei |
| 2120 | Ustavení Shin Junkinu |
| 2143 | Současnost — 42 let od úderu, 23 let od vzniku státu |

Opravit: „po pěti letech šílených hrůz" v *Historii* (válka trvala rok);
„(2095–2100)" v *Lovcích* označuje předehru, ne válku.

**K8 — Ozvěna zkázy (亡響 Bōkyō).** = **jen tektonická fáze 2101–2111.**
V *Lovcích* opravit „(2101–2120)" na „(2101–2111)".

Období **2111–2120** dostává název **巡灯 (Juntō) — „Putující světla"**.
巡 obchůzka, 灯 lampa. Míří na lovce v šedivých cestovních pláštích, kteří
putovali z populačního centra do centra. Je to **lidový název, ne úřední** —
stát tehdy neexistoval, takže éru pojmenovala kolektivní paměť, ne úřad.
Terminál ho přebírá, protože jiný neexistuje.

Éra nese: lovecký kovenant, první shidōsei, zásadu trojic, případ Jestřába,
přechod od šedivých plášťů k rudým.

**K9 — Kulatá čísla.** *Upravené děti*: „před zhruba třiceti lety proběhla
světová válka". *Lovci/Výcvik*: „generálové z války před 20 lety".
→ Obě čísla jsou chyba, správně **42 let** od úderu. „Před 30 lety" v
*Geopolitice* („ještě před 30 lety ležely na dně oceánu") je naopak správně —
míří na 2111, tedy 32 let. Nechat.

**K10 — Akano1 vs Akano2.** Viz *Zdroje vyžadující revizi* níže. Rozpor je
skutečný a řeší se přepsáním zdroje, ne výkladem.

**K15 — Generace lovců.** Tab *Lovci* je počítá dvakrát a pokaždé jinak: sekce
*Výcvik* má tři generace počínaje válečnými generály, sekce *Historie* má
nultou až druhou a hráčské postavy řadí do druhé.
→ Závazné, **liší se od obou verzí ve zdroji**:

| Generace | Kdo | Dnes |
|---|---|---|
| **Nultá** | Zabíječi monster z doby **před válkou**. Tehdy se jim ještě neříkalo lovci — název dostali zpětně. | 65+, většina mrtvá |
| **První** | Ti, kdo po zkáze chodili světem a chránili lidi. Šedivé cestovní pláště, lovecký kovenant. | 50–70 |
| **Druhá** | Jejich učedníci přes shidōsei; a všichni akreditovaní po ustavení státu. | 25–50 |
| **Třetí** | Studenti projektu Akano. **Hráčské postavy.** | 15–19 |

Důsledky:

- „Generálové a hrdinové z války" nejsou lovci. Válka se vedla proti lidem, ne
  proti monstrům — tentýž tab to říká v sekci *Historie*. Věta ve *Výcviku*
  zaniká celá.
- Putující lovci v šedivých pláštích jsou **první** generace, ne nultá.
- Jestřáb (鷹, Taka), který si vzal učednici a stal se monstrem, je **první**
  generace.
- Hráčské postavy jsou **třetí**, ne druhá.
- Věkové pásmo „nultá 55–75, první 30–55" ze zdroje neplatí, viz tabulka.
- Že se nulté generaci tehdy neříkalo lovci, je dobrý materiál pro Kaichi I
  („co jsou lovci") — termín má datum vzniku.

**K11 — Názvy původů.** → Závazné jsou **Místní / Vedlejší / Cizí**, tedy
nadpisy z tabu *Původ*:

| Původ | Kdo | Poznámka |
|---|---|---|
| Místní | Shin Junkin | Nejvyšší společenská skupina |
| Vedlejší | Zbytek Oceánie — Jižní provincie, Nové pásmo, Okraj | Geneticky nerozlišitelní od Místních |
| Cizí | Pevniny — Amerika, Evropa | „Hlavní vlastnost je ŽE TO NA NĚM JE VIDĚT" |

Sada *Místní / Oceánský / Pevninský* z *Geopolitiky* a designáku zaniká.
Opravu designáku dělá autor, knihovna do něj nesahá.

**K12 — Shuten-dōji.** → Kód **FS9I8N8O** platí jako **oficiální klasifikace
režimu**. Shuten-dōji ale monstrum není — je to člověk, bývalý lovec. Že se
režim i lovci spletli, je **velké odhalení na hře**.

Důsledek pro knihovnu: článek *Bestiář: shuten-dōji* nese **pouze oficiální
verzi**. Pravda do knihovny nepatří v žádné kaichi vrstvě — odhalení se
odehrává hrou, ne čtením. Zbytek bestiáře smí obsahovat vodítka (chová se
cíleně, plášť sešitý z plášťů lovců, „lovec lovců"), ale nikde nesmí padnout
závěr. Formulace „není to doopravdy monstrum" ze zdroje se do knihovny
nepřenáší.

**K13 — Miasma a veřejnost.** → Veřejnost ví, **že** je miasma nebezpečná, a
zná **příznaky**. Že je surovinou pro **detektor lži**, je **Kaichi III**.
Není to rozpor, jen chybějící rozlišení.

**K14 — Kód monster v běžné mluvě.** → Překlep ve zdroji. Správně: „…protože
**stačí vědět** speciální vlastnost, nebezpečnost a identifikační znak."
Příklady tomu odpovídají — N4O lidožrouti, TN3C čichač, N7K lišky.

## Zdroje vyžadující revizi

Místa, kde zdrojový dokument nese neaktuální design. Knihovna z nich **nesmí**
čerpat, dokud nebudou přepsané.

### Značky zapsané do Google Docu (2026-08-06)

Všechny jsou inline v hranatých závorkách, začínají `⚠`, nesou datum. Jdou
odstranit hledáním `⚠`.

| Tab | `tab_id` | Kotva | Co říká |
|---|---|---|---|
| Historie 100 let | `t.0` | „Po pěti letech šílených hrůz…" | Celá závazná časová osa, úder 2101 |
| Lovci | `t.6cq2viovbhqf` | „První generace lovců byli generálové…" | Věta neplatí, čtyři generace |
| Lovci | `t.6cq2viovbhqf` | „Pro nás je zajímavý že tedy rozlišujeme tři druhy…" | Generací jsou čtyři, věková pásma neplatí |
| Lovci | `t.6cq2viovbhqf` | „Jedenáct let extrémních výkyvů…" | Ozvěna zkázy 2101–2111, nová éra Juntō |
| Upravené děti | `t.f1iutbve7u9h` | „Byla to krátká vlna…" | Datace i délka vlny neplatí |
| Upravené děti | `t.f1iutbve7u9h` | „Zajímavé odpovězené otázky:" | Vše níže překonané, Akana byly střední školy |
| Junkin a monstra | `t.2omdcjeiinql` | „Tsukoyomi napadl zemi a prohrál" | Neplatí jako kosmologie, jen jako doktrína režimu |

Neoznačeno zůstává: *Geopolitika* (názvy původů, K11) a *Bestiář*
(Shuten-dōji, K12) — obojí čeká na to, až se k nim dostane psaní.

### Svět Akano3 › Režim › Upravené děti (DONE)

**Status: POTŘEBUJE REVIZI.** Tab je označen DONE, ale nese překonaný design na
dvou místech. Značky zapsány přímo do Google Docu 2026-08-06 (tab
`t.f1iutbve7u9h`).

**(a) Stupňovitost Akan — sekce „Zajímavé odpovězené otázky".** Neplatí:

- „první Akano mělo být spíše základka… Akano2 bylo pořád na stejnou generaci
  ale později, tedy druhý stupeň, a Akano3 je teď střední"
- „Akano a Akano2 byly akademie na budování nové generace lidí" ve smyslu jedné
  generace vedené od dětství
- „všechny postavy jsou ze stejného období zhruba 3 let před zhruba 18 lety" —
  nesedí na „narozeny 2124–2128" z tabu *Historie 100 let*

**Kánon:** **Všechna Akana byly střední školy.** Tři po sobě jdoucí kohorty, ne
jedna generace provedená stupni. Timeline sedí bez úprav: Akano1 2133, Akano2
2134–2138 (masakr), Akano3 od 2139, dnes 2143.

**(b) Datace vlny transmutace.** Neplatí „Byla to krátká vlna, ale do nějaké
míry velká část dětí narozena před zruba dvaceti lety byla nějakým způsobem
upravena." Ani délka („krátká"), ani datace („před zhruba dvaceti lety", ≈2123)
nejsou závazné.

Souvisí s (a): Akano1 jako střední škola v 2133 má studenty narozené ~2115–2119,
tedy před takto datovanou vlnou. Buď byla vlna delší a starší, nebo Akano1 a
Akano2 nebyly školami pro děti šepotu a jejich zánik má jinou příčinu.

**Dopad na knihovnu je malý.** „Proč Akano existuje" na vlně transmutace
**nestojí** — Akano existuje prostě proto, že je potřeba chránit lidstvo před
monstry a monstra zabíjet. To je plnohodnotný a soběstačný důvod a je to i ten,
který režim uvádí. Tsugumi Keikaku je vrstva navíc, ne základ.

Do vyřešení:

- žádný článek neuvádí konkrétní rok ani délku vlny transmutace
- článek *Akano1 a Akano2* se odkládá do fáze 3
- *Akano3: projekt* se píše ve fázi 2 normálně, bez odkazu na děti šepotu

**Samostatná otázka, zatím nerozhodnutá:** patří projekt Tsugumi Keikaku do
knihovny vůbec? Zdroj sám říká „není cíl, aby tohle byla velká zápletka, ani
velké odhalení, tohle zní jako věc, kterou se může 80 % postav dozvědět **po
hře**". Pokud to platí, je to materiál pro organizátory, ne pro terminál — a
platí na něj stejný precedens jako na Shuten-dōjiho (K12).

## Model obsahu

### Kategorie

Placeholderové kategorie (Svět, Politika, Frakce, Historie, Věda & Technologie,
Osobnosti) zanikají. Nové:

| Kategorie | Obsah | Zdrojový tab |
|---|---|---|
| Svět | Shin Junkin, regiony, mocnosti, původ | Geopolitika, Původ |
| Historie | 2031 → 2143 | Historie 100 let, Lovci/Historie |
| Řád a společnost | Kaichi, řád a význam, detektor lži, zákony | Tajemství, Miasma |
| Lovci | Kasta, Ryōdan, trojice, divize, generace, tabu | Lovci |
| Akano3 | Škola, specializace, shidōsei, hodnocení, kruhy, ukončení | Akano3, Specializace, Mentoring, Ukončení studia, doc *Kruhy* |
| Monstra | Klasifikace, bestiář, miasma | Bestiář, Miasma, designák/Lov |
| Junkin | Látka, transmutace, těžba, rafinace, pečeti | Junkin a monstra |

Kosmologie (Cukujomi, Kaguja, dualita) **nedostává vlastní kategorii**. Je to
materiál Kaichi VII–VIII a žije jako utajené bloky uvnitř *Junkin* a
*Historie*. Prázdná kategorie by prozrazovala, že něco existuje.

### Pravidla gatingu

- `kaichiRequired > 0` se používá **jen** tam, kde by i samotný název článku byl
  prozrazením. Odhad 2–3 články z ~40.
- Všechno ostatní má `kaichiRequired: 0`; vrstvení řeší `:::kN` uvnitř textu.
- Důvod: skrytý článek znamená, že hráč neví, že mu něco chybí. Článek s
  černými pruhy znamená, že to ví — a to je motor.

### Formát článku

Šablona odpovídající rendereru (`components/shared/wiki-renderer.tsx`):

```
# Název

Odstavec s definicí. **Tučně** klíčový termín, *kurzívou* japonský přepis.

---

## Sekce

- odrážka
- odrážka

> Citace z doktríny nebo výpovědi

:::k3
Utajená vrstva.
:::
```

Renderer **neumí tabulky**. Kaichi škála i kódy monster se píší odrážkami.
Přidávat parser tabulek kvůli dvěma místům se nevyplatí.

## Změny v kódu

| Změna | Soubor | Rozsah |
|---|---|---|
| Parser do vlastního modulu + blok `:::reviseN` | `lib/wiki-blocks.ts` (nový), `components/shared/wiki-renderer.tsx` | ~90 ř. |
| Knihovna do učitelského dashboardu | `components/panels/wiki.tsx` (nový), `components/views/teacher-dashboard.tsx`, `components/views/student-dashboard.tsx` | ~120 ř. |
| Oprava kaichi úrovní (viz K4) | `lib/data.ts` | 11 ř. |
| Nový obsah | `app/api/admin/seed-wiki/route.ts` | přepis `ARTICLES` |

**Růže knihovnu už má** — `ruze-dashboard.tsx` renderuje `<StudentDashboard />`,
takže dostane všechno, co dostanou studenti. Přidávat se musí jen učitelům.

**Testování bez nové závislosti.** Node 24 umí `node --test` a nativní stripování
typů, takže `lib/wiki-blocks.test.mjs` může importovat `./wiki-blocks.ts` přímo.
Žádný vitest, žádný jest. `.mjs` není v `tsconfig.json` v `include`, takže
`next build` se ho nedotkne.

### `:::reviseN`

Vyšší úroveň prohlašuje nižší za neplatnou. Bez toho nejde napsat Kaichi VI
(„Návrat je lež"), což je navržená pointa hry.

Chování:
- Pod úrovní `N` se blok **nezobrazuje vůbec** — ani jako černé pruhy. Revize
  nesmí prozradit, že revize existuje.
- Nad úrovní `N` se zobrazí červeně orámovaný blok s hlavičkou
  `REVIZE · KAICHI <N>` a text bezprostředně předcházejícího `md` bloku se
  vykreslí přeškrtnutě.

```
Každý lovec má právo na jeden Návrat.   <- přeškrtnuté
┌─ REVIZE · KAICHI VI ────────────────┐
│ Výše uvedené je dezinformační       │
│ opatření. Návrat neexistuje.        │
└─────────────────────────────────────┘
```

Odlišení od `:::kN`: `kN` **přidává** (a pod úrovní ukazuje černé pruhy),
`reviseN` **ruší** (a pod úrovní je neviditelný).

### Známé omezení

`POST /api/admin/seed-wiki` provádí `DELETE FROM wiki_articles` před vložením.
Přeseedování zahodí veškeré úpravy provedené GM přes wiki-admin panel. Zatím
přijatelné — obsah se píše v repu, admin panel slouží k opravám během hry.
Před ostrým během neseedovat.

## Inventář článků

Celkem ~40. Rozdělení do fází níže.

**Svět** — Shin Junkin · Jižní provincie, Nové pásmo, Okraj · Ostatní mocnosti ·
Původ

**Historie** — Svět před Zlatou generací · Zlatá generace (2031–2095) ·
Rozpad a Světová válka konce (2095–2101) · Ozvěna zkázy (2101–2111) ·
Putující světla (2111–2120) · Ustavení Shin Junkinu (2120–2143)

**Řád a společnost** — Systém Kaichi · Řád, význam a role · Detektor lži a
zkoušky loajality · Lovecký zákoník

**Lovci** — Lovci: kasta a privilegia · Ústřední lovecký řád · Pravidlo trojic ·
Generace lovců · Divize · Lovci a armáda · Rudý plášť a Jestřáb · Návrat

**Akano3** — Akano3: projekt · Akano1 a Akano2 · Specializace · Týmy a
jednotky · Shidōsei · Hodnocení · Kruhy (6 článků z docu *Kruhy*) · Ukončení
studia a akreditace

**Monstra** — Co jsou monstra · Klasifikace a kódy · Miasma · Bestiář:
lidožrouti · Bestiář: kaibyō · Bestiář: lišky · Bestiář: inugami · Bestiář:
shuten-dōji · Čichač

**Junkin** — Junkin: látka · Transmutace · Těžba a rafinace · Měsíc

### Umístění tajemství

| Kaichi | Nese článek |
|---|---|
| I | Svět před Zlatou generací; Lovci: kasta; Co jsou monstra |
| II | Světová válka konce; Ostatní mocnosti |
| III | Co jsou monstra; Řád, význam a role; Miasma (že je surovinou pro detektor lži) |
| IV | Návrat |
| V | Ukončení studia; Lovci: kasta |
| VI | Návrat (`:::revise6`); Miasma (rozkaz o konečném stupni nákazy) |
| VII | Řád, význam a role; Junkin: látka |
| VIII | Měsíc; Junkin: látka |

## Postup

**Fáze 0 — kánonový ledger.** `docs/kanon.md`: rozpor → rozhodnutí → které taby
v Google Docs opravit. Založit z tabulek výše. Bez něj se stejné rozpory budou
rozhodovat opakovaně a různě.

**Fáze 1 — svislý řez.** Tři články napříč celou škálou I–VIII:
`Systém Kaichi` (ověří škálu a hlas), `Lovci: kasta a privilegia` (nese trojice,
rodinu i odkaz na Návrat), `Miasma` (nejvíc herně používaná, ověří příručkový
režim). Plus `:::reviseN` v rendereru, protože článek `Návrat` se bez něj
nenapíše. Tady se ladí formát; teprve pak se sype zbytek.

**Fáze 2 — Kaichi I–III napříč všemi kategoriemi.** ~20 článků. Vrstva, kterou
reálně čte každá postava. Bez ní je knihovna prázdná i pro hráče s Kaichi IV.

**Fáze 3 — Kaichi IV–VIII.** Krátké bloky do už napsaných článků, ne nové
články.

**Fáze 4 — Bestiář.** Zvlášť: pět monster má ve zdroji jen nadpisy (kaligrafické
monstrum, inugami, čichač, dva bezejmenné). Bude potřeba obsah **dopsat**, ne
přeložit. Vyžaduje samostatné kolo rozhodnutí.

## Mimo rozsah

- Editace designového dokumentu.
- Hacking knihovny Růží (vidět nad svoje kaichi). Růže dostává jen běžný
  přístup podle svého kaichi.
- Podpora tabulek v rendereru.
- Opravy zdrojových Google Docs. Ledger je eviduje, ale zápis do docs je
  samostatné rozhodnutí.
