## [2026-04-27] - Login UI a gift route fix

- Logo v pozadí login formuláře — velké, průhledné (opacity 0.2)
- Formulář poloprůhledný s backdrop blur
- fix: gift route přepsána z async transaction callbacku na array formu (Neon HTTP mode nepodporuje async callback)

## [2026-04-27] - Bugfixes a výkon

- Přidána `login()` funkce do GameContext (chyběla, způsobovala crash na login stránce)
- `claimLesson`: optimistický update přesunut až za úspěšný `assignPoints`
- ID generování: `Date.now()` → `crypto.randomUUID()` (points, gift, qr routes)
- `/api/game-state`: obaleno do try/catch, dříve unhandled rejection při DB chybě
- `catch {}` → `catch (err) { console.error(...) }` ve všech API routech
- Export CSV: fix pro Firefox (appendChild/removeChild)
- `lang="cs"` v layout.tsx
- `useMemo` na `GameProvider.value`, `activeQRs`, `teamRank`, `teammates`

## [2026-04-27] - URL routing

- Každá role má vlastní URL: `/play/<character-id>` (např. `/play/S007`)
- Login přesměruje na `/play/<id>`, refresh zachová session přes URL
- `GameProvider` přesunut do `app/layout.tsx` (sdílený přes všechny stránky)
- Odstraněny `currentScreen`, `navigate`, `login` z GameContext — routing řeší Next.js router
- Přidán `setCurrentUser` do GameContext pro inicializaci z URL parametru

## [2026-04-27] - Persist login přes refresh

- Login code uložen do `localStorage`, obnoven na mount
- Logout a neplatný code `localStorage` vymaže

## [2026-04-26] - Fix: polling interval stacking

- Zachycen interval ID do lokální proměnné v closure — cleanup nyní vždy vyčistí svůj vlastní interval
- Zabraňuje akumulaci paralelních polling smyček při re-renderech

## [2026-04-26] - Student: tab "Akce" → "Body", přidán log bodů týmu

- Tab přejmenován na "Body"
- Pod akčními dlaždicemi přibyl log posledních 30 záznamů bodů vlastního týmu (typ akce, poznámka, čas, barevná částka)

## [2026-04-26] - Refaktor: rozpad single-file prototypu

- `app/page.tsx` (2888 ř.) rozdělen do 25 souborů
- `lib/`: types.ts, data.ts, constants.ts, utils.ts, game-context.tsx
- `components/shared/`: badges, team-icon, toast, alarm-banner, top-bar
- `components/panels/`: scoreboard, point-assignment, transaction-log, charts, kaichi, miasma, alarm, qr, game-setup
- `components/views/`: login, gm-dashboard, teacher-dashboard, student-dashboard, display-screen
- CSS animace přesunuty do `globals.css`, Cinzel font načten přes CSS `@import`
- `app/page.tsx` redukován na Router + ErrorBoundary + AkanoApp (~80 řádků)

## [2026-04-26] - Tab Tým → Lidé, větší tab bar

- Tab "Tým" přejmenován na "Lidé" — zobrazuje všechny studenty seskupené po týmech + sekci Dospělí
- Tab bar: vyšší (72px), větší ikony (26px), roztažen přes celou šířku
- Odstraněn bar chart "přírůstky dle typu akce" z ChartsPanel

## [2026-04-26] - Žebříček: toggle tabulka/graf, odstraněn tab Graf

- Tab "Graf" odstraněn ze StudentDashboard
- Na záložce Žebříček přidán toggle (ikony) mezi tabulkovým a grafovým view
- Grafový view zobrazuje všechny týmy (bez filtru na jeden tým)
- Oprava: gift tile SheetTrigger způsoboval vnořené `<button>` — nahrazeno controlled open/close

## [2026-04-26] - StudentDashboard redesign — mobilní styl

- Header: větší jméno (1.9rem), body týmu dominantní (3.2rem), odebrán řádek jednotka/kruh
- Akce tab: 2 velké dlaždice (108px) místo formulářových karet; gift form přesunut do bottom sheet
- Scoreboard (student view): větší padding a body (1.7rem) pro čitelnější žebříček

## [2026-04-26] - Bug fixes a performance

- Opravena stale closure v `giftPoints` a `claimLesson` — `from`/`to`/`student` se čtou před `setCharacters`
- Lesson window se nyní automaticky zavře po vypršení timeru (`toggleLesson(false)`)
- `URL.createObjectURL` v exportu CSV nyní správně uvolněn přes `revokeObjectURL`
- `tick` interval odstraněn z `DisplayScreen` — hodiny extrahovány do `ClockDisplay` komponenty (zabrání zbytečnému re-renderu včetně `timeData` useMemo každou sekundu)
- `ALARM_COLORS` přesunuto na úroveň modulu (nebylo třeba vytvářet nový objekt při každém renderu)
- `sorted` v `GMDashboard` a `TeacherDashboard` obaleno do `useMemo`
