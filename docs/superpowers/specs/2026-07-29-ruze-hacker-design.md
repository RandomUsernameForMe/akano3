# Růže hacker update — design spec

Date: 2026-07-29 · Status: approved by user
Builds on: 2026-07-29-role-themes-design.md (deferred section)

## Character

Růže is an in-game hacker: a student who "overrode her permissions" and can
award points to other students. UI is deliberately cool, not realistic.

## Aesthetic — hybrid "A+C" (user-approved via mockups)

- **Base (A, "průnik"):** her screen is the student bone-paper view, with the
  hack leaking through — glitch title, `ACCESS: OVERRIDE` chip, torn card
  corners, pink accents.
- **Hack surfaces (C, "ovládnutí"):** the point-giving tool is a full dark
  terminal takeover — near-black `#12040C` sheet, hot pink neon, code rain,
  `EXECUTE` button. Escalation from paper to terminal is the story.

## Palette (deliberately outside the DS four-ink palette — alien element)

- Hot magenta `#FF2E88` — borders, chips, glitch shadows, large/bold text only
  (fails AA as small text on paper)
- Deep rose (AA on paper, exact value verified computationally ~`#C2185B`) —
  `--c-accent` override for small text
- Hack surface: bg `#12040C`, text `#FF6FA5`
- Tokens: `--pink-hot`, `--hack-bg`, `--hack-text` under `.theme-ruze`

## Mechanics

- Targets: individual students only. Amount: ±5 per action. No daily cap.
- POST `/api/points` with `sourceRole:"ruze"`; server guard rejects
  non-student targets and |amount| > 5 for ruze source (400).
  Note: API has no real auth (client-claimed role) — guard is consistency,
  not security; documented in code.

## Log masquerade (teacher/GM view)

Entries with `sourceRole === "ruze"` display a **random teacher** as source
(deterministic hash of entry id → stable across renders/devices), teacher
badge. The row **occasionally glitches pink** (CSS long-cycle keyframe,
~6% of the time) briefly revealing „RŮŽE" styling. Single logic for all
viewers; GM knows glitch = Růže. No data changes — masquerade is purely
presentational.

## Components

- `.theme-ruze` class in globals.css (light student base + pink overrides +
  glitch utilities: glitch title, torn clip-path, scanlines, keyframes)
- Character router: `role "ruze"` → `theme-ruze`
- New `components/views/ruze-dashboard.tsx`: pink override header +
  `<StudentDashboard/>` base + hack button + `RuzeHackSheet` terminal form
  (student select, ±5 stepper, EXECUTE)
- Remove `RuzeDashboard` alias from teacher-dashboard.tsx
- transaction-log.tsx: masquerade rendering for ruze rows

## Out of scope

- Real API auth
- Any student-feature changes she inherits
