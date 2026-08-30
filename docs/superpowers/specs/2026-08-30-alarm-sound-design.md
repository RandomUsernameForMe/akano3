# Alarm zvuk — design

Datum: 2026-08-30. Schváleno v konverzaci.

## Cíl
Při aktivaci alarmu (tlačítko v adminu → `POST /api/alarm`) se na všech zařízeních s otevřenou aplikací ozve siréna. Hraje ve smyčce, dokud admin nedá dismiss.

## Co už existuje (beze změny)
- `alarm_state` v DB, `POST /api/alarm` trigger/dismiss
- Polling `/api/game-state` každé 2 s v `lib/game-context.tsx` → latence ≤ 2 s
- `AlarmBannerStrip` (vizuální banner) v `components/shared/alarm-banner.tsx`

## Změna
Jen `components/shared/alarm-banner.tsx`:

1. Modulový `AudioContext`, vytvořený/resumnutý při prvním `pointerdown` kdekoli na stránce (obejití autoplay policy; login klik stačí).
2. Hook `useAlarmSound()` uvnitř `AlarmBannerStrip`: sleduje `alarmState.active` z `useGame()`.
   - `active === true` a audio odemčené → spustí sirénu (WebAudio oscilátor + LFO sweep, žádný soubor).
   - `active === false` → stop.
   - Odemčení audia až po startu alarmu → siréna naskočí hned po odemčení (effect závisí i na unlocked stavu).

Žádná změna API, DB, pollingu. Žádný audio asset.

## Edge cases
- Zařízení bez jediného kliknutí od načtení stránky: banner ano, zvuk ne (prohlížeč nepovolí). Provozně: po zapnutí jednou ťuknout do stránky.
- Background tab / uspaný displej: polling škrcen. Provozně: tab v popředí, neuspávat displej.

## Ověření
Trigger z adminu → do 2 s houká na všech otevřených zařízeních (s předchozím klikem), dismiss → ticho. `npm run build` projde.
