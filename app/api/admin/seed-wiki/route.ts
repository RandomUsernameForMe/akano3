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

**Kaichi** (階知 — *úroveň poznání*) je formálně uznaná struktura pravdy. Určuje, jak hluboko jednotlivec rozumí skutečnému fungování světa a společnosti. Stát její existenci nepopírá ani neskrývá. Poznání je zdroj a se zdroji se hospodaří.

---

## Stupně

- **Kaichi I** — 第一階知 *Dai Ichi Kaichi* — nárok dosažením 10 let
- **Kaichi II** — 第二階知 *Dai Ni Kaichi* — nárok dosažením 15 let
- **Kaichi III** — 第三階知 *Dai San Kaichi* — nárok dosažením 18 let
- **Kaichi IV** — 第四階知 *Dai Shi Kaichi* — mimořádná služba režimu
- **Kaichi V** — 第五階知 *Dai Go Kaichi* — dokončení Akademie
- **Kaichi VI** — 第六階知 *Dai Roku Kaichi* — vstup do důvěrných struktur: výzkum, velení, Lovci
- **Kaichi VII** — 第七階知 *Dai Nana Kaichi* — přijetí mezi strategické plánovače

První tři stupně jsou nárokové. Nikdo o ně nežádá a nikdo je neuděluje — přicházejí s věkem, protože poznání má svůj čas. Od čtvrtého stupně výše se Kaichi zasluhuje.

Přístup na stupeň zahrnuje všechny předchozí. Stupně lze přeskakovat.

---

## Závazky

Každý stupeň přináší porozumění a s ním závazek. Držitel Kaichi nesdílí obsah svého stupně s nikým, kdo ho nedosáhl. Není to zákaz mluvení. Je to ochrana toho, kdo není připraven.

Znalost se ověřuje. Zkoušky loajality probíhají pravidelně a jejich součástí je detektor lži.

> *Kdo unese pravdu, unese i její váhu. Kdo ji neunese, ublíží sobě i druhým.*

:::k7
Kaichi není nástroj vzdělávání. Je to nástroj stability.

Člověk, který ztratí řád a smysl, se mění v monstrum. Pravda podaná dřív, než na ni má člověk strukturu, řád ničí — a ničí tím i člověka. Stupňování poznání proto není opatrnost ani mocenský nástroj. Je to jediná známá prevence.

Uspořádání společnosti, které mnozí považují za tvrdé, není omyl ani přežitek. Je to nejlepší dostupné řešení a bylo zvoleno vědomě.
:::

:::k8
Veřejně se uznává sedm stupňů. Osmý existuje a zní:

**Měsíc je tělo mrtvého monstra.** Junkin, na němž stojí celá civilizace, se těží z mrtvoly.
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

**Lovci** (猟士 — *Ryōshi*) jsou elitní kasta občanů Shin Junkinu. Jejich úkolem je vyhledávat a likvidovat monstra. Všechno ostatní z toho plyne.

---

## Postavení

- Stojí nad běžným zákonem. Řídí se vlastními pravidly a soudí je jen jiní lovci.
- Mají doživotní rentu, menší i pro své blízké. Při smrti ve službě se zvyšuje.
- Mají nárok na vyšší stupně Kaichi. Ne výlučně, ale službou.

Rudý plášť je symbol přísahy. Po smrti se vrací rodině jako relikvie.

---

## Řád

Lovce sdružuje **Ústřední lovecký řád** (中央猟士団 — *Chūō Ryōshi-dan*), zkráceně **Ryōdan**. Uděluje licence, přiděluje mise, vede soud.

Rozhoduje demokraticky — každý lovec má jeden hlas — ale běžná rozhodnutí dělá volený **Nejvyšší koncil**.

Ryōdan je samostatná mocenská instituce s monopolem na lov. Stát nad ním drží dohled rozpočtem, vyhrazenými místy v koncilu a existencí armády jako protiváhy. Napětí mezi řádem a státem je trvalé a je záměrné.

---

## Trojice

Lovci pracují výhradně po trojicích. Vycvičit jednoho lovce k plné samostatnosti trvá déle, než si obnovující se civilizace mohla dovolit. Trojice byla řešením.

:::k5
Trojice není doporučení. Bez kompletní trojice není akreditace.

Když se trojice rozpadne — smrtí, zraněním, vyloučením — lovecká kariéra zbylých dvou obvykle končí. Nabízí se přechod do armády, štábní role v Řádu, vzácně přidělení ke Stínům. Spojení dvou neúplných trojic je výjimka, ne pravidlo.
:::

---

## Závazky

Lovec nesmí mít trvalý partnerský vztah ani rodinu. Pravidlo vzniklo po případu Jestřába a od té doby se nezměnilo.

:::k5
Není to pravidlo, které by šlo porušit.

Při ukončení Akademie podstupuje každý budoucí lovec zákrok, který mu trvale odebírá schopnost mít děti. Veřejnost i většina lovců věří, že jde o závazek, o slib. Nejde. Rozhodnutí padlo za ně a je nevratné.

Příběhy o lovcích, kteří se vrátili k milující rodině, jsou vyfabrikované. Všechny.
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
Přeměna člověka v monstrum není nevratná. Existuje postup, jak monstru vrátit původní význam a s ním i lidskou podobu.

Postup je krajně náročný a nelze ho opakovat. Každý akreditovaný lovec má za celou svou službu **jeden Návrat**. Jednou, kdykoli během kariéry, na kohokoli, bez zdůvodnění Řádu.

Většina lovců ho nepoužije nikdy. Někteří si ho schovávají pro někoho konkrétního. Rozhodnutí je jejich a nikdo je nepřezkoumává.
:::

:::revise6
Návrat neexistuje. Nikdy neexistoval. Nebyl vyvinut, nebyl vyzkoušen a žádný lovec ho nikdy neuplatnil.

Informace o Návratu je řízené opatření schválené Nejvyšším koncilem. Slouží k tomu, aby lovec vydržel. Naděje na jediný možný zvrat udrží člověka ve službě tam, kde by jinak selhal — a udržela jich už mnoho.

Dozvídáš se to, protože jsi lovec. Ostatní tomu věří dál. Nech je.
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

**Miasma** je látka spojená s monstry. Chová se jako neviditelná mlha, ale nechová se jako plyn — nelze ji odvětrat, rozehnat ani zředit. Ničí tělo i mysl.

Každá lovecká výprava je povinně vybavena maskou a filtrem. Bez výjimky.

---

## Výskyt

- Některá monstra ji uvolňují neustále, jiná cíleně jako útok nebo zastrašení.
- Na místech dlouhodobého výskytu monster vznikají **zamořené zóny**. Vstup bez ochrany je smrtelný.
- Zóny jsou značené. Značení se nepřekračuje.

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
Miasma je surovinou detektoru lži.

Její neurotoxický účinek krátkodobě otupuje mysl. Subjekt je vnímavější a méně schopný klamu. Jedna dávka odpovídá jedné otázce.

Proto se detektor lži nepoužívá plošně a nelze se jím denně ptát každého. Není to opatrnost. Je to spotřeba.
:::

:::k6
Konečný stupeň nákazy nikoho nezabíjí. Organismus v něm vydrží týdny.

Zdravotnický personál má pro tento stav stálý rozkaz, který se nezapisuje do dokumentace a nepředává ústně nikomu mimo strukturu. Pacient v konečném stupni se neléčí ani nepřeváží. Ukončuje se.

Důvod není milosrdenství. Rozložená osobnost, která přestala držet svůj význam, je jeden z nejspolehlivějších zdrojů nových monster, jaké známe. A stane se to uvnitř zařízení, mezi lidmi.
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

**Akano3** je specializovaná škola, která z civilistů cvičí lovce. Není to škola v obvyklém smyslu. Je to státní projekt s jedním cílem, jedním termínem a jednou generací.

---

## Proč nemá ročníky

Akano3 necvičí každý rok novou třídu. Cvičí **jednu generaci naráz** a poté skončí. Proto jsou všichni studenti v jednom ročníku a proto jsou různě staří — mezi nejmladším a nejstarším je i pět let rozdílu.

Tenhle rozdíl je normální a nikdo ho neřeší. Věk není v Akanu měřítkem ničeho.

---

## Rozsah

V celém Shin Junkinu funguje **několik desítek** škol projektu Akano3. Tvoje škola je jednou z nich. Ostatní mají stejné osnovy, stejné hodnocení a stejné termíny.

Akano3 je v současnosti hlavní cesta, jak se stát lovcem — ne však jediná. Existují i jiné akreditované cesty, výrazně vzácnější.

---

## Co škola dělá

Tři věci, v tomto pořadí:

1. **Rozpoznat monstrum.** Většina studentů, kteří zemřou, zemře proto, že nepoznali, proti čemu stojí.
2. **Porazit monstrum.** Každý druh má svůj způsob. Neexistuje univerzální postup a improvizace zabíjí.
3. **Vrátit se s tělem.** Mrtvé monstrum je surovina. Výprava, která se vrátí bez něj, splnila jen půlku úkolu.

> *Lidstvo žije, protože zabíjíme monstra. Škola existuje, protože je potřeba, aby to někdo uměl.*

---

## Předchůdci

Akano3 je třetí projekt toho jména. **Akano1** a **Akano2** skončily oba pod útoky monster. Podrobnosti o obou podléhají revizi a nejsou v této databázi dostupné.`,
  },
  {
    slug: "specializace",
    title: "Specializace",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Specializace

Tým je nejmenší jednotka organizovaného lovu. Má **přesně tři členy** a každý z nich má jinou specializaci. Kombinace všech tří pokrývá všechno, co lov monstra vyžaduje.

---

## 衝科 — Shōka, Odbor střetu

*Bojová specializace.*

- **Úloha:** přímý střet s cílem, eliminační síla, ochrana týmu
- **Zaměření:** fyzický boj, těžké zbraně, útočné manévry, odolnost
- **Odpovědnost:** je první v kontaktu s monstrem a drží ho pod tlakem

---

## 策科 — Sakuka, Odbor strategie

*Taktická specializace.*

- **Úloha:** navigace, velení, orientace v zóně
- **Zaměření:** mapy, senzory, rozhodování, koordinace týmu
- **Odpovědnost:** řídí misi, analyzuje situaci, stopuje monstrum, mění plán za pochodu

---

## 援科 — Enka, Odbor podpory

*Podpůrná specializace.*

- **Úloha:** léčení, opravy, zásobování, transport těla monstra
- **Zaměření:** medicínská péče, technická podpora, manipulace s monstry
- **Odpovědnost:** zajišťuje, že se tým vrátí — a že se vrátí s nákladem

---

## Rozřazení a výuka

Specializace se přiděluje ve **druhém roce studia** po rozřazovacích zkouškách. Do té doby se od studenta očekává, že se bude snažit ve všem.

**Třídy jsou dělené podle specializací**, ne podle týmů. Znamená to, že tři členové jednoho týmu spolu nechodí na hodiny a učí se rozdílné věci. Je to záměr. V terénu se pak tým musí spolehnout na to, co ostatní dva vědí a on ne.

---

## Odbory jako identita

Odbory jsou silně kmenové. Mají vlastní znaky, pokřiky, části kostýmu a dlouhou historii vzájemné rivality. Soutěživost mezi nimi je tolerovaná a v rozumné míře podporovaná.

Za lov se ale hodnotí tým, ne odbor.`,
  },
  {
    slug: "tymy-a-jednotky",
    title: "Týmy a jednotky",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Týmy a jednotky

---

## Tým

**Tým** je nejužší skupina, do které student patří. Má tři členy, každého s jinou specializací, a označuje se číslem.

Většina výcviku i hodnocení probíhá po týmech. Body získává tým, ne jednotlivec.

Tým je zároveň to, co ze studenta jednou udělá lovce — nebo neudělá. Akreditovaní lovci pracují výhradně po trojicích a trojice se skládá na Akademii.

---

## Jednotka

**Jednotka** je organizační celek složený ze **dvou týmů**. Podstupuje společně tréninkové i ostré mise.

Jednotka mívá kapitána, zástupce a další role podle svého zaměření. Obsazení těchto rolí je věcí jednotky samotné; škola do něj zasahuje jen výjimečně.

---

## Proč zrovna tři

Vycvičit jednoho lovce k plné samostatnosti trvá roky a málokdo takový výcvik unese — tělesně ani duševně. Obnovující se civilizace si na to nemohla počkat.

Trojice byla řešení. Tři lidé, z nichž každý umí něco jiného, zvládnou dohromady to, co jeden člověk sám nezvládne skoro nikdy.

> *Sám nejsi lovec. Sám jsi jenom někdo, kdo běží proti monstru.*

:::k5
Pravidlo trojic není organizační doporučení. Bez kompletní trojice se akreditace neuděluje vůbec.

Skládání týmů na Akademii proto není cvičení. Je to výběr lidí, se kterými strávíš celou kariéru — a bez kterých žádnou mít nebudeš.
:::`,
  },
  {
    slug: "shidosei",
    title: "Shidōsei — Přísaha vedení",
    category: "Akano3",
    kaichi_required: 0,
    sort_order: 4,
    content: `# Shidōsei

**Shidōsei** (指導誓 — *Přísaha vedení*) je závazný vztah mezi dvěma osobami v rámci Akademie. Je to starý a uznávaný systém, který umožňuje individuální rozvoj, prověřuje disciplínu a připravuje studenta na fungování v hierarchické společnosti.

Stojí **mimo** běžný výukový rámec. Škola vztah registruje a dohlíží na jeho dodržování, ale nenařizuje ho ani neorganizuje.

---

## Role

- **Shidōsha** (指導者) — *mentor*. Přebírá odpovědnost za vedení jiného studenta.
- **Deshi** (弟子) — *učedník*. Skládá přísahu následovat mentora a čerpat z jeho zkušenosti.

Mentorem může být téměř kdokoli ve struktuře Akademie — student, instruktor, učitel. Vztah **není** závislý na věku, třídě ani formální autoritě. Mladší může vést staršího.

---

## Pravidla

- Vzniká dobrovolně a formálně: veřejným slibem a vyvěšením na nástěnce.
- Je výhradní. Jeden mentor, jeden učedník. Nikdo nemůže být obojí zároveň.
- Trvá do rozvázání nebo do ukončení studia učedníka.
- Nesmí vzniknout mezi příbuznými.
- Nesmí vzniknout mezi partnery a partnerství mezi mentorem a učedníkem je zakázáno. Jeho zjištění ruší Shidōsei automaticky.

---

## Závazky

**Mentor** má nad učedníkem výcvikovou i morální autoritu a odpovídá za jeho rozvoj a chování. Selhání učedníka se posuzuje i jako selhání mentora.

**Učedník** odpovídá za loajalitu a disciplínu. Porušení přísahy nebo opakované zpochybňování mentorovy autority je těžké selhání.

---

## Rozvázání

Rozvázat svazek **bez následku může pouze mentor**. Pro učedníka je to hanba — ukazuje to na jeho chybný úsudek — ale do oficiálního hodnocení se to nezapisuje.

Rozvázání ze strany učedníka je **těžká hanba** a promítá se do hodnocení jako neukázněnost a porušení závazku.

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

Studium na Akanu je po celou dobu **přísně bodově hodnoceno** a výsledky jsou **veřejné**.

To není trest ani nátlak. Je to informace, na kterou má nárok každý, kdo se jednou postaví vedle tebe proti monstru.

---

## Co se hodnotí

Body se udělují a odebírají za:

- splněné a nesplněné mise
- výuku a prokázané znalosti
- vztah Shidōsei — výsledky učedníka se promítají mentorovi
- službu nad rámec povinností
- kázeňské přestupky a nápravná opatření

---

## Kdo body uděluje

Učitelé a pověření členové personálu. Studenti mají navíc omezenou možnost ocenit jeden druhého — tato možnost je záměrně malá a její zneužití je kázeňský přestupek.

---

## Kdo body dostává

Zpravidla **tým**, ne jednotlivec. Některá ocenění míří na jednotku nebo na zájmový kruh.

Tohle je hlavní důvod, proč se v Akanu nevyplácí vyniknout na úkor ostatních dvou. Tvůj výsledek je jejich výsledek.

---

## K čemu to je

Konečné hodnocení rozhoduje o dokončení studia. Kdo má dostatečné hodnocení, školu splní.

Hodnocení samo o sobě **nerozhoduje** o tom, kdo se stane lovcem. Do toho vstupuje závěrečné hodnocení mentora, složení trojice a rozhodnutí Ústředního loveckého řádu.

> *Body neříkají, jak jsi dobrý. Říkají, jak jsi na tom teď.*`,
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

1. **Poslední zkouška** — pro ty, jejichž hodnocení nestačí. Poslední příležitost splnit.
2. **Poslední nástup** — formální shromáždění celé školy.
3. **Zakončení studia** — slavnostní ceremoniál.
4. **Udělení Kaichi V** — všem, kdo studium dokončili.
5. **Jmenování lovci** — jen těm, kdo splnili podmínky Ústředního loveckého řádu.

---

## Poslední nástup

Součástí posledního nástupu je právo **vznést obvinění**. Kdokoli může označit kohokoli.

Obvinění se neprojednává řečmi. Ověřuje se.

:::k3
Ověřuje se **Čichačem** — bytostí drženou ve sklepeních pod školou.

Čichač pozná, zda je někdo monstrum. Je to jediný spolehlivý způsob, jak to potvrdit. Nevidí a nikdy neopouští své prostory.

Existuje proto, že člověk se v monstrum změnit může. Nestává se to často a nestává se to náhodou, ale stává se to — a mezi lidmi to nejde poznat pohledem.
:::

---

## Možné osudy

- **Nedokončit Akademii.** Naprosté minimum případů.
- **Dokončit a nestát se lovcem.** Nabízí se armáda. Je to skoro opak lovectví: místo samostatnosti a úcty se z člověka stává šroub. Lovec je svoboda, voják je povinnost.
- **Dokončit, stát se lovcem, získat akreditaci.** Cíl, kvůli kterému škola existuje.

Stát se lovcem nezáleží jen na tobě. Záleží to i na tom, jestli máš kompletní trojici.

:::k5
Bez kompletní trojice se akreditace neuděluje. Kdo přijde o člena a nenajde náhradu, lovcem se nestane, i kdyby byl nejlepší ve své generaci.

Náhrada se přitom hledá jen výjimečně a spojení dvou neúplných trojic je vzácnost, ne postup.
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

**Monstra** (鬼 — *Oni*) se objevila všude, kde se lidstvo po Ozvěně zkázy pokusilo znovu něco postavit. Nejsou to zvířata a nejsou to nemoci. Jsou to bytosti, jejichž jediným trvalým rysem je, že **ničí to, co má smysl**.

Nejvíc tedy ničí lidi a lidskou práci.

---

## Co mají společného

Skoro nic. Liší se tvarem, silou, inteligencí i způsobem, jakým útočí. Některá vypadají jako zvířata, jiná jako lidé, některá nevypadají jako nic.

Společné mají tři věci:

- Objevují se tam, kde se něco buduje. Ne v pustině.
- Míří na význam, ne na kořist. Zabíjejí i tam, kde nemají co získat.
- Když je zabiješ, zůstane v jejich těle **junkin**.

To poslední je důvod, proč lidstvo přežilo. Monstra jsou dnes jediný dostupný zdroj suroviny, na které stojí celá civilizace.

> *Lidstvo žije, protože zabíjíme monstra. Není to metafora ani heslo. Je to popis.*

---

## Odkud se berou

Vznikají jako **protiváha**. Kdykoli je něčemu rychle a násilně přiřazen nový význam, objeví se vedle toho síla, která ten význam rozbíjí.

Přehradíš potok a uděláš rybník. Rybník má smysl: napájí, živí, slouží. A brzy poté se u něj začne topit lidi něco, co tam dřív nebylo.

Proto je manipulace s junkinem regulovaná. Nejde o opatrnost úřadů. Jde o to, že každý zásah do světa má cenu, a tu cenu platí někdo jiný než ten, kdo zasáhl.

:::k3
Monstra nevznikají jen ve světě kolem. Vznikají i z lidí.

Člověk, který ztratí svůj význam — místo, roli, důvod vstát ráno — se může změnit v monstrum. Nestává se to každému a nestává se to hned. Ale stává se to.

Není to nemoc a nedá se to očkovat. Nejde to poznat pohledem a proměněný o sobě zpravidla neví, dokud není hotová.
:::

:::k7
Tohle je celé jádro věci.

Junkin potřebuje význam, aby držel tvar. Člověk má dva zdroje významu: **ikigai** — vlastní, vnitřní, nalezený smysl bytí — a **řád**, tedy roli, kterou mu přidělí společnost.

Ikigai je spolehlivější, ale najde si ho málokdo a snadno se ztrácí. Řád je slabší, zato ho lze zajistit každému a nezávisí na tom, jestli si ho člověk zaslouží.

Shin Junkin proto nevynucuje řád z mocichtivosti. Vynucuje ho jako **prevenci**. Člověk bez místa v systému je člověk, který se může proměnit — a proměna se neděje o samotě v poli, ale mezi ostatními.

Tvrdost tohoto uspořádání není přehmat. Je to zvolená cena.
:::`,
  },
  {
    slug: "klasifikace-monster",
    title: "Klasifikace a kódy",
    category: "Monstra",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Klasifikace a kódy

Monstra mají lidové názvy a mají **režimní kód**. Lidový název řekne, na co se díváš. Kód řekne, co s tebou udělá.

Kód se skládá z pěti údajů a identifikačního znaku.

---

## Typ

Podle toho, **jak** útočí na lidi.

- **F** — fyzický: hrubou silou
- **P** — psychický: klamem, lstí, iluzemi
- **Z** — zvláštní: nějak jinak

---

## Síla — S1 až S10

Čistě fyzická nebezpečnost.

Člověk je klasifikován jako **S4**. Od trojice akreditovaných lovců se očekává, že porazí **S8**. Trojici studentů se posílá nanejvýš proti **S6**.

---

## Inteligence — I1 až I10

Schopnost dedukce, řeči, učení, používání nástrojů.

Člověk se považuje za **I8**. Monstrum s vyšší inteligencí než tvojí tě přechytračí. Počítej s tím dřív, než na něj sáhneš.

---

## Speciální vlastnost

Písmeno, kterým se předává to nejdůležitější.

- **T** — monstrum je toxické, šíří nebo využívá miasmu. Maska není doporučení.
- **X** — mnoho o něm nevíme

---

## Nebezpečnost — N1 až N10

Souhrnné hodnocení, které bere v úvahu všechno předchozí. Není to průměr. Je to odhad, jak pravděpodobně tě to zabije.

---

## Identifikační znak

Písmeno abecedy. Rozlišuje monstra, kterým vyšel stejný kód.

---

## Jak se to čte

Celý kód se skládá za sebe. Když některý údaj neznáme, píše se malé **x**.

- \`FS7I5N4O\` — lidožrouti
- \`FS9I8N8O\` — pán lidožroutů
- \`PS3I8N7K\` — lišky
- \`ZS2I6N5N\` — kočky
- \`ZS6I8TN6I\` — psí duch
- \`ZS2I7TN3C\` — čichač

V řeči se celý kód nepoužívá. Stačí **poslední tři až čtyři znaky** — speciální vlastnost, nebezpečnost a identifikační znak. Tedy *N4O* jsou lidožrouti, *TN3C* je čichač, *N7K* jsou lišky.

Síla a inteligence jsou pro plánování. To ostatní potřebuješ znát v běhu.`,
  },

  // ─── JUNKIN ────────────────────────────────────────────────────────────────
  {
    slug: "junkin",
    title: "Junkin",
    category: "Junkin",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Junkin

**Junkin** (純金 — *čisté zlato*) je látka, na které stojí veškerá technologie Shin Junkinu. Energie, výroba potravin, medicína, zbraně, filtry. Bez junkinu se civilizace zastaví během měsíců.

Není to kov, přestože se tak jmenuje, a není to palivo. Je to **čistý potenciál** — možnost, aby něco získalo tvar a smysl.

---

## Dva stavy

**Surový junkin** je hmota. Vypadá jako hornina. Je nestabilní a sám o sobě nebezpečný: v jeho okolí se spontánně tvoří monstra.

**Rafinovaný junkin** už hmota není. Rituálním pečetěním se stabilizuje a zapečetí do člověka nebo do stroje. Teprve v tomhle stavu s ním jde pracovat.

---

## Odkud se bere

Junkin je teoreticky ve všem. Ve většině věcí je ale pevně vázaný a nemá smysl se ho pokoušet získat.

Surový junkin lze získat jen ze dvou míst:

1. **Z Měsíce.** Tuhle cestu lidstvo ztratilo.
2. **Z těl monster.** Tahle zbyla.

Proto je potřeba zabíjet monstra. Ne jen kvůli bezpečí. Kvůli surovině.

---

## Proč to nestačí

Z jednoho monstra je stopové množství. Celý Ústřední lovecký řád ročně nevytěží ani zlomek toho, co se spotřebovávalo za Zlaté generace.

Junkin proto není zboží. Je to přídělová položka a hospodaří se s ním jako se zdrojem, který nelze nahradit — protože nelze.

:::k8
Měsíc není ložisko a není to nebeské těleso s výskytem vzácné horniny.

Měsíc je **tělo**. Mrtvé, obrovské a plné junkinu, protože junkin je to, z čeho bylo.

Civilizace, která přežila konec světa, přežila díky tomu, že těžila mrtvolu. A až lovci přinesou surovinu z monstra, dělají v malém přesně totéž.
:::`,
  },
  {
    slug: "transmutace",
    title: "Transmutace",
    category: "Junkin",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Transmutace

**Transmutace** je proměna věci tím, že se jí uměle přidá nový význam. Vezmeš dřevo a bez práce, bez nástrojů a bez času z něj uděláš ptačí budku.

Je to jediný důvod, proč byla Zlatá generace možná — a je to jediný důvod, proč skončila.

---

## Význam a rituál

Věci získávají význam neustále a většinou pomalu. Čajový obřad. Otevření obchodu. Postavený dům, do kterého se někdo nastěhuje. Tomu se říká **rituál** a probíhá to samo, přirozeně, po celou historii.

Transmutace je totéž, jen okamžitě a násilím. Zapečetěný junkin vloží do předmětu význam, který by jinak vznikal roky, nebo by nevznikl vůbec.

---

## Cena

Význam se nedá vytvořit z ničeho. Když někde vznikne, jinde vznikne jeho opak.

Přirozený rituál je pomalý, takže je ta protiváha malá a rozptýlená. Průmyslová transmutace je okamžitá a obrovská — a stejně velká je i její stopa.

Tohle je celé vysvětlení, proč byl svět před Pádem plný zázraků a proč je teď plný monster. Nezměnil se svět. Změnilo se, jak rychle do něj lidé sahali.

---

## Regulace

Manipulace s junkinem podléhá povolení. Neregistrovaná transmutace je trestný čin bez ohledu na to, co se transmutovalo a jestli tím někdo utrpěl.

Trestá se, i když dopadne dobře. **Zvlášť** když dopadne dobře.

---

## Pečeť

Pečeť, která junkin drží stabilizovaný, je slabá a nevydrží dlouho. U nezkušeného uživatele povolí.

Když povolí, junkin se vrátí do surového stavu — uvnitř toho, kdo ho nesl.

> *Z transmutéra, kterému praskne pečeť, se nestává mrtvola. Stává se z něj práce pro lovce.*`,
  },
  {
    slug: "tezba-a-rafinace",
    title: "Těžba a rafinace",
    category: "Junkin",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Těžba a rafinace

---

## Sklizeň

Tělo zabitého monstra obsahuje stopové množství surového junkinu. Vydolovat ho je práce podpůrné specializace a je součástí výcviku.

Odtud pravidlo, které se studentům opakuje od prvního dne: **výprava, která se vrátí bez těla, splnila půlku úkolu.** Mrtvé monstrum na místě je bezpečí. Mrtvé monstrum doručené je bezpečí i surovina.

Tělo se transportuje celé. Rozebírat monstrum v terénu je zakázané — surový junkin bez pečeti si v okolí najde tvar.

---

## Rafinace

Surový junkin je chaos. Použít ho přímo nelze.

Rafinace probíhá **rituálním pečetěním** — soustavou pečetí a bariér zvaných **Kekkai**, které surovinu stabilizují a uzavřou do nosiče: do stroje, nebo do člověka.

Postup provádějí výhradně akreditovaná zařízení. Není veřejný a jeho části podléhají vyšším stupňům poznání.

---

## Hospodaření

Junkin je přídělová položka. Rozděluje ho stát podle priorit, které se veřejně neoznamují.

Nejvyšší lovecká asociace má vlastní kvótu, protože bez rafinovaného junkinu nefunguje vybavení, filtry ani zbraně. Kvóta se odvozuje od toho, kolik junkinu lovci přinesou.

Systém je tedy uzavřený: **lovci si na svoje vybavení vydělávají tím, co ulovili.** Čím horší rok, tím horší vybavení, tím horší rok.

---

## Zlatá generace

Za Zlaté generace se junkin těžil na Měsíci v objemech, které dnes nejdou popsat. Nikdo nehladověl, nikdo nestonal a jedenáct miliard lidí žilo líp než dnes žije kdokoli.

Ta těžba je pryč a nevrátí se snadno. Kdo tvrdí opak, obvykle něco prodává.`,
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

Osm miliard lidí. Stovky států. Zemědělská půda, na které rostlo jídlo ze země. Města bez hradeb, cesty bez doprovodu, moře, po kterých se dalo plout bez ozbrojené eskorty.

Lidé se dožívali osmdesáti let a považovali to za málo.

---

## Monstra

Byla i tehdy. Byla ale výrazně slabší a lidstvo mělo dost prostředků, aby si s nimi poradilo.

Existovaly armádní jednotky určené k ochraně obyvatelstva, ale běžný člověk na monstrum za celý život nenarazil. Většina lidí je považovala za pověru, pohraniční problém nebo něco, co se stává jinde.

Ke konci tohoto období se začaly objevovat obavy, že jich přibývá. Braly se jako přehnané.

---

## Co si z toho vzít

Tohle je jediné období lidských dějin, kdy lidstvo nežilo v ohrožení a nevědělo o tom.

Nedokázalo si toho vážit a nedokázalo to udržet. Ne proto, že by bylo hloupé — ale proto, že mu nikdo neřekl, jakou cenu má řád, dokud ho nemělo pozdě.

> *Nejnebezpečnější doba je ta, ve které se člověku zdá, že nebezpečí neexistuje.*`,
  },
  {
    slug: "zlata-generace",
    title: "Zlatá generace (2031–2095)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Zlatá generace

**黄金世代 — *Kogane Sedai***

---

## 2031

Japonská národní společnost **豪華世界 (Gōkasekai) — Luxusní svět** se dostává na odvrácenou stranu Měsíce a začíná tam těžit **純金 (Junkin) — čisté zlato**.

Považuje to za znamení a sebe znovu za vyvolený národ. Zbytek světa to bere jako nesmysl, který je nutné tolerovat, protože junkin funguje.

A funguje na všechno. Levná energie. Zvrácené ekologické škody. Zpracování jídla a vody v jakémkoli množství. Těžba a zpracování provázené masivními rituály.

---

## Co to udělalo

Lidstvo odstranilo hlad. Odstranilo nemoci. Odstranilo chudobu.

Jedenáct miliard lidí žilo krásný život. Vždycky se našel někdo, kdo si stěžoval, ale drtivá většina měla kde bydlet, co jíst, a neposlouchala varovné hlasy.

---

## 2095

Na Zemi žije **dvacet pět miliard** lidí — nejen díky porodnosti, ale hlavně díky extrémnímu prodloužení života.

- Zemědělská půda byla zrušena. Potraviny se vyrábějí laboratorně.
- Většina mořských ploch je zastavěná.
- Volná příroda existuje jen v rezervacích.
- Koncept států byl opuštěn. Lidstvo funguje jako jediná civilizační entita.

O rezervacích kolují historky o podivných tvorech a duších. Většina lidstva je považuje za moderní verzi pověsti o Bigfootovi. Přesto vzniká vládní program na odstraňování nelidských hrozeb.

---

## Varování

Vědci upozorňují, že junkin není obnovitelný a vývoj je neudržitelný. Podrobnější výzkum navíc odhaluje jeho stinnou stránku: **manipulace s junkinem urychluje vznik monster.**

Odpadní látky z jeho zpracování jsou těkavé a toxické. Světová vláda rozhodla ukládat je do extrémně hlubokých vrtů. Část vědecké obce protestovala kvůli neznámým dlouhodobým dopadům a byla umlčena masivně sponzorovanou studií.

Spekulovalo se, že výsledky ovlivnil lobbying těžařské společnosti Gōkasekai. Prokázáno to nebylo.

> *Šedesát čtyři let blahobytu. Za každý z nich se pak platilo zvlášť.*`,
  },
  {
    slug: "rozpad-a-valka",
    title: "Rozpad a Světová válka konce (2095–2101)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 3,
    content: `# Rozpad a Světová válka konce

---

## Rozpad (2095–2100)

Těžba junkinu začíná váznout a je zřejmé, že ho ubývá. Na Měsíci propukají první boje mezi korporacemi o ložiska.

Roztříštěnost zájmů oslabí systém ochrany před monstry. Objevují se první vážné útoky a masakry.

Společenské rozdíly, které byly v blahobytu neviditelné, se vyostří. Vyšší vrstvy hromadí junkin, na nižší se nedostává. Všechny technologie jsou přitom stavěné na junkin, kterého není dost.

Propuká hladomor a s ním nepokoje. Svět se během pěti let rozdělí na „my" a „oni". Frakce bojují proti sobě. Umírají miliony.

---

## Válka (2100–2101)

**終焉世界大戦 — *Shūen Sekai Taisen*, Světová válka konce.**

Trvala něco přes rok. Bojovalo se výhradně mezi lidmi — proti monstrům v té době nebojoval nikdo, protože nikdo neměl kapacitu.

V roce 2101 sáhla jedna ze stran po konečném řešení a použila celý svůj atomový arzenál.

---

## Proč se tím rozbil svět

Exploze zasáhly rozsáhlá úložiště junkinového odpadu uložená v hlubokých vrtech.

To spustilo řetězovou reakci v zemské kůře. Tektonické desky se daly do pohybu.

Válka tím fakticky skončila — ne proto, že by někdo zvítězil, ale proto, že přestalo být kde a s kým bojovat.

:::k2
Ta strana jsme byli my.

Údery vypustili předchůdci Shin Junkinu. Pustina za mořem, kterou dnes nazýváme Okrajem a která je neobyvatelná dodnes, je neobyvatelná proto, že jsme ji takovou udělali.

Odhady mrtvých se pohybují v miliardách a rozlišit oběti úderu od obětí toho, co následovalo, není možné.

Nemluví se o tom nahlas a nemluví se o tom rádo. Nezakrývá se to ale a nebude se to zakrývat. Kdo dosáhl druhého stupně poznání, unese i tohle:

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

**亡響 — *Bōkyō***

Deset let, během kterých se planeta přestavěla.

---

## Co se dělo

Tektonické desky se pohybovaly rychlostí, pro kterou geologie neměla slovo.

- Pohoří mizela a nová vznikala během týdnů.
- Pouště se měnily v moře a oceány vysychaly.
- Extrémní výkyvy počasí, zemětřesení, záplavy a cunami bez pauzy.

Umíraly miliardy. Ne ve válce — po ní.

---

## Jak se přežívalo

Elektronická komunikace nefungovala. Lidstvo se scvrklo na mrchožrouty a sběrače ve zbytcích rozbité civilizace.

Lidé žili v klanech a v **přesuvných populačních centrech** — sídlech, která se stěhovala, kdykoli se jim krajina pod nohama změnila natolik, že se v ní nedalo zůstat.

---

## 2111

Pohyb desek se náhle zastavil. Výkyvy počasí skončily.

Svět vypadal úplně jinak, ale zdál se stejně obyvatelný jako dřív.

Odhaduje se, že přežila zhruba **jedna miliarda** lidí. Podobný počet jako v polovině devatenáctého století.

---

## Co přišlo s tím

Svět se mohl začít stabilizovat. Místo toho se ukázalo, že všude, kde se lidé pokusili znovu něco postavit, se objevují **monstra**.

Ne ojediněle. Všude.

Tím okamžikem přestala být otázka, jestli lidstvo přežilo katastrofu, a začala otázka, jestli přežije to, co po ní zbylo.

> *Zkáza měla ozvěnu. Ozvěna byla hlasitější.*`,
  },
  {
    slug: "putujici-svetla",
    title: "Putující světla (2111–2120)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 5,
    content: `# Putující světla

**巡灯 — *Juntō***

Devět let mezi zastavením desek a ustavením Shin Junkinu. Doba, ve které vzniklo lovectví.

---

## Nultá generace

Ještě před válkou existovali lidé, kteří zabíjeli monstra profesionálně — vojáci zvláštních armádních složek. Tehdy se jim neříkalo lovci. Ten název dostali až zpětně.

Po zkáze se stali klíčovými pro přežití populačních center. Bylo jich málo a nikdo je nedokázal nahradit.

---

## První generace a kovenant

Ti, kdo po zkáze chodili světem a chránili lidi.

Nezůstávali v jednom centru. Přesouvali se mezi nimi, prorážali dopravní stezky a čistili nová místa, když bylo potřeba centrum přestěhovat. V kolektivní paměti zůstali jako **postavy v šedivých cestovních pláštích, které přicházely ze tmy a zase do ní odcházely**.

Odtud jméno té doby.

Protože každé centrum mělo jiné zákony, vznikl **lovecký kovenant** — tři věty, na které město přistoupilo, když chtělo ochranu:

1. Lovec má povinnost zabíjet monstra a chránit lidi.
2. Lovec má dveře otevřené.
3. Lovce soudí jenom jiní lovci.

Kovenant formálně zanikl se vznikem státu. Lovci se na něj odkazují dodnes a berou ho vážněji než zákoník, který ho nahradil.

---

## Shidōsei a pravidlo trojic

Mladí lidé v populačních centrech skládali **Shidōsei** — přísahy vedení, vždy jeden učedník jednomu mentorovi. Když mentor rozhodl, stal se učedník čekatelem. Tak vznikla **druhá generace**.

Tehdy se také zavedlo **pravidlo trojic**. Vycvičit jednoho člověka k plné samostatnosti trvalo příliš dlouho a málokdo to unesl. Civilizace v troskách si nemohla dovolit čekat na nadlidi.

Jakmile se sešli tři čekatelé, posoudila se jejich vzájemná snesitelnost a stal se z nich tým. Mentor s nimi ještě nějakou dobu putoval, než jim udělil akreditaci.

---

## Jestřáb

**鷹 — *Taka*.** Lovec nulté generace.

Ve vesnické dívce nenašel jen učednici, ale i lásku. Jeho milovanou postihl příšerný osud a proměnila se v monstrum.

Taka odmítl naplnit kovenant a zabít ji. Když tu povinnost splnili jiní, postavil se svým bratrům — a ve vzdoru se proměnil v monstrum i on. Než ho porazili, zmasakroval několik lovců a desítky civilistů.

Z toho dne pochází zákaz partnerského života a rodiny. A z počtu obětí pochází barva pláště: od té doby jsou **rudé**.

> *Lidstvo otevírá dveře a vydává své bezpečí do rukou lovců. Musí mít jistotu, že nesejdou z cesty.*`,
  },
  {
    slug: "ustaveni-shin-junkinu",
    title: "Ustavení Shin Junkinu (2120–2143)",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 6,
    content: `# Ustavení Shin Junkinu

---

## 2120

**新純金 (Shin Junkin) — Nový Junkin** vzniká jako federace populačních center, která sdílejí filozofii Zlaté generace: pokrok lidstva hnaný junkinem. Později se prohlásí velkostátem.

Shin Junkin odmítá tvrzení, že využívání junkinu byla chyba. Vinu klade na přílišnou individualizaci a sobectví — ne na látku samotnou. Cílem je obnovit přístup do vesmíru a k těžbě.

Základní princip: **nikdo nemá hladovět, ale každý musí pracovat a dar junkinu nezneužívat.**

---

## Rozdělení světa

Lidstvo se nedokázalo sjednotit. Zbyly tři velmoci:

- **Shin Junkin** — bývalé Japonsko a okolní souostroví
- **Konfederace** — pobřežní státy bývalé Ameriky, spojené obrněnými vlaky přes zamořený kontinent. Hlavní protivník.
- **Pakt Europa** — izolacionisté, kteří tvrdě omezili užívání junkinu. Mají proto málo monster a zaostávají v technologii.

Vedle nich dvě menší mocnosti bez velmocenského postavení: **Meridián**, putovní národ plovoucích ostrovů a spojených lodí, a **Země obrody**, mikrostáty na jihu Afriky a Ameriky, které junkin odvrhly a snaží se s monstry žít v souladu.

---

## Lovecký řád

Se vznikem státu se lovectví institucionalizovalo. Vznikl **Ústřední lovecký řád** (中央猟士団 — *Chūō Ryōshi-dan*), zkráceně **Ryōdan**.

Lovecký kovenant formálně zanikl a nahradil ho **Lovecký zákoník** — komplexní soubor pravidel existence lovců ve státě.

Všichni, kdo se stali lovci po roce 2120, tvoří **druhou generaci**.

---

## Projekt Akano

Školy projektu Akano cvičí **třetí generaci**. Jsi v ní.

---

## Nyní se píše rok 2143

Od atomového úderu uplynulo dvaačtyřicet let. Od ustavení státu dvacet tři.

Nultá generace lovců, ti, kdo pamatují svět před válkou, dnes buď nežije, nebo je jí přes pětašedesát. Za pár let nezůstane nikdo, kdo Zlatou generaci viděl na vlastní oči.

Zůstanou záznamy. A tahle databáze.`,
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
