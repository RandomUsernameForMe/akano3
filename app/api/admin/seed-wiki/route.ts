import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

const ARTICLES = [
  // ─── ŘÁD A SPOLEČNOST ──────────────────────────────────────────────────────
  {
    slug: "system-kaichi",
    title: "Systém Kaichi",
    category: "Řád a společnost",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Systém Kaichi

**Kaichi** (階知, *úroveň poznání*) je formálně uznaná struktura pravdy. Určuje, jak hluboko jednotlivec rozumí skutečnému fungování světa a společnosti. Stát její existenci nepopírá ani neskrývá: poznání je zdroj a se zdroji se hospodaří.

---

## Stupně

- **Kaichi I** — 第一階知 *Dai Ichi Kaichi* — nárok dosažením 10 let
- **Kaichi II** — 第二階知 *Dai Ni Kaichi* — nárok dosažením 15 let
- **Kaichi III** — 第三階知 *Dai San Kaichi* — nárok dosažením 18 let
- **Kaichi IV** — 第四階知 *Dai Shi Kaichi* — mimořádná služba režimu
- **Kaichi V** — 第五階知 *Dai Go Kaichi* — dokončení Akademie
- **Kaichi VI** — 第六階知 *Dai Roku Kaichi* — vstup do důvěrných struktur: výzkum, velení, Lovci
- **Kaichi VII** — 第七階知 *Dai Nana Kaichi* — přijetí mezi strategické plánovače

První tři stupně jsou nárokové. Nikdo o ně nežádá a nikdo je neuděluje, přicházejí s věkem. Od čtvrtého stupně výše se Kaichi zasluhuje.

Přístup na stupeň zahrnuje všechny předchozí. Stupně lze přeskakovat.

---

## Závazky

Držitel Kaichi nesdílí obsah svého stupně s nikým, kdo ho nedosáhl. Slouží to k ochraně toho, kdo na danou pravdu není připraven.

Znalost se ověřuje. Zkoušky loajality probíhají pravidelně a jejich součástí je detektor lži.

> *Kdo unese pravdu, unese i její váhu.*

:::k7
Kaichi je nástroj stability, ne vzdělávání.

Člověk, který ztratí řád a smysl, se mění v monstrum. Pravda podaná dřív, než na ni má člověk strukturu, řád ničí a ničí tím i jeho. Stupňování poznání je jediná známá prevence.

Uspořádání společnosti, které mnozí považují za tvrdé, bylo zvoleno vědomě jako nejlepší dostupné řešení.

Sedmý stupeň je poslední, který tato databáze vede.
:::`,
  },

  // ─── LOVCI ─────────────────────────────────────────────────────────────────
  {
    slug: "lovci",
    title: "Lovci",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Lovci

**Lovci** (猟士, *Ryōshi*) jsou elitní kasta občanů Shin Junkinu. Jejich úkolem je vyhledávat a likvidovat monstra.

---

## Postavení

- Stojí nad běžným zákonem. Řídí se vlastními pravidly a soudí je jen jiní lovci.
- Mají doživotní rentu, menší i pro své blízké. Při smrti ve službě se zvyšuje.
- Mají nárok na vyšší stupně Kaichi, ne výlučně, ale službou.

Rudý plášť je symbol přísahy. Po smrti se vrací rodině jako relikvie.

---

## Řád

Lovce sdružuje **Ústřední lovecký řád** (中央猟士団, *Chūō Ryōshi-dan*), zkráceně **Ryōdan**. Uděluje licence, přiděluje mise a vede soud.

---

## Trojice

Lovci pracují výhradně po trojicích. Vycvičit jednoho lovce k plné samostatnosti trvá déle, než si obnovující se civilizace mohla dovolit.

:::k5
Trojice není doporučení. Bez kompletní trojice není akreditace.

Když se trojice rozpadne smrtí, zraněním nebo vyloučením, lovecká kariéra zbylých dvou zpravidla končí. Nabízí se přechod do armády, štábní role v Řádu, vzácně přidělení ke Stínům. Spojení dvou neúplných trojic je výjimka.
:::

---

## Závazky

Lovec nesmí mít trvalý partnerský vztah ani rodinu. Pravidlo vzniklo po případu Jestřába a od té doby se nezměnilo.

:::k5
Toto pravidlo nelze porušit.

Při ukončení Akademie podstupuje každý budoucí lovec zákrok, který mu trvale odebírá schopnost mít děti. Veřejnost i většina lovců to považuje za slib. Rozhodnutí padlo za ně a je nevratné.

Příběhy o lovcích, kteří se vrátili k milující rodině, jsou vyfabrikované.
:::`,
  },
  {
    slug: "navrat",
    title: "Návrat",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Návrat

Mezi lovci se hovoří o **Návratu**. Podrobnosti podléhají čtvrtému stupni poznání.

:::k4
Přeměna člověka v monstrum není nevratná. Existuje postup, jak monstru vrátit původní význam a s ním lidskou podobu.

Postup je náročný a nelze ho opakovat. Každý akreditovaný lovec má za celou službu **jeden Návrat**: jednou, kdykoli během kariéry, na kohokoli, bez zdůvodnění Řádu.

Většina lovců ho nepoužije nikdy. Někteří si ho schovávají pro konkrétního člověka. Rozhodnutí nikdo nepřezkoumává.
:::

:::revise6
Návrat neexistuje a nikdy neexistoval. Nebyl vyvinut, nebyl vyzkoušen a žádný lovec ho neuplatnil.

Informace o Návratu je řízené opatření schválené Nejvyšším koncilem. Slouží k tomu, aby lovec vydržel. Naděje na jediný možný zvrat udrží člověka ve službě tam, kde by jinak selhal, a udržela jich už mnoho.

Dozvídáš se to, protože jsi lovec. Ostatní tomu věří dál.
:::`,
  },

  // ─── MONSTRA ───────────────────────────────────────────────────────────────
  {
    slug: "miasma",
    title: "Miasma",
    category: "Monstra",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Miasma

**Miasma** je látka spojená s monstry. Chová se jako neviditelná mlha, ale nechová se jako plyn: nelze ji odvětrat, rozehnat ani zředit. Ničí tělo i mysl.

Každá lovecká výprava je povinně vybavena maskou a filtrem.

---

## Výskyt

- Některá monstra ji uvolňují neustále, jiná cíleně jako útok nebo zastrašení.
- Na místech dlouhodobého výskytu monster vznikají **zamořené zóny**. Vstup bez ochrany je smrtelný.
- Zóny jsou značené a značení se nepřekračuje.

---

## Stupně nákazy

1. **Bez projevu** — žádné příznaky
2. **Lehké** — občasné zakašlání, točení hlavy, nevyrovnaná nálada
3. **Střední** — trvalý kašel, malátnost, kolaps při zátěži, výbuchy vzteku a pláče. Nutná léčba.
4. **Těžké** — krvácení z očí a jiných otvorů, paranoia, extrémní nestabilita. Nezbytná intenzivní léčba.
5. **Konečné** — selhávání organismu, rozklad osobnosti a mysli

Nižší stupně odeznívají samy, pomalu a s odpočinkem. Vyšší ne.

---

## Manipulace

Sbírat a skladovat miasmu smějí výhradně státní instituce a Ústřední lovecký řád. Jakákoli jiná manipulace se stíhá jako příprava biologické zbraně.

:::k3
Miasma je surovinou detektoru lži. Neurotoxický účinek krátkodobě otupí mysl, subjekt se stane vnímavějším a méně schopným klamu. Jedna dávka odpovídá jedné otázce.

Detektor se proto nepoužívá plošně a nelze se jím denně ptát každého. Omezuje ho spotřeba.
:::

:::k6
Konečný stupeň nákazy nikoho nezabíjí. Organismus v něm vydrží týdny.

Zdravotnický personál má pro tento stav stálý rozkaz, který se nezapisuje do dokumentace a nepředává nikomu mimo strukturu. Pacient v konečném stupni se neléčí ani nepřeváží. Ukončuje se.

Důvodem není milosrdenství. Rozložená osobnost, která přestala držet svůj význam, je jeden z nejspolehlivějších zdrojů nových monster, a stane se to uvnitř zařízení, mezi lidmi.
:::`,
  },

  // ─── AKANO3 ────────────────────────────────────────────────────────────────
  {
    slug: "akano3-projekt",
    title: "Akano3",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Akano3

**Akano3** je specializovaná škola, která z civilistů cvičí lovce. Je to státní projekt s jedním cílem, jedním termínem a jednou generací.

---

## Proč nemá ročníky

Akano3 necvičí každý rok novou třídu, ale jednu generaci naráz, a poté skončí. Všichni studenti jsou proto v jednom ročníku a jsou různě staří, mezi nejmladším a nejstarším je až pět let rozdílu.

---

## Rozsah

V Shin Junkinu funguje několik desítek škol projektu Akano3 se stejnými osnovami, hodnocením i termíny.

Akano3 je hlavní cesta, jak se stát lovcem. Existují i jiné akreditované cesty, výrazně vzácnější.

---

## Co škola dělá

Tři věci v tomto pořadí:

1. **Rozpoznat monstrum.** Většina studentů, kteří zemřou, zemře proto, že nepoznali, proti čemu stojí.
2. **Porazit monstrum.** Každý druh má svůj způsob. Univerzální postup neexistuje a improvizace zabíjí.
3. **Vrátit se s tělem.** Mrtvé monstrum je surovina.

---

## Předchůdci

Akano3 je třetí projekt toho jména. **Akano1** a **Akano2** skončily obě pod útoky monster. Podrobnosti podléhají revizi a nejsou v této databázi dostupné.`,
  },
  {
    slug: "specializace",
    title: "Specializace",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Specializace

Tým je nejmenší jednotka organizovaného lovu. Má přesně tři členy, každého s jinou specializací. Kombinace všech tří pokrývá vše, co lov monstra vyžaduje.

:::karta 衝科 — Shōka, Odbor střetu
*Bojová specializace.*

**Úloha:** přímý střet s cílem, eliminační síla, ochrana týmu

**Zaměření:** fyzický boj, těžké zbraně, útočné manévry, odolnost

**Odpovědnost:** je první v kontaktu s monstrem a drží ho pod tlakem
:::

:::karta 策科 — Sakuka, Odbor strategie
*Taktická specializace.*

**Úloha:** navigace, velení, orientace v zóně

**Zaměření:** mapy, senzory, rozhodování, koordinace týmu

**Odpovědnost:** řídí misi, analyzuje situaci, stopuje monstrum, mění plán za pochodu
:::

:::karta 援科 — Enka, Odbor podpory
*Podpůrná specializace.*

**Úloha:** léčení, opravy, zásobování, transport těla monstra

**Zaměření:** medicínská péče, technická podpora, manipulace s monstry

**Odpovědnost:** zajišťuje, že se tým vrátí i s nákladem
:::

---

## Rozřazení a výuka

Specializace se přiděluje ve druhém roce studia po rozřazovacích zkouškách. Do té doby se od studenta očekává snaha ve všem.

Třídy jsou dělené podle specializací, ne podle týmů. Tři členové jednoho týmu spolu nechodí na hodiny a učí se rozdílné věci. V terénu se pak tým musí spolehnout na to, co ostatní dva vědí a on ne.

---

## Odbory jako identita

Odbory jsou silně kmenové. Mají vlastní znaky, pokřiky, části kostýmu a dlouhou historii vzájemné rivality. Soutěživost je tolerovaná a v rozumné míře podporovaná, za lov se však hodnotí tým, ne odbor.`,
  },
  {
    slug: "tymy-a-jednotky",
    title: "Týmy a jednotky",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Týmy a jednotky

## Tým

**Tým** je nejužší skupina, do které student patří. Má tři členy, každého s jinou specializací, a označuje se číslem.

Většina výcviku i hodnocení probíhá po týmech. Body získává tým, ne jednotlivec.

Tým je zároveň to, co ze studenta jednou udělá lovce. Akreditovaní lovci pracují výhradně po trojicích a trojice se skládá na Akademii.

---

## Jednotka

**Jednotka** je organizační celek složený ze dvou týmů. Podstupuje společně tréninkové i ostré mise.

Jednotka mívá kapitána, zástupce a další role podle svého zaměření. Obsazení těchto rolí je věcí jednotky, škola do něj zasahuje výjimečně.

---

## Proč zrovna tři

Vycvičit jednoho lovce k plné samostatnosti trvá roky a málokdo takový výcvik unese tělesně ani duševně. Obnovující se civilizace si na to nemohla počkat.

Tři lidé, z nichž každý umí něco jiného, zvládnou dohromady to, co jeden člověk sám nezvládne skoro nikdy.

:::k5
Pravidlo trojic není organizační doporučení. Bez kompletní trojice se akreditace neuděluje.

Skládání týmů na Akademii proto není cvičení. Je to výběr lidí, se kterými student stráví celou kariéru a bez kterých žádnou mít nebude.
:::`,
  },
  {
    slug: "shidosei",
    title: "Shidōsei — Přísaha vedení",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 4,
    content: `# Shidōsei

**Shidōsei** (指導誓, *Přísaha vedení*) je závazný vztah mezi dvěma osobami v rámci Akademie. Umožňuje individuální rozvoj, prověřuje disciplínu a připravuje studenta na fungování v hierarchické společnosti.

Stojí mimo běžný výukový rámec. Škola vztah registruje a dohlíží na jeho dodržování, ale nenařizuje ho ani neorganizuje.

---

## Role

- **Shidōsha** (指導者), *mentor*. Přebírá odpovědnost za vedení jiného studenta.
- **Deshi** (弟子), *učedník*. Skládá přísahu následovat mentora a čerpat z jeho zkušenosti.

Mentorem může být téměř kdokoli ve struktuře Akademie: student, instruktor, učitel. Vztah nezávisí na věku, třídě ani formální autoritě. Mladší může vést staršího.

---

## Pravidla

- Vzniká dobrovolně a formálně: veřejným slibem a vyvěšením na nástěnce.
- Je výhradní. Jeden mentor, jeden učedník. Nikdo nemůže být obojí zároveň.
- Trvá do rozvázání nebo do ukončení studia učedníka.
- Nesmí vzniknout mezi příbuznými.
- Nesmí vzniknout mezi partnery. Partnerství mezi mentorem a učedníkem je zakázáno a jeho zjištění ruší Shidōsei automaticky.

---

## Závazky

**Mentor** má nad učedníkem výcvikovou i morální autoritu a odpovídá za jeho rozvoj a chování. Selhání učedníka se posuzuje i jako selhání mentora.

**Učedník** odpovídá za loajalitu a disciplínu. Porušení přísahy nebo opakované zpochybňování mentorovy autority je těžké selhání.

---

## Rozvázání

Rozvázat svazek bez následku může pouze mentor. Pro učedníka je to hanba ukazující na chybný úsudek, do oficiálního hodnocení se však nezapisuje.

Rozvázání ze strany učedníka je těžká hanba a promítá se do hodnocení jako neukázněnost a porušení závazku.

---

## Závěrečné hodnocení

Po dokončení studia podává mentor závěrečné hodnocení svého učedníka. Má vysokou váhu při posuzování, zda je student připraven stát se lovcem.

Mentor tím svým jménem ručí, že učedník bude dobrý lovec i dobrý člověk.`,
  },
  {
    slug: "hodnoceni",
    title: "Hodnocení",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 5,
    content: `# Hodnocení

Studium na Akanu je po celou dobu přísně bodově hodnoceno a výsledky jsou veřejné.

Je to informace, na kterou má nárok každý, kdo se jednou postaví vedle druhého proti monstru.

---

## Co se hodnotí

- splněné a nesplněné mise
- výuka a prokázané znalosti
- vztah Shidōsei: výsledky učedníka se promítají mentorovi
- služba nad rámec povinností
- kázeňské přestupky a nápravná opatření

---

## Kdo body uděluje

Učitelé a pověření členové personálu. Studenti mají navíc omezenou možnost ocenit jeden druhého. Tato možnost je záměrně malá a její zneužití je kázeňský přestupek.

---

## Kdo body dostává

Zpravidla **tým**, ne jednotlivec. Některá ocenění míří na jednotku nebo na zájmový kruh.

Vyniknout na úkor ostatních dvou se proto nevyplácí. Výsledek jednoho je výsledkem všech tří.

---

## K čemu to je

Konečné hodnocení rozhoduje o dokončení studia. Kdo má dostatečné hodnocení, školu splní.

O tom, kdo se stane lovcem, hodnocení samo nerozhoduje. Vstupuje do toho závěrečné hodnocení mentora, složení trojice a rozhodnutí Ústředního loveckého řádu.`,
  },
  {
    slug: "ukonceni-studia",
    title: "Ukončení studia",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 6,
    content: `# Ukončení studia

Studium končí pro celou generaci naráz. Nikdo neodchází dřív a nikdo nezůstává déle.

---

## Průběh

1. **Poslední zkouška** pro ty, jejichž hodnocení nestačí. Poslední příležitost splnit.
2. **Poslední nástup**, formální shromáždění celé školy.
3. **Zakončení studia**, slavnostní ceremoniál.
4. **Udělení Kaichi V** všem, kdo studium dokončili.
5. **Jmenování lovci** těm, kdo splnili podmínky Ústředního loveckého řádu.

---

## Poslední nástup

Součástí posledního nástupu je právo vznést obvinění a kdokoli může označit kohokoli. Obvinění se neprojednává řečmi ani svědectvím, ale ověřuje se přímo.

:::k3
Ověřuje se **Čichačem**, bytostí drženou ve sklepeních pod školou.

Čichač pozná, zda je někdo monstrum, a je to jediný spolehlivý způsob, jak to potvrdit. Nevidí a nikdy neopouští své prostory.

Existuje proto, že člověk se v monstrum změnit může. Neděje se to často ani náhodou, ale mezi lidmi to nejde poznat pohledem.
:::

---

## Možné osudy

- **Nedokončit Akademii.** Naprosté minimum případů.
- **Dokončit a nestát se lovcem.** Nabízí se armáda. Oproti samostatnosti a úctě se z člověka stává šroub.
- **Dokončit, stát se lovcem, získat akreditaci.** Cíl, kvůli kterému škola existuje.

Stát se lovcem nezáleží jen na výkonu, ale i na tom, jestli má student kompletní trojici.

:::k5
Bez kompletní trojice se akreditace neuděluje. Kdo přijde o člena a nenajde náhradu, lovcem se nestane, i kdyby byl nejlepší ve své generaci.

Náhrada se hledá výjimečně a spojení dvou neúplných trojic je vzácnost, ne postup.
:::`,
  },

  // ─── MONSTRA ───────────────────────────────────────────────────────────────
  {
    slug: "co-jsou-monstra",
    title: "Co jsou monstra",
    category: "Monstra",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Co jsou monstra

**Monstra** (鬼, *Oni*) se objevila všude, kde se lidstvo po Ozvěně zkázy pokusilo znovu něco postavit. Nejsou to zvířata ani nemoc. Jejich jediný trvalý rys je, že ničí to, co má smysl, tedy především lidi a lidskou práci.

---

## Co mají společného

Liší se tvarem, silou, inteligencí i způsobem útoku. Některá vypadají jako zvířata, jiná jako lidé, některá nevypadají jako nic.

Společné mají tři věci:

- Objevují se tam, kde se buduje, ne v pustině.
- Míří na význam, ne na kořist. Zabíjejí i tam, kde nemají co získat.
- Po zabití zůstane v jejich těle **junkin**.

---

## Odkud se berou

Vznikají jako protiváha. Kdykoli je něčemu rychle a násilně přiřazen nový význam, objeví se vedle toho síla, která ten význam rozbíjí.

Přehradíš potok a uděláš rybník. Rybník má smysl: napájí, živí, slouží. A brzy se u něj začne topit lidi něco, co tam dřív nebylo.

Odtud regulace manipulace s junkinem. Každý zásah do světa má cenu a platí ji někdo jiný než ten, kdo zasáhl.

:::k3
Monstra vznikají i z lidí.

Člověk, který ztratí svůj význam, tedy místo, roli a důvod vstávat, se může změnit v monstrum. Neděje se to každému ani hned, ale děje se to.

Proti proměně neexistuje očkování ani test. Pohledem to nejde poznat a proměněný o sobě zpravidla neví, dokud proměna neskončí.
:::

:::k7
Junkin potřebuje význam, aby držel tvar. Člověk má dva zdroje významu.

**Ikigai** je vlastní, vnitřní, nalezený smysl bytí. Je spolehlivější, ale najde si ho málokdo a ztrácí se snadno.

**Řád** je role přidělená společností. Drží slabším způsobem, zato ho lze zajistit každému bez ohledu na to, jestli si ho zaslouží.

Shin Junkin proto vynucuje řád jako prevenci. Člověk bez místa v systému se může proměnit, a proměna neproběhne o samotě v poli, ale mezi ostatními.
:::`,
  },
  {
    slug: "klasifikace-monster",
    title: "Klasifikace a kódy",
    category: "Monstra",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Klasifikace a kódy

Monstra mají lidové názvy a **režimní kód**. Lidový název řekne, na co se díváš. Kód řekne, co s tebou udělá.

Kód se skládá z pěti údajů a identifikačního znaku.

---

## Typ

Podle způsobu útoku na lidi.

- **F** — fyzický: hrubou silou
- **P** — psychický: klamem, lstí, iluzemi
- **Z** — zvláštní: jinak

## Síla — S1 až S10

Čistě fyzická nebezpečnost. Člověk je klasifikován jako **S4**. Od trojice akreditovaných lovců se očekává, že porazí **S8**, trojici studentů se posílá nanejvýš proti **S6**.

## Inteligence — I1 až I10

Schopnost dedukce, řeči, učení a používání nástrojů. Člověk se považuje za **I8**. Monstrum s vyšší inteligencí přechytračí lovce dřív, než se dostane k boji.

## Speciální vlastnost

Písmeno, kterým se předává to nejdůležitější.

- **T** — toxické, šíří nebo využívá miasmu. Maska není doporučení.
- **X** — mnoho o něm nevíme

## Nebezpečnost — N1 až N10

Souhrnné hodnocení zahrnující všechny předchozí údaje. Odhaduje pravděpodobnost, že tě to zabije.

## Identifikační znak

Písmeno abecedy. Rozlišuje monstra se shodným kódem.

---

## Jak se to čte

Údaje se skládají za sebe. Neznámý údaj se zapisuje malým **x**.

- \`FS7I5N4O\` — lidožrouti
- \`FS9I8N8O\` — pán lidožroutů
- \`PS3I8N7K\` — lišky
- \`ZS2I6N5N\` — kočky
- \`ZS6I8TN6I\` — psí duch
- \`ZS2I7TN3C\` — čichač

V řeči se celý kód nepoužívá. Stačí poslední tři až čtyři znaky, tedy speciální vlastnost, nebezpečnost a identifikační znak: *N4O* jsou lidožrouti, *TN3C* je čichač, *N7K* jsou lišky.

Síla a inteligence slouží k plánování. Zbytek potřebuješ znát v běhu.`,
  },

  // ─── JUNKIN ────────────────────────────────────────────────────────────────
  {
    slug: "junkin",
    title: "Junkin",
    category: "Junkin",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Junkin

**Junkin** (純金, *čisté zlato*) je látka, na které stála Zlatá generace a na které dodnes stojí veškerá technologie Shin Junkinu: energie, výroba potravin, medicína, zbraně, filtry.

Veřejně známé je o něm trojí:

- **Těžil se na Měsíci.** Přístup k té těžbě lidstvo ztratilo.
- **Mění hmotu.** Promění věc v jinou věc bez práce a bez času. Postup se nazývá **transmutace**.
- **Je ho málo.** Junkin se nekupuje, přiděluje se. Manipulace vyžaduje povolení, neoprávněné nakládání se trestá.

Ostatní údaje o junkinu podléhají stupňům poznání.

:::k3
Měsíc už není zdroj. Zdrojem jsou **monstra**.

V těle každého zabitého monstra zůstane stopové množství junkinu. Je to jediný způsob, jak dnes lidstvo surovinu získává, a důvod, proč je lov organizovaný, financovaný a povinný.
:::

:::k4
Junkin má dva stavy.

**Surový** je hmota podobná hornině. Je nestabilní a bez zásahu člověka tvoří v okolí monstra. Neuhlídaný nález se hlásí jako mimořádná událost a řeší se stejným postupem jako výskyt monstra.

**Rafinovaný** hmota není. Rituálním pečetěním se stabilizuje a teprve pak s ním lze pracovat.

Mezi nálezem a zapečetěním je vždy okno, ve kterém se surovina chová jako hrozba. Zkrátit ho na nulu se dosud nepodařilo.
:::`,
  },

  // ─── AKANO3: kruhy ─────────────────────────────────────────────────────────
  {
    slug: "kruhy",
    title: "Zájmové kruhy",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 7,
    content: `# Zájmové kruhy

**Kruh** je zájmová skupina pěti studentů. Není omezená příslušností k jednotce, týmu ani specializaci: v jednom kruhu se běžně potkají lidé, kteří spolu jinak nemají nic společného.

Kruh vede dospělý mentor. Účast je dobrovolná, ale očekává se.

---

## Kuchi-Kuchi (くちくち)

*J-popová kapela. Pouze dívčí obsazení.*

Pět dívek ve třpytivých kostýmech. Jejich obrázek má doma každé malé dítě a za obdiv k nim se nestydí ani dospělí.

J-pop je v Shin Junkinu řízen na státní úrovni jako nástroj na zvedání morálky a šíření správných postojů. Kuchi-Kuchi to neskrývají.

## Kaligrafie

> **PÍSMO JE ŘÁD.**

Kruh se učí kaligrafii jako disciplínu, ne jako umění. Správně provedený znak drží řád a chrání před monstry, špatně provedený je přitahuje.

Odtud pravidlo opakované od první hodiny: psát cizí jména je studentům zakázáno. Jména mají moc a začátečník ji neuhlídá.

## Vědecký kruh

*Mentor: Ibuki.*

Založen s cílem obnovit nebo napodobit ztracenou technologii Zlaté generace. Svět je plný strojů, které nikdo neumí vyrobit, používat ani nakrmit, protože všechny stály na junkinu.

Kruh je nejdisciplinovanější ze všech. Nastupuje se, hlásí se reporty a Ibuki vyžaduje víc, než je nutné.

## Literární kruh

*Mentor: Nakamura, školní Pečující.*

Čte a píše. Hodně se mluví, píší se haiku, probírají se stará vyprávění, zejména příběh princezny Kaguji o Měsíci, smutku, opuštění a oběti.

## Sportovní kruh

**赤野笑狐団**, *Akano Shōko-dan*, Smějící se lišky z Akana.

Duely. Bokken, pásky přes čelo, přesná pravidla a hodně obřadnosti. Nejde o výkon, ale o souboj, o svědky a o to, kdo z něj vyjde jak.

## Rituální kruh

Provádí rituály sloužící společnosti při svátcích, zahájeních a rozloučeních. Má vlastní obřadní úbory a vlastní hierarchii v čele s **hlavním rituálníkem**, kterého si volí.

:::k6
Obřady pro společnost platí, ale nejsou to celé.

Rituální kruh se učí **transmutovat junkin**. Transmutace je rituál a tenhle kruh je jediné místo na Akademii, kde se ta dovednost předává.

Absolvent má otevřenou kariérní cestu, která nevede přes lovectví a o které se studentům neříká.
:::

---

## Oslava života

Kruhy vystupují v pořadí: Rituální, Vědecký, Kaligrafický, Kuchi-Kuchi. Po vystoupeních následuje volná zábava. Nevystupují všechny kruhy, ale všechny mají večerní program.`,
  },
  {
    slug: "transmutace",
    title: "Transmutace",
    category: "Junkin",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Transmutace

**Transmutace** promění věc v jinou věc bez práce, bez nástrojů a bez času. Ze dřeva ptačí budku. Je to jediná schopnost, kvůli které byla Zlatá generace možná, a jediný důvod, proč se junkin kdy těžil.

---

## Střežená dovednost

Postup transmutace je klasifikovaný. Neučí se: ani na Akademii, ani jinde, kam se student dostane. Provádět ji smí pouze držitel oprávnění a těch je málo.

Zájem o postup se eviduje.

:::k6
Transmutace není technický úkon, ale **rituál**: přesné pohyby, přesné pořadí, přesné odříkání. Provedený zpola není proveden.

Proto ji nelze zautomatizovat a proto je transmutérů málo. Vzácní nejsou kvůli surovině, ale proto, že se to musí umět.

Na Akademii tu dovednost předává **Rituální kruh**. Navenek provádí obřady pro společnost. To platí a je to jen část pravdy.

**Význam** je to, co drží junkin ve tvaru. Vzniká normálně a pomalu: čajovým obřadem, otevřením obchodu, domem, do kterého se někdo nastěhuje. Takovému ději se říká rituál a probíhá po celou historii sám. Transmutace je totéž provedené naráz.

**Pečeť** drží surový junkin stabilizovaný a použitelný. Je slabá a nezkušenému uživateli povolí. Junkin se pak vrátí do surového stavu uvnitř toho, kdo ho nesl, a udělá z něj monstrum.

Odtud přísnost předpisů. Amatér s junkinem není nebezpečný sobě.
:::

:::k7
Význam nelze vytvořit z ničeho. Když někde vznikne, jinde vznikne jeho opak.

Přirozený rituál je pomalý, takže protiváha zůstává malá a rozptýlená: kolem vodopádu, který se tvoří tisíc let, se časem objeví něco, co k němu chodí topit lidi. Průmyslová transmutace je okamžitá a obrovská. Stejně velká je i její stopa.

**Monstra nejsou nepřítel zvenčí. Jsou to odpad naší vlastní výroby.**

Svět nebyl nejdřív plný zázraků a potom plný monster proto, že by se změnil svět. Změnilo se, jak rychle do něj lidé sahali. Každý zázrak měl svůj stín a ten se někde zhmotnil.

Shin Junkin to ví a pokračuje v tom. Alternativou je zastavit se, což znamená zemřít pomaleji.
:::`,
  },
  {
    slug: "tezba-a-rafinace",
    title: "Těžba a rafinace",
    category: "Junkin",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Těžba a rafinace

## Měsíční těžba

Za Zlaté generace se junkin těžil na odvrácené straně Měsíce v objemech, které dnes nejdou popsat. Nikdo nehladověl, nikdo nestonal, jedenáct miliard lidí žilo lépe než dnes žije kdokoli.

Ta těžba je pryč a její obnova je hlavním deklarovaným cílem státu.

Junkinu je v současnosti extrémně málo. Využívá se proto výhradně na projekty a cíle, které stát označí za zásadní.

---

## Nové zdroje

:::k3
Jedním ze současných zdrojů junkinu jsou **monstra**. V těle zabitého monstra zůstane stopové množství suroviny, a proto se monstra loví.

Součástí školních misí někdy bývá i dotáhnout tělo zpět, nejen zabít.

Kvóta Ústředního loveckého řádu se odvozuje od toho, kolik suroviny lovci přinesou. Systém je uzavřený: lovci si na vybavení vydělávají tím, co ulovili. Čím horší rok, tím horší vybavení a tím horší další rok.

Rozebírat monstrum v terénu je zakázáno, protože surový junkin si bez pečeti najde v okolí tvar.
:::

---

## Rafinace

:::k6
Rafinace probíhá rituálním pečetěním: soustavou pečetí a bariér zvaných **Kekkai**, které surovinu stabilizují a uzavřou do nosiče.

Veřejnost si pod nosičem představuje stroj. Stroje se používají také.

Většina rafinovaného junkinu v Shin Junkinu je ale zapečetěna do lidí. Nosič je člověk, který junkin drží ve svém těle a transmutuje jím tak dlouho, dokud pečeť vydrží.

Je to placená a dobrovolná práce. Nosiči nemají odznak ani titul a v evidenci jsou vedeni pod povoláním, které dělali předtím. Kolik jich je, databáze neuvádí.
:::`,
  },

  // ─── HISTORIE ──────────────────────────────────────────────────────────────
  {
    slug: "svet-pred-zlatou-generaci",
    title: "Svět před Zlatou generací",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Svět před Zlatou generací

Před rokem 2031 vypadal svět jinak, než si dnes kdokoli mladší padesáti let dokáže představit.

---

## Co tu bylo

Osm miliard lidí a stovky států. Zemědělská půda, na které rostlo jídlo ze země. Města bez hradeb, cesty bez doprovodu, moře splavná bez ozbrojené eskorty.

Lidé se dožívali osmdesáti let a považovali to za málo.

---

## Monstra

Byla i tehdy, ale výrazně slabší, a lidstvo mělo dost prostředků, aby si s nimi poradilo.

Existovaly armádní jednotky určené k ochraně obyvatelstva, běžný člověk však na monstrum za celý život nenarazil. Většina lidí je považovala za pověru nebo za pohraniční problém.

Ke konci období se začaly objevovat obavy, že jich přibývá. Braly se jako přehnané.

---

## Co si z toho vzít

Je to jediné období lidských dějin, kdy lidstvo nežilo v ohrožení a nevědělo o tom. Nedokázalo si toho vážit a nedokázalo to udržet, protože mu nikdo neřekl, jakou cenu má řád, dokud ho mělo.`,
  },
  {
    slug: "zlata-generace",
    title: "Zlatá generace (2031–2095)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Zlatá generace

**黄金世代**, *Kogane Sedai*. Roky 2031 až 2095.

---

## 2031

Japonská národní společnost **豪華世界 (Gōkasekai), Luxusní svět** se dostává na odvrácenou stranu Měsíce a začíná tam těžit **純金 (Junkin), čisté zlato**.

Považuje to za znamení a sebe znovu za vyvolený národ. Zbytek světa to bere jako nesmysl, který je nutné tolerovat, protože junkin funguje.

Funguje na všechno: levná energie, zvrácené ekologické škody, zpracování jídla a vody v jakémkoli množství. Těžbu a zpracování provázejí masivní rituály.

---

## Co to udělalo

Lidstvo odstranilo hlad, nemoci i chudobu. Jedenáct miliard lidí žilo krásný život. Většina měla kde bydlet, co jíst, a neposlouchala varovné hlasy.

---

## 2095

Na Zemi žije dvacet pět miliard lidí, nejen díky porodnosti, ale hlavně díky extrémnímu prodloužení života.

- Zemědělská půda byla zrušena, potraviny se vyrábějí laboratorně.
- Většina mořských ploch je zastavěná.
- Volná příroda existuje jen v rezervacích.
- Koncept států byl opuštěn, lidstvo funguje jako jediná civilizační entita.

O rezervacích kolují historky o podivných tvorech a duších. Většina lidstva je považuje za moderní verzi pověsti o Bigfootovi. Přesto vzniká vládní program na odstraňování nelidských hrozeb.

---

## Varování

Vědci upozorňují, že junkin není obnovitelný a vývoj je neudržitelný. Podrobnější výzkum odhaluje jeho stinnou stránku: manipulace s junkinem urychluje vznik monster.

Odpadní látky ze zpracování jsou těkavé a toxické. Světová vláda rozhodla ukládat je do extrémně hlubokých vrtů. Část vědecké obce protestovala kvůli neznámým dlouhodobým dopadům a byla umlčena masivně sponzorovanou studií.

Spekulovalo se, že výsledky ovlivnil lobbying těžařské společnosti Gōkasekai. Prokázáno to nebylo.`,
  },
  {
    slug: "rozpad-a-valka",
    title: "Rozpad a Světová válka konce (2095–2101)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Rozpad a Světová válka konce

## Rozpad (2095–2100)

Těžba junkinu začíná váznout a je zřejmé, že ho ubývá. Na Měsíci propukají první boje mezi korporacemi o ložiska.

Roztříštěnost zájmů oslabí systém ochrany před monstry a objevují se první vážné útoky a masakry.

Společenské rozdíly, které byly v blahobytu neviditelné, se vyostří. Vyšší vrstvy hromadí junkin, na nižší se nedostává, přitom všechny technologie jsou na junkin stavěné.

Propuká hladomor a s ním nepokoje. Svět se během pěti let rozdělí na „my" a „oni". Frakce bojují proti sobě a umírají miliony.

---

## Válka (2100–2101)

**終焉世界大戦**, *Shūen Sekai Taisen*, Světová válka konce.

Trvala něco přes rok. Bojovalo se výhradně mezi lidmi. Proti monstrům v té době nebojoval nikdo, protože nikdo neměl kapacitu.

V roce 2101 sáhla jedna ze stran po konečném řešení a použila celý svůj atomový arzenál.

---

## Proč se tím rozbil svět

Exploze zasáhly rozsáhlá úložiště junkinového odpadu v hlubokých vrtech. To spustilo řetězovou reakci v zemské kůře a tektonické desky se daly do pohybu.

Válka tím fakticky skončila. Ne proto, že by někdo zvítězil, ale proto, že přestalo být kde a s kým bojovat.

:::k2
Ta strana jsme byli my.

Údery vypustili předchůdci Shin Junkinu. Pustina za mořem, kterou dnes nazýváme Okrajem a která je neobyvatelná dodnes, je taková proto, že jsme ji takovou udělali.

Odhady mrtvých se pohybují v miliardách a rozlišit oběti úderu od obětí toho, co následovalo, není možné.

Nemluví se o tom nahlas ani rádo, ale nezakrývá se to. Kdo dosáhl druhého stupně poznání, unese i tohle:

**Udělali jsme to. Bylo to nutné. Kdybychom to neudělali, nebyl by tu dnes nikdo, kdo by se ptal.**
:::`,
  },
  {
    slug: "ozvena-zkazy",
    title: "Ozvěna zkázy (2101–2111)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 4,
    content: `# Ozvěna zkázy

**亡響**, *Bōkyō*. Roky 2101 až 2111, během kterých se planeta přestavěla.

---

## Co se dělo

Tektonické desky se pohybovaly rychlostí, pro kterou geologie neměla slovo.

- Pohoří mizela a nová vznikala během týdnů.
- Pouště se měnily v moře a oceány vysychaly.
- Extrémní výkyvy počasí, zemětřesení, záplavy a cunami bez pauzy.

Umíraly miliardy, tentokrát ne ve válce, ale po ní.

---

## Jak se přežívalo

Elektronická komunikace nefungovala. Lidstvo se scvrklo na mrchožrouty a sběrače ve zbytcích rozbité civilizace.

Lidé žili v klanech a v **přesuvných populačních centrech**, sídlech, která se stěhovala, kdykoli se krajina změnila natolik, že se v ní nedalo zůstat.

---

## 2111

Pohyb desek se náhle zastavil a výkyvy počasí skončily. Svět vypadal úplně jinak, ale zdál se stejně obyvatelný jako dřív.

Odhaduje se, že přežila zhruba jedna miliarda lidí, podobný počet jako v polovině devatenáctého století.

---

## Co přišlo s tím

Svět se mohl začít stabilizovat. Místo toho se ukázalo, že všude, kde se lidé pokusili znovu něco postavit, se objevují **monstra**. Ne ojediněle, ale všude.

Tím okamžikem přestala být otázka, jestli lidstvo přežilo katastrofu, a začala otázka, jestli přežije to, co po ní zbylo.`,
  },
  {
    slug: "putujici-svetla",
    title: "Putující světla (2111–2120)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 5,
    content: `# Putující světla

**巡灯**, *Juntō*. Devět let mezi zastavením desek a ustavením Shin Junkinu, ve kterých vzniklo lovectví.

---

## Nultá generace

Ještě před válkou existovali lidé, kteří zabíjeli monstra profesionálně: vojáci zvláštních armádních složek. Tehdy se jim neříkalo lovci, ten název dostali zpětně.

Po zkáze se stali klíčovými pro přežití populačních center. Bylo jich málo a nikdo je nedokázal nahradit.

---

## První generace a kovenant

Ti, kdo po zkáze chodili světem a chránili lidi.

Nezůstávali v jednom centru. Přesouvali se mezi nimi, prorážali dopravní stezky a čistili nová místa, když bylo potřeba centrum přestěhovat. V kolektivní paměti zůstali jako postavy v šedivých cestovních pláštích, které přicházely ze tmy a zase do ní odcházely. Odtud jméno té doby.

Protože každé centrum mělo jiné zákony, vznikl **lovecký kovenant**, tři věty, na které město přistoupilo, když chtělo ochranu:

1. Lovec má povinnost zabíjet monstra a chránit lidi.
2. Lovec má dveře otevřené.
3. Lovce soudí jenom jiní lovci.

Kovenant formálně zanikl se vznikem státu. Lovci se na něj odkazují dodnes a berou ho vážněji než zákoník, který ho nahradil.

---

## Shidōsei a pravidlo trojic

Mladí lidé v populačních centrech skládali **Shidōsei**, přísahy vedení, vždy jeden učedník jednomu mentorovi. Když mentor rozhodl, stal se učedník čekatelem. Tak vznikla **druhá generace**.

Tehdy se zavedlo i **pravidlo trojic**. Vycvičit jednoho člověka k plné samostatnosti trvalo příliš dlouho a málokdo to unesl. Civilizace v troskách si nemohla dovolit čekat na nadlidi.

Jakmile se sešli tři čekatelé, posoudila se jejich vzájemná snesitelnost a stal se z nich tým. Mentor s nimi ještě nějakou dobu putoval, než jim udělil akreditaci.

---

## Jestřáb

**鷹**, *Taka*, lovec nulté generace.

Ve vesnické dívce nenašel jen učednici, ale i lásku. Jeho milovanou postihl příšerný osud a proměnila se v monstrum.

Taka odmítl naplnit kovenant a zabít ji. Když tu povinnost splnili jiní, postavil se svým bratrům a ve vzdoru se proměnil v monstrum i on. Než ho porazili, zmasakroval několik lovců a desítky civilistů.

Z toho dne pochází zákaz partnerského života a rodiny. Z počtu obětí pochází barva pláště: od té doby jsou rudé.`,
  },
  {
    slug: "ustaveni-shin-junkinu",
    title: "Ustavení Shin Junkinu (2120–2143)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 6,
    content: `# Ustavení Shin Junkinu

## 2120

**新純金 (Shin Junkin), Nový Junkin** vzniká jako federace populačních center, která sdílejí filozofii Zlaté generace: pokrok lidstva hnaný junkinem. Později se prohlásí velkostátem.

Shin Junkin odmítá tvrzení, že využívání junkinu byla chyba. Vinu klade na přílišnou individualizaci a sobectví, ne na látku samotnou. Cílem je obnovit přístup do vesmíru a k těžbě.

Základní princip: nikdo nemá hladovět, ale každý musí pracovat a dar junkinu nezneužívat.

---

## Rozdělení světa

Lidstvo se nedokázalo sjednotit. Zbyly tři velmoci:

- **Shin Junkin**, bývalé Japonsko a okolní souostroví
- **Konfederace**, pobřežní státy bývalé Ameriky spojené obrněnými vlaky přes zamořený kontinent. Hlavní protivník.
- **Pakt Europa**, izolacionisté, kteří tvrdě omezili užívání junkinu. Mají proto málo monster a zaostávají v technologii.

Vedle nich dvě menší mocnosti bez velmocenského postavení: **Meridián**, putovní národ plovoucích ostrovů a spojených lodí, a **Země obrody**, mikrostáty na jihu Afriky a Ameriky, které junkin odvrhly a snaží se s monstry žít v souladu.

---

## Lovecký řád

Se vznikem státu se lovectví institucionalizovalo a vznikl **Ústřední lovecký řád** (中央猟士団, *Chūō Ryōshi-dan*), zkráceně **Ryōdan**.

Lovecký kovenant formálně zanikl a nahradil ho **Lovecký zákoník**, komplexní soubor pravidel existence lovců ve státě.

Všichni, kdo se stali lovci po roce 2120, tvoří **druhou generaci**. Školy projektu Akano cvičí **třetí**.

---

## Nyní se píše rok 2143

Od atomového úderu uplynulo dvaačtyřicet let, od ustavení státu dvacet tři.

Nultá generace lovců, tedy ti, kdo pamatují svět před válkou, dnes buď nežije, nebo je jí přes pětašedesát. Za pár let nezůstane nikdo, kdo Zlatou generaci viděl na vlastní oči.`,
  },

  // ─── SVĚT ──────────────────────────────────────────────────────────────────
  {
    slug: "shin-junkin",
    title: "Shin Junkin",
    category: "Svět",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Shin Junkin

**新純金**, Nový Junkin. Velkostát, ve kterém žijeme.

---

## Území

Hlavní souostroví bývalého Japonska, obývané převážně **Místními**. Je místy zdevastované vlnami cunami a zemětřeseními, ale drží si části své historie a především památku Zlaté generace.

Je to nejlepší místo k životu, jaké v Oceánii je. Kdokoli odjinud sem chce a většina se sem nedostane.

---

## Co Shin Junkin tvrdí

Že junkin nebyl chyba.

Katastrofu podle státní doktríny nezpůsobila látka ani její těžba, ale přílišná individualizace a sobectví lidstva. Lidé si brali, nedávali a nikdo je nedržel v řádu.

Z toho plynou dvě věty, které zazní při každé oficiální příležitosti:

> *Nikdo nemá hladovět. Každý musí pracovat a dar junkinu nezneužívat.*

Cílem státu je obnovit přístup do vesmíru a k těžbě. Všechno ostatní je prostředek.

---

## Sebevědomí

Shin Junkin je o své nadřazenosti a pravdě přesvědčen a považuje to za zjištěný fakt, ne za názor. Toto přesvědčení je oficiální a veřejné.

---

## Monstra

Shin Junkin považuje monstra za šintoistické bytosti, 鬼 (*Oni*) a jim podobné. Neodpovídají přesně příběhům, které se o nich po staletí vyprávěly, ale nikdo zde nepochybuje, že jde o totéž.

Je to jediné místo, kde stát připouští, že něčemu nerozumí zcela.`,
  },
  {
    slug: "regiony",
    title: "Jižní provincie, Nové pásmo, Okraj",
    category: "Svět",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Regiony Oceánie

Území pod vlivem Shin Junkinu, která nejsou Shin Junkin. Všechna tři dodávají suroviny, pracovní sílu a vojáky. Všechna tři dostávají ochranu a příděly.

:::karta Jižní provincie
Bývalé Filipíny, Tchaj-wan, Indonésie a Guinea.

Mikrostáty vojensky podrobené Shin Junkinu. Formálně mají vlastní správu, fakticky dodávají, co se po nich chce.

**Život:** snesitelný

**Postavení:** nízké
:::

:::karta Nové pásmo
Pásy ostrovů na východě, které vytvořil pohyb desek. Ještě před třiceti lety ležely na dně oceánu, takže tam není skoro žádná zeleň, život ani stabilní půda.

Je poseté sopkami, vulkanickými elektrárnami a doly. Jediné území obrácené k Pacifiku, za kterým leží **Konfederace**, a proto silně militarizované.

**Život:** tvrdý, průmyslový

**Postavení:** dělnické
:::

:::karta Okraj
Okraj bývalé Asie: Korea, Čína, Vietnam. Není to ucelené území, ale série pevností a bašt na rozbitém kontinentu.

Velké pevniny jsou poseté monstry a obyvatelné jen stěží. Na Čínu navíc ve válce dopadly nukleární zbraně a značná část Okraje je neobyvatelná dodnes.

**Život:** nebezpečný

**Postavení:** sloužit zde je trest i vyznamenání
:::

---

Zda je ta výměna spravedlivá, není otázka, která by se veřejně kladla.`,
  },
  {
    slug: "ostatni-mocnosti",
    title: "Ostatní mocnosti",
    category: "Svět",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Ostatní mocnosti

Po válce zbyly tři velmoci. Vedle nich existují dvě menší mocnosti bez velmocenského postavení.

:::karta Konfederace
*Velmoc. Hlavní protivník Shin Junkinu.*

Několik pobřežních států bývalé Ameriky, propojených obrněnými vlaky, které projíždějí vybombardovaným a monstry zaplněným vnitrozemím.

Stojí na individualismu, tedy na přesvědčení, že jednotlivec je víc než celek. Z pohledu Shin Junkinu je to přesně ta chyba, která svět zabila, zopakovaná znovu a vědomě.
:::

:::karta Pakt Europa
*Velmoc. Izolacionisté.*

Odstřihli se od světa a velmi přísně omezili užívání junkinu. Monstra u nich proto skoro nejsou, zaplatili za to však technologickým zaostáváním, které dohnat nedokážou.
:::

:::karta Meridián
*Menší mocnost. Bez území.*

Putovní národ. Plovoucí ostrovy a spojené lodě křižující Pacifik a Atlantik, živí se vytahováním technologií a paliva ze strojů na dně oceánů.

Pokusili se usadit v Austrálii. Shin Junkin je zničil, protože to bylo příliš blízko. Meridián přijímá uprchlíky a vyhnance odkudkoli.
:::

:::karta Země obrody
*Menší mocnost. Mikrostáty.*

Na jihu Afriky a Ameriky. Junkin odvrhly úplně a snaží se s monstry žít v souladu.

Obyvatelé Shin Junkinu o nich buď nevědí, nebo se jejich naivitě smějí.
:::

---

## Kde je kdo

V Paktu Europa, Konfederaci a Zemích obrody žijí prakticky jen lidé **Cizího** původu. Meridián je jediné místo, kde se potkají všechny tři původy.`,
  },
  {
    slug: "puvod",
    title: "Původ",
    category: "Svět",
    kaichi_required: 0,
    sort_order: 4,
    content: `# Původ

Shin Junkin rozlišuje obyvatele podle **původu**, tedy podle toho, odkud pochází jejich rodina a jaký mají vztah ke státu. Rozlišení je oficiální, zapsané a nosí se viditelně.

---

## Místní

Pocházejí ze Shin Junkinu a žijí v něm. Cokoli dělají pro stát, dělají pro sebe. Jejich rodiny tu byly před válkou a budou tu po ní.

Místní častěji používají japonské názvy pro věci: většina prvků světa má vedle běžného označení i vznešenější japonské. Kaichi. Shidōsei. Ryōdan. Je to zvyk, ne předpis, a je poznat.

Častěji se také odkazují na dobu před válkou, na Zlatou generaci a na Japonsko.

---

## Vedlejší

Pocházejí odjinud z Oceánie: z Jižních provincií, Nového pásma nebo Okraje.

Co dělají pro stát, dělají spíš pro ty, kdo si žijí v bohatství a bezpečí v Shin Junkinu. Sami z toho blahobytu dostávají výrazně méně.

Geneticky ani vzhledem je od Místních rozlišit nejde. Za Zlaté generace se lidstvo promíchalo natolik, že barva ani rysy dnes o původu neříkají nic. Rozdíl je ve skutečném původu a ve vztahu ke kraji.

---

## Cizí

Pocházejí z velkých pevnin, z Ameriky a z Evropy.

Hlavní rozdíl oproti předchozím dvěma: je to na nich vidět.

---

## Co to není

Toto rozdělení není rasové. Rasismus založený na barvě nebo tvaru zanikl se Zlatou generací, kdy se lidstvo promísilo tak, že přestal dávat smysl.

Vzniklo místo něj dělení podle toho, kde se člověk narodil. To je stále v platnosti, je součástí evidence a rozhoduje o tom, kam až se člověk dostane.`,
  },

  // ─── ŘÁD A SPOLEČNOST ──────────────────────────────────────────────────────
  {
    slug: "rad-vyznam-role",
    title: "Řád, význam a role",
    category: "Řád a společnost",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Řád, význam a role

Základní společenská doktrína Shin Junkinu. Vyučuje se od základní školy.

> *Každý má své místo. Místo je povinnost. Povinnost je ochrana.*

Řád se nechápe jako omezení svobody, ale jako to, co drží člověka pohromadě. Kdo ví, kam patří a co se od něj čeká, je v bezpečí. Kdo to neví, ohrožuje sebe i ostatní.

---

## Role

Každý má přidělenou nebo zvolenou roli: v rodině, v týmu, v jednotce, v odboru, v zaměstnání. Role je soubor konkrétních povinností, s jejichž splněním někdo jiný počítá.

Změnit roli lze, ale je to formální úkon. Nikdo v Shin Junkinu nezůstává mezi rolemi dlouho a stát to nedovolí.

---

## Proč se dbá na to, aby nikdo nezůstal bez místa

Ztráta role je víc než sociální problém.

Člověk, který přijde o práci, postavení a důvod vstávat, není ponechán osudu. Prázdné místo v řádu je nebezpečné pro okolí.

Systém podpory, přeřazení a nucené práce, který cizincům připadá tvrdý, existuje právě proto. Je opatřením proti tomu, co po pádu přichází.

---

## Ikigai

Doktrína uznává vedle vnějšího řádu i **ikigai** (生き甲斐), vlastní vnitřní důvod k existenci.

Ikigai se považuje za hodnotnější než přidělená role. Kdo ho má, nepotřebuje, aby ho držel někdo zvenčí.

Stát na něj přesto nespoléhá: najde si ho málokdo, drží nespolehlivě a ztrácí se snadno.`,
  },
  {
    slug: "detektor-lzi",
    title: "Detektor lži a zkoušky loajality",
    category: "Řád a společnost",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Detektor lži a zkoušky loajality

Systém Kaichi stojí na tom, že se poznání nešíří mimo svůj stupeň. Dodržování se ověřuje pravidelně u všech, kdo drží Kaichi IV a výše.

---

## Průběh zkoušky

1. Předvolání. Termín se neoznamuje dopředu.
2. Podání látky.
3. Otázky. Kladou se jednotlivě a odpovídá se okamžitě.
4. Zápis. Zapisuje se odpověď, ne průběh.

Zkoušku vede pověřená osoba, nikdy přímý nadřízený.

---

## Co detektor umí

Zajišťuje, že subjekt nemůže lhát. Neumí číst myšlenky, zjistit nepoloženou otázku ani odhalit, že si dotyčný odpověď předem sám pro sebe přeformuloval.

---

## Proč se nepoužívá častěji

Jedna dávka odpovídá jedné otázce a dávek je málo. Zkoušky se plánují, otázky se volí předem a promarněná otázka se nevrací.

:::k3
Látkou je **miasma**. Neurotoxický účinek krátkodobě otupí mysl a subjekt se stane vnímavějším a méně schopným klamu.

Každá zkouška je tedy zároveň dávkou jedu. Kdo chodí na zkoušky často, nese to na sobě.
:::

---

## Na Akanu

Studenti Akademie zkouškám běžně nepodléhají. Setkají se s nimi až jako lovci nebo při vstupu do struktur, kde se to vyžaduje. V odůvodněných případech lze zkoušku nařídit komukoli.`,
  },

  // ─── LOVCI ─────────────────────────────────────────────────────────────────
  {
    slug: "ryodan",
    title: "Ústřední lovecký řád",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Ústřední lovecký řád

**中央猟士団**, *Chūō Ryōshi-dan*. V běžné řeči **Ryōdan**.

---

## Co dělá

- Uděluje a odebírá **lovecké licence**
- Přiděluje **mise**
- Vede **soud** nad lovci

Soudní pravomoc plyne přímo z kovenantu: lovce soudí jenom jiní lovci. Zůstala v platnosti i poté, co kovenant nahradil Lovecký zákoník.

---

## Jak rozhoduje

Ryōdan funguje demokraticky a každý lovec má jeden hlas. Většinu rozhodnutí dělá volený **Nejvyšší koncil**, který zasedá stále.

Být lovcem je zároveň nejbližší postavení k občanským právům v jejich starém smyslu, jaké lze v Shin Junkinu získat.

---

## Ryōdan a stát

Ryōdan má monopol na lov monster. Je to jediná organizace ve státě, bez které se stát neobejde a kterou zároveň neřídí.

Stát si drží kontrolu třemi způsoby a nezakrývá to:

- **Rozpočet.** Lovci jsou závislí na státním financování rent i provozu.
- **Politický dohled.** Velké operace musí formálně schválit státní rada, často až zpětně. Rada má vyhrazená místa v koncilu.
- **Armáda.** Existuje mimo jiné proto, aby Ryōdan nebyl jedinou ozbrojenou silou s privilegii.

Napětí mezi řádem a státem je trvalé, oboustranně uznávané a záměrné.`,
  },
  {
    slug: "generace-lovcu",
    title: "Generace lovců",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 4,
    content: `# Generace lovců

Lovci se mezi sebou dělí podle toho, kdy se jimi stali. Je to neformální označení, které se nikde neeviduje a nemá vliv na postavení. Říká, jaký svět dotyčný zažil.

:::karta Nultá generace
Zabíječi monster z doby **před válkou**, vojáci zvláštních armádních složek. Tehdy se jim neříkalo lovci, ten název dostali zpětně.

Nedělili se na specializace a fungovali samostatně. Zažili Zlatou generaci a pamatují si ji.

**Dnes:** pětašedesát a víc, většina už nežije.
:::

:::karta První generace
Ti, kdo po zkáze chodili světem a chránili lidi. Postavy v šedivých cestovních pláštích, které přicházely mezi populační centra.

Vznikl s nimi lovecký kovenant. Válku si pamatují, dobu před ní ne: byli tehdy děti z rozbitých měst.

**Dnes:** padesát až sedmdesát.
:::

:::karta Druhá generace
Učedníci první generace přes Shidōsei a poté všichni, kdo se stali lovci po ustavení Shin Junkinu v roce 2120.

První generace, která lovectví nevynalezla, ale zdědila. Vyrostla v hotové instituci s licencemi, zákoníkem a rozpočtem.

**Dnes:** pětadvacet až padesát, tvoří většinu činných lovců.
:::

:::karta Třetí generace
Studenti projektu Akano.

První generace, která se lovcem nestává tím, že by ji někdo našel a vzal si ji k sobě, ale tím, že projde školou. Jak to lovectví změní, se teprve ukáže.

**Dnes:** patnáct až devatenáct.
:::`,
  },
  {
    slug: "divize-lovcu",
    title: "Divize",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 5,
    content: `# Divize

Ryōdan se dělí na divize podle toho, proti čemu jeho lovci stojí.

:::karta Lovci
Základní a nejpočetnější divize. Fyzická monstra, fyzický terén, fyzický střet.

**Pracují:** po trojicích

**Ví se o nich:** všechno
:::

:::karta Virtuální divize
Trojice specializované na informační prostor. Ne každé monstrum má tělo a ne každé se dá potkat na ulici.

**Pracují:** po trojicích, se stejným rozdělením rolí

**Ví se o nich:** že existují
:::

:::karta Stínová divize
Existence této divize není tajemstvím. Její náplň se veřejně nerozebírá.

**Pracují:** neuvedeno

**Ví se o nich:** jméno
:::

:::k6
Stínová divize slouží k eliminaci vnitřních hrozeb: lidí, neposlušných lovců a všeho, co je nutné vyřešit tiše a co nelze svěřit armádě ani soudu.

Přidělení ke Stínům je jednou z mála cest, které zůstávají lovci, jemuž se rozpadla trojice a který nechce do armády. Nenabízí se každému.

Lovec, který ke Stínům odejde, přestává být uveden v běžných seznamech.
:::`,
  },
  {
    slug: "lovci-a-armada",
    title: "Lovci a armáda",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 6,
    content: `# Lovci a armáda

## Kdo dělá co

**Armáda** zajišťuje hranice, pořádek a válku. Je početná, hierarchická a řídí ji stát.

**Lovci** čelí tomu, co armáda nezvládne: přímému střetu s monstry. Jsou vzácní, samostatní a řídí se sami.

---

## Odkud je napětí

Z privilegií. Lovec stojí nad běžným zákonem, má doživotní rentu a soudí ho jen jeho vlastní lidé. Voják nemá nic z toho a dělá práci, ve které se také umírá.

- Vojáci vidí v lovcích elitu a zároveň jim závidí postavení.
- Lovci považují armádu za nutnou, ale méněcennou sílu.

Střety mezi oběma složkami se dějí, nejčastěji proto, že na tutéž situaci platí dva různé zákony.

---

## K čemu to je dobré

Armáda je přiznaně tím, kdo drží lovce v mezích. Bez ní by byl Ryōdan jedinou ozbrojenou silou s výsadami, což stát nepřipustí.

Stát obě složky záměrně drží v rovnováze: podporuje spolupráci a zároveň využívá jejich rivalitu jako kontrolní mechanismus.

---

## Co to drží pohromadě

Lovci, kterým se rozpadla trojice, zpravidla odcházejí do armády. V armádě proto slouží nezanedbatelný počet bývalých lovců, kteří mají mezi lovci dál kamarády.

Právě oni drží vztah obou složek v mezích, ve kterých se dá pracovat.`,
  },
]

export async function POST() {
  try {
    await sql`DELETE FROM wiki_articles`
    for (const a of ARTICLES) {
      await sql`
        INSERT INTO wiki_articles (slug, title, category, kaichi_required, sort_order, content)
        VALUES (${a.slug}, ${a.title}, ${a.category}, ${a.kaichi_required}, ${a.sort_order}, ${a.content})
      `
    }
    return Response.json({ ok: true, inserted: ARTICLES.length })
  } catch (err) {
    console.error("[seed-wiki]", err)
    return new Response(String(err), { status: 500 })
  }
}
