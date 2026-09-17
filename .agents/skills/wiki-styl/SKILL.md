---
name: wiki-styl
description: Zkontroluje a opraví styl textů v herní knihovně Akano3 — hlídá, aby články byly hutné referenční texty, ne květnatá próza, a aby se nevracely opakující se rytmické tiky typické pro strojově psaný text (antiteze „není to X, je to Y", dramatické pomlčky, úderné jednovětné pointy, aforismy v kurzívě). Použij vždy, když se přidávaly nebo upravovaly články knihovny, když se uživatel ptá jestli texty nezní jako AI, když si stěžuje na květnatost, rozvláčnost nebo nízkou informační hustotu wiki textů, a jako pravidelnou revizi po delší době psaní obsahu. Také když padne „zkontroluj styl knihovny", „nezní to jako AI?", „projdi wiki texty" nebo „wiki-styl".
---

# Styl textů v knihovně

Knihovna je **státní databáze uvnitř hry, ne román**. Hráč v ní něco hledá
uprostřed scény, na telefonu. Text musí odpovědět a skončit.

Tenhle skill hlídá, aby texty zůstaly hutné. Vznikl poté, co se ukázalo, že
články byly květnaté na úkor informace a nesly opakující se rytmické tiky —
ty samé, které prozrazují strojově psaný text.

Plná pravidla i s odůvodněním: `docs/styl-knihovny.md`.
Obsah článků: `app/api/admin/seed-wiki/route.ts`.

## Postup

### 1. Změř

```bash
node scripts/wiki-styl.mjs
```

Skript vypíše každé pravidlo, počet výskytů a — u překročených — které články
je porušují a kolikrát. Skončí s kódem 1, pokud je něco přes rozpočet.

### 2. Rozhodni, co je skutečně vada

Skript počítá vzorce, ne význam. Než začneš mazat, přečti si nálezy v kontextu.
Ne každý zásah je chyba:

- Antiteze **je** namístě, když režim něco vyvrací jako doktrínu („Není to
  trest, je to opatření"). Vadí, když je to jen rytmická ozdoba faktu.
- Krátká věta na konci odstavce **je** namístě, když nese nový fakt. Vadí, když
  shrnuje odstavec, který si čtenář právě přečetl.
- Em-dash v odrážce nebo v glose japonského termínu skript nepočítá. Pokud ho
  přesto hlásí, je v próze a skoro vždy ho nahradí čárka, tečka nebo dvojtečka.

### 3. Přepiš

Vodítko, které platí na všechno: **každá věta nese fakt.** Co fakt nenese, jde
pryč. Atmosféra vzniká výběrem faktů a tím, jak je režim podává, ne rytmem vět.

Příklad — osm řádků nesoucích tři fakty:

> Transmutace junkinu je přísně střežená dovednost. To je o ní veřejně známo a
> je to zároveň všechno, co je o ní veřejně známo.
>
> Že existuje. Že k ní je potřeba junkin. Že ji smí provádět jen ten, kdo k
> tomu má oprávnění, a že těch je málo.
>
> Jak přesně probíhá, se neučí. Ani na Akademii, ani nikde jinde, kam se
> student dostane. Není to opomenutí osnov — postup je klasifikovaný.

Totéž hutně:

> Postup transmutace je klasifikovaný. Neučí se: ani na Akademii, ani jinde,
> kam se student dostane. Provádět transmutaci smí pouze držitel oprávnění.
> Zájem o postup se eviduje.

Co se **nezkracuje**: režimní rámování a doktrína (je to obsah — informace o
tom, jak stát věc podává), stupnice, kódy, klasifikace, časové osy, japonské
termíny s přepisem.

### 4. Ověř

Pusť skript znovu, dokud neprojde. Pak build a seed:

```bash
npx next build
curl -s -X POST http://localhost:3001/api/admin/seed-wiki
```

Port si ověř — dev server nemusí běžet na 3001.

## Když chceš změnit rozpočty

Limity jsou v poli `PRAVIDLA` ve `scripts/wiki-styl.mjs` a v tabulce v `docs/styl-knihovny.md`.
Drž je v souladu. Rozpočty jsou na **celou knihovnu**, ne na článek, protože
tik se pozná až v opakování — jedna antiteze je styl, devatenáct je manýra.

Když knihovna výrazně poroste, rozpočty přepočítej na hustotu (výskyt na 10 000
znaků), ne na absolutní počet.
