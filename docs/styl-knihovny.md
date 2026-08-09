# Styl textů v knihovně

Pravidla pro psaní článků do herní knihovny (`app/api/admin/seed-wiki/route.ts`).

Vzniklo 2026-08-09 poté, co se ukázalo, že texty jsou květnaté na úkor
informační hustoty a nesou opakující se rytmické tiky.

Dodržování hlídá `lib/wiki-styl.test.mjs`. Spouští se s ostatními testy:
`node --test lib/*.test.mjs`.

---

## Co knihovna je

**Státní databáze, ne román.** Čtenář v ní něco hledá — během hry, uprostřed
scény, na telefonu. Text musí odpovědět a skončit.

Atmosféra vzniká **výběrem faktů a tím, jak je režim podává**, ne rytmem vět.
Věta „Udělali jsme to. Bylo to nutné." je obsah: říká, jak stát genocidu rámuje.
Věta „Není to opatrnost. Je to spotřeba." je jen ozdoba téhož faktu.

## Základní pravidlo

**Každá věta nese fakt.** Co fakt nenese, jde pryč.

---

## Zakázáno úplně

| Vzorec | Proč | Místo toho |
|---|---|---|
| Komentář textu o sobě — „Tohle je celé jádro věci", „Tohle je skutečný důvod" | Wiki nekomentuje vlastní důležitost | Rovnou ten důvod |
| Předjímání námitek — „Není to opomenutí osnov", „Není to náhoda" | Nikdo nic nenamítl | Vynechat |
| Rámování sebe sama — „To je vše, co je veřejně známo" | Čtenář ví, kde je | Vynechat |
| Vágní zesilovače — „zoufale", „krajně", „nesmírně", „naprostá většina" | Nic neměří | Číslo, nebo nic |
| „Obvykle" jako zlověstný náznak | Buď se to děje, nebo ne | Uvést četnost, nebo tvrdit přímo |

## Rozpočty

Limity na **celou knihovnu**, ne na článek. Kontroluje test.

| Vzorec | Limit | Poznámka |
|---|---|---|
| Antiteze „Není to X, je to Y" / „Nejde o X, jde o Y" | **5** | Nikdy dvě v jednom článku |
| Em-dash `—` jako dramatická pauza | **40** | Většinu nahradí čárka, tečka nebo dvojtečka |
| Kurzívní aforismus v `>` bloku | **8** | Jen doložený citát: doktrína, průpovídka. Ne moudro vypravěče |
| Krátká úderná věta (≤6 slov) na konci odstavce | **5** | Musí nést nový fakt, ne shrnovat odstavec |
| Oslovení čtenáře („jsi", „tvůj", „ty") | **3** | Jen kde je to záměrné odhalení |

## Nahradit strukturou

- **Trojice v próze** („mapy, senzory, rozhodování") → odrážky, jde-li o výčet faktů.
- **Symetrický protiklad** („Lovec je svoboda, voják je povinnost") → jen jako
  uvozená průpovídka, ne jako vyprávění.

## Co se nezkracuje

- Režimní rámování a doktrína. Je to obsah, ne balast.
- Stupnice, kódy, klasifikace, časové osy. Referenční data se nekrátí.
- Japonské termíny s přepisem a překladem.

---

## Formát

Šablona odpovídající rendereru (`components/shared/wiki-renderer.tsx`):

```
# Název

Odstavec s definicí. **Tučně** klíčový termín, *kurzívou* japonský přepis.

---

## Sekce

- odrážka
- odrážka

:::k3
Utajená vrstva.
:::
```

Renderer neumí tabulky. Výčty se píší odrážkami.

Délka článku 1000–2000 znaků. Delší jen tam, kde je to referenční data
(bestiář, klasifikace, stupnice).
