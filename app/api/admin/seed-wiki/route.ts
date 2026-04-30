import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

const ARTICLES = [
  // ─── SVĚT ──────────────────────────────────────────────────────────────────
  {
    slug: "svet-akano",
    title: "Svět Akano",
    category: "Svět",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Svět Akano

**Akano** je jedno z posledních organizovaných sídel lidstva, opevněné město na území zvaném *Červená planina*. Po Velkém Pádu před třiceti lety se přeživší soustředili za jeho hradby. Dnes je domovem téměř osmdesáti tisíc obyvatel a centrem moci na celém kontinentě.

---

## Geografie

Město leží na vyvýšené plošině obklopené třemi stranami hlubokou průrvou zvanou **Propast Nichi**. Čtvrtá strana je chráněna masivní betonovou hradbou — *Velkou Stěnou* — postavenou prvními přeživšími.

Město je rozděleno do čtyř čtvrtí:
- **Červená čtvrť** — centrum moci, sídlo Rady
- **Čtvrť Trhů** — obchod a řemesla
- **Akademická čtvrť** — vzdělávání, výzkum, výcvik
- **Vnější prstenec** — prostí obyvatelé, dělníci

:::k2
Pod Akademickou čtvrtí se rozkládá rozsáhlé podzemí — *Katakomby Nula*. Jejich existence je veřejně popírána. Slouží jako vězení pro osoby, jejichž vědomosti jsou příliš nebezpečné k propuštění, a jako laboratoř pro výzkum zakázaný Radou.
:::

---

## Klimatické podmínky

Vzduch v okolí Akana je mírně toxický — přímé pobývání mimo hradby bez ochranné masky je po více než čtyřech hodinách nebezpečné. Uvnitř hradeb cirkulační systém vzduch filtruje.

:::k3
Toxicita není přirozená. Je udržována uměle — speciálními generátory instalovanými Radou podél vnějšího obvodu. Důvod je prostý: nikdo nesmí natrvalo opustit Akano bez povolení.
:::`,
  },
  {
    slug: "system-kaichi",
    title: "Systém Kaichi",
    category: "Svět",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Systém Kaichi

**Kaichi** (開知 — *Otevřené poznání*) je stupňovitý systém hodnosti a přístupu k informacím, který řídí každý aspekt života v Akanu.

---

## Stupně

Systém má devět úrovní označených římskými číslicemi **I** až **VIII**, plus základní úroveň **0** pro nové členy.

| Stupeň | Název | Přístup |
| --- | --- | --- |
| 0 | Novicové | Veřejné informace |
| I–II | Učni | Základní operativní data |
| III–IV | Praktici | Politické zákulisí |
| V–VI | Mistři | Přístup k Archivům |
| VII–VIII | Velitelé | Přístup k Prvotním Pečetím |

---

## Povýšení

Kaichi nelze získat studiem ani zásluhami v boji. Povýšení uděluje výhradně **Rada** na základě kritérií, která nikdy nebyla veřejně oznámena. Většina obyvatel zemře na Kaichi 0 nebo I.

:::k3
Skutečným kritériem povýšení není loajalita ani schopnost. Rada povyšuje ty, u nichž provedla test *Vazby* — neurální propojení, které z dotyčného učiní nevědomého informátora. Vyšší Kaichi = hlubší vazba.
:::

:::k5
Na Kaichi VII a VIII není Vazba jen pasivní sledování. Nositelé se stávají aktivními uzly Prvotní Sítě. Jejich rozhodování je subtilně řízenou externím algoritmem. Věří, že jednají svobodně.
:::`,
  },

  // ─── POLITIKA ──────────────────────────────────────────────────────────────
  {
    slug: "rada-deviti",
    title: "Rada Devíti",
    category: "Politika",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Rada Devíti

**Rada Devíti** je nejvyšší vládnoucí orgán Akana. Devět velitelů s Kaichi VIII tvoří kolektivní vedení, které rozhoduje o všech záležitostech přesahujících pravomoc nižších složek.

---

## Složení Rady

Každý člen Rady zastupuje jednu ze složek moci:

- **Velitel Obrany** — vojenská síla a ochrany hradeb
- **Velitelka Zásobování** — distribuce potravin a vody
- **Velitel Výzkumu** — technologie a věda
- **Velitelka Vzdělávání** — Akademie a systém Kaichi
- **Velitel Vnitřní správy** — policie a pořádek
- **Velitelka Komunikace** — informace a propaganda
- **Velitel Vnějších vztahů** — expedice mimo hradby

:::k2
Osmá a devátá pozice jsou oficiálně označeny jako „vakantní od Pádu". Není tomu tak. Osmý člen je přítomen na každém zasedání, ale jeho identita je veřejným tajemstvím chráněným trestem smrti. Devátý člen neexistuje jako fyzická osoba — je to algoritmická entita zvaná *Arbiter*.
:::

---

## Zasedání

Rada zasedá každý čtvrtek v Červeném sále. Zápisy ze zasedání jsou veřejné — s výjimkou materiálů označených stupněm Kaichi III a výše.

:::k4
Veřejné zápisy jsou záměrně zkrácené. Skutečná rozhodnutí Rady probíhají na tzv. *Černých zasedáních* bez zápisu, obvykle ve 3 hodiny ráno. Přítomnost na Černém zasedání bez pozvánky se trestá smrtí.
:::`,
  },

  // ─── FRAKCE ────────────────────────────────────────────────────────────────
  {
    slug: "klan-cerveneho-draka",
    title: "Klan Červeného Draka",
    category: "Frakce",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Klan Červeného Draka

**Klan Červeného Draka** (*Aka-ryu*) je nejstarší a nejpočetnější frakce v Akademii. Sdružuje studenty a praktici s důrazem na bojové umění, disciplínu a přímou akci.

---

## Historie

Klan byl založen před dvaceti lety skupinou prvních absolventů Akademie, kteří přežili průzkumnou expedici do *Mrtvých zemí* a vrátili se s trofejí — zuby neznámého predátora, odtud symbolem draka.

## Filosofie

> *Síla je jediný jazyk, kterému svět rozumí.*

Červený Drak věří v hierarchii postavenou na prokázané schopnosti. Slabost — fyzická, mentální nebo morální — je v jejich očích osobní selhání.

---

## Struktura

- **Velmistr** — vůdce klanu, Kaichi V nebo výše
- **Starší** — veteráni s Kaichi III–IV
- **Čepele** — aktivní členové
- **Noví** — nováčci v prvním roce

:::k2
Klan provozuje paralelní výcvikový program mimo oficiální osnovy Akademie. Zvaný *Temná Čepel*, učí techniky, které Rada oficiálně zakázala jako „přespříliš destruktivní". Instruktoři jsou bývalí členové Rady, kteří byli vyloučeni za příliš radikální postoje.
:::

:::k4
Skutečným cílem Červeného Draka není válečná převaha. Klan shromažďuje důkazy o korupci Rady a připravuje koordinovaný převrat. Datum je stanoveno na výročí Velkého Pádu. Velmistr ví, že pravděpodobnost přežití vůdců akce je méně než dvacet procent. Plán běží dál.
:::`,
  },
  {
    slug: "stinova-aliance",
    title: "Stínová Aliance",
    category: "Frakce",
    kaichi_required: 2,
    sort_order: 2,
    content: `# Stínová Aliance

**Stínová Aliance** je síť informátorů a agentů, která operuje napříč všemi frakcemi Akademie i mimo ni. Neexistuje žádné centrální velení — nebo tak to alespoň vypadá.

---

## Jak vstoupit

Do Aliance se nevstupuje přihláškou. Aliance kontaktuje kandidáty sama. Kritéria jsou neznámá. Odmítnutí pozvánky bývá podle nepotvrzených zpráv fatální.

## Schopnosti

Aliance má zdokumentovaný přístup k:
- Kompletním záznamům pohybu osob v Akademické čtvrti
- Šifrované komunikaci obcházející Radu
- Síti bezpečných domů mimo hradby

:::k3
Aliance je ve skutečnosti mnohem starší než Akano samotné. Existovala již před Velkým Pádem jako odbočka mezinárodní zpravodajské organizace. Velký Pád nezničil strukturu — jen ji přesunul pod zem. Část členů Rady je agenty Aliance, část agentů Aliance je v Radě. Granice se záměrně rozmazává.
:::

:::k5
Na nejvyšší úrovni Aliance neexistuje vedení z masa a kostí. Existuje pouze *Protokol* — séria pravidel napsaných před Pádem, která řídí rozhodování autonomně. Nikdo živý nezná celý Protokol. Každý agent zná jen svůj fragment.
:::`,
  },
  {
    slug: "legie-popela",
    title: "Legie Popela",
    category: "Frakce",
    kaichi_required: 1,
    sort_order: 3,
    content: `# Legie Popela

**Legie Popela** (*Haijin*) je frakce zaměřená na přežití za hranicemi Akana. Zatímco ostatní frakce soupeří o moc uvnitř hradeb, Legie hledí ven.

---

## Přesvědčení

Legie věří, že Akano je dočasné — ať už kvůli vnitřnímu kolapsu nebo vnější hrozbě. Jejich cílem je zmapovat, pochopit a případně kolonizovat Mrtvé země.

> *Popel je konec. Je také začátek.*

---

## Průzkumy

Legie organizuje nelegální průzkumné výpravy mimo hradby — bez povolení Rady, bez ochranných masek Rady. Používají vlastní filtrační technologie.

- **Výprava Červen-7** — první návrat s živými vzorky půdy
- **Výprava Září-12** — objev zříceniny na vzdálenost 40 km
- **Výprava Prosinec-3** — ██████████ (záznamy uzamčeny)

:::k3
Výprava Prosinec-3 se vrátila s nálezem, který Legie okamžitě zapečetila před ostatními frakcemi. Tři členové výpravy zemřeli během čtyřiadvaceti hodin po návratu — příčina neznámá. Jeden přeživší odmítá mluvit a nespí déle než dvacet minut v kuse. Nalezený objekt je ukryt mimo Akano na utajené lokaci.
:::`,
  },

  // ─── HISTORIE ──────────────────────────────────────────────────────────────
  {
    slug: "velky-pad",
    title: "Velký Pád",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Velký Pád

**Velký Pád** — označovaný také jako *Den Nula* — je událost před třiceti lety, která zničila většinu civilizovaného světa během 72 hodin.

---

## Oficiální výklad

Podle kronik Rady byl Velký Pád způsoben kaskádovým selháním ekologických systémů zrychlených klimatickými změnami. Toxické vzdušné masy se rozšířily z průmyslových center, degradace půdy způsobila kolaps zemědělství a do dvou let zemřelo přes devadesát procent světové populace.

> *Příroda se pomstila za staletí zneužívání.*
> — Rada Devíti, Pamětní projev, rok 5 po Pádu

---

## Přeživší

Z odhadovaných osmi miliard lidí přežilo méně než sto milionů. Většina v izolovaných opevněních, z nichž Akano je největší.

:::k2
Záznamy z prvního roku po Pádu uchovávané v Červeném archivu jsou z devadesáti procent redigovány. Přístupná část odhaluje, že toxicita nebyla homogenní — v určitých oblastech vzduch zůstal čistý. Tyto oblasti ale nebyly obsazeny přeživšími. Proč, záznamy nevysvětlují.
:::

:::k4
Velký Pád nebyl ekologická katastrofa. Byl to řízený experiment skupiny vědců financovaných předpádovými vládami. Cíl: radikální redukce světové populace jako řešení zdrojové krize. Akano nebyla postavena *po* Pádu — byla připravena *před* ním jako útočiště pro vyvolené. Rada Devíti jsou přímí nástupci organizátorů experimentu.
:::

:::k6
Experiment selhal. Výsledky se vymkly kontrole. Skutečná příčina toxicity je biologická — modifikovaný organismus, který se stále vyvíjí. Má vědomí. Komunikuje. Rada s ním vyjednává.
:::`,
  },
  {
    slug: "zakladani-akademie",
    title: "Založení Akademie",
    category: "Historie",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Založení Akademie

**Akademie Akano** byla formálně otevřena v šestém roce po Pádu jako vzdělávací instituce pro novou generaci vůdců.

---

## Okolnosti vzniku

První generace přeživších čelila akutní krizi vedení. Staré struktury — vlády, armády, korporace — zanikly. Nová hierarchie se musela vybudovat od základů. Akademie měla být jejím nástrojem.

Zakládající listina hovoří o třech pilířích:

1. **Poznání** — uchování a rozšiřování vědomostí
2. **Síla** — výcvik schopných obránců
3. **Loajalita** — výchova jedinců oddaných Akanu

---

## Systém Kaichi jako nástroj

Systém Kaichi byl zaveden současně s Akademií. Jeho architektem byl

:::k3
— **Mistr Toru Hashimoto**, vedoucí výzkumu Rady a jeden z devíti zakladatelů Akana. Hashimoto zemřel v roce 15 po Pádu za záhadných okolností. Jeho osobní zápisky byly okamžitě zapečetěny Radou. Tři archiváři, kteří zápisky katalogizovali, zmizeli do týdne.
:::

Systém je dnes prezentován jako přirozená evoluce vzdělávacího modelu. Jeho původní technická dokumentace není dostupná.`,
  },

  // ─── VĚDA & TECHNOLOGIE ────────────────────────────────────────────────────
  {
    slug: "seikido",
    title: "Seikido — Umění Vnitřní Síly",
    category: "Věda & Technologie",
    kaichi_required: 1,
    sort_order: 1,
    content: `# Seikido

**Seikido** (精気道 — *Cesta čisté energie*) je bojová a meditační technika vyučovaná v Akademii od Kaichi I. Kombinuje fyzický výcvik s mentální disciplínou.

---

## Základní principy

Seikido pracuje s konceptem **sei** — vnitřní energie, kterou každý člověk přirozeně produkuje. Trénink Seikido tuto energii koncentruje, usměrňuje a amplifikuje.

Praktici popisují zkušenost jako:

> *Teplo šířící se z hrudníku do končetin. Svět se zpomalí. Reakce přijde dříve než vědomá myšlenka.*

---

## Stupně Seikido

- **Shizen** — přirozený stav, nevycvičená energie
- **Ichi-no-sei** — první stupeň, vědomá aktivace
- **Ni-no-sei** — druhý stupeň, prodloužená koncentrace
- **San-no-sei** — třetí stupeň, sdílená energie (kooperativní efekt)

:::k3
**Shi-no-sei** — čtvrtý stupeň — není vyučován v oficiálních osnovách. Důvod není technický. Praktici Shi-no-sei vykazují anomální mozkovou aktivitu, která interferuje se systémem Vazby používaným Radou pro sledování. Jsou proto pro Radu „neviditelní". Výuka čtvrtého stupně je trestána jako velezrada.
:::

---

## Vědecký výzkum

Neurologické studie potvrzují měřitelné změny v mozku aktivních praktiků Seikido — vyšší konduktivitu nervových drah a schopnost vědomého řízení autonomního nervového systému.

:::k4
Novější výzkum Výzkumného oddělení Rady naznačuje, že Seikido není technika vyvinutá lidmi. Nejstarší záznamy o podobné praxi pocházejí z nálezů v Mrtvých zemích — předcházejí Velký Pád o stovky let. Původní zdroj je neznámý.
:::`,
  },
  {
    slug: "prvotni-peceti",
    title: "Prvotní Pečeti",
    category: "Věda & Technologie",
    kaichi_required: 3,
    sort_order: 2,
    content: `# Prvotní Pečeti

**Prvotní Pečeti** jsou série sedmi artefaktů neznámého původu, jejichž existence je klasifikována jako Přísně tajné.

---

## Co jsou Pečeti

Každá Pečeť je fyzický objekt přibližně velikosti dlaně, vyrobený z materiálu, který nelze identifikovat ani zničit konvenčními metodami. Povrch je pokryt symboly, které žádný lingvista nedokázal dešifrovat.

Pečeti reagují na přítomnost praktiků Seikido na vysokých stupních. Při kontaktu s Kaichi V+ je popsána jako:

> *Jako by objekt znal tvé jméno. Jako by ti chtěl něco říct.*

:::k4
Šest z osmi Pečetí je v držení Rady, uloženo v trezoru pod Červeným sálem. Sedmá Pečeť zmizela v průběhu Velkého Pádu. Osmá nikdy nebyla nalezena — nebo tak Rada tvrdí. Záznamy z Výpravy Prosinec-3 Legie Popela naznačují jinak.
:::

:::k5
Pečeti nejsou artefakty. Jsou to uzly vědomí — fragmenty entity, která existovala před lidstvem. Každý kontakt s Pečetí zanechává stopu v mozku praktika. Rada tuto stopu sleduje. Právě proto je přístup k Pečetím tak přísně regulován — ne kvůli nebezpečí pro kontaktující osobu, ale kvůli datům, která kontakt přenáší zpět do sítě.
:::`,
  },

  // ─── OSOBNOSTI ─────────────────────────────────────────────────────────────
  {
    slug: "mistr-ren",
    title: "Mistr Ren",
    category: "Osobnosti",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Mistr Ren

**Mistr Ren** (plným jménem Renji Nakamura) je nejstarší aktivní člen pedagogického sboru Akademie. Je jedním z mála lidí, kteří pamatují svět před Velkým Pádem.

---

## Životopis

Narozen přibližně šedesát let před současností, Ren byl v době Pádu vědeckým pracovníkem v oblasti neurologie. Přesné okolnosti jeho přežití nejsou zdokumentovány.

Do Akademie vstoupil jako instruktor v osmém roce po Pádu. Vyučuje Seikido a filozofii přežití. Drží Kaichi VII — nejvyšší aktuálně udělená úroveň mimo Radu.

---

## Pověst

Studenti ho popisují rozporuplně:

- *„Nejlepší instruktor, jakého jsem kdy měl. Cítí se, jako by viděl skrz tebe."*
- *„Nikdy přímá odpověď. Vždy otázka zpátky. Frustrující a zároveň přesné."*
- *„Jednou jsem ho viděl zastavit čepel holou rukou. Bez škrábnutí."*

:::k3
Ren není loajální Radě. Má přístup k materiálům Kaichi VII, ale nikdy je nevyužil způsobem, který by Radě vyhovoval. Je sledován nepřetržitě. Ví o sledování. Ignoruje ho záměrně.

Existuje teorie — nezákladovaná žádným přímým důkazem — že Ren přežil Pád proto, že se na něm podílel. A lituje toho.
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
