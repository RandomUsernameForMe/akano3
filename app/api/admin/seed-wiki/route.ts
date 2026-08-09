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
