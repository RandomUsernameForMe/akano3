# Per-role visual themes — design spec

Date: 2026-07-29 · Status: approved by user

## Goal

Every screen follows the Akano3 design system (four-ink poster palette: oxblood ·
teal · sand · ink · bone), and each role gets a visually distinct ground so
student / teacher / GM / display are unmistakable at a glance.

## Decision: theme classes (option A — "four inks, four roles")

Mechanism mirrors the existing `.dark` class: each theme is a CSS class in
`app/globals.css` that redefines both the shadcn semantic tokens
(`--background`, `--card`, `--primary`, …) and the `--c-*` inline-style tokens.
`game-page.tsx` (the shell that wraps every role dashboard) applies the class
based on `char.role`. Components auto-adapt; no per-component role logic.

| Theme class  | Role(s)              | Ground                    | Card        | CTA / primary          |
|--------------|----------------------|---------------------------|-------------|------------------------|
| `:root`      | student, růže (temp) | bone paper `#F4ECDF`      | `#FBF7F0`   | oxblood `#701010`      |
| `.dark`      | display, login       | oxblood night `#3A0808`   | `#520C0C`   | sand `#E0B080`         |
| `.theme-teal`| teacher              | teal-900 `#0A4A4A`        | `#0C5F5F`   | sand `#E0B080`         |
| `.theme-ink` | GM                   | ink-800 `#141210`         | `#2A2622`   | oxblood-400 `#C24A3E`  |

Rejected alternatives: inline per-role style objects (token drift, duplication);
separate stylesheets per role (overkill for 4 themes × ~20 vars).

## Palette normalization (all screens)

Legacy pre-DS hex is replaced with DS tokens everywhere:

- `#6b0f1a` (old oxblood) → `--c-accent` / `#701010`
- `#2a8a8a` (old teal) → DS teal scale (`#108080` etc.)
- `#c0392b` (old red) → `--destructive`
- `#fff` cards → `--c-bg-card`
- cool-mint gradients → flat theme grounds

**Exception — gold stays.** `#d4a017` / `#e8c65a` (lesson stars, display
loading bar) is a deliberate reward accent outside the four-ink palette.
User decision: sand is too dull for reward moments.

Team colors (`t.color` on scoreboards/charts) are data-driven and untouched.

## Contrast requirement

All text/background pairs in each theme must pass WCAG AA (≥ 4.5:1 normal
text), verified computationally as done for login.

## Per-screen work

| Screen                | Work                                                       |
|-----------------------|------------------------------------------------------------|
| `game-page.tsx`       | shell: apply role theme class, flat role ground, kill mint gradient |
| `student-dashboard.tsx` | biggest: ~50 stray hex → tokens, bone-paper look, print shadows |
| `teacher-dashboard.tsx` | runs under `.theme-teal`; fix stray old-teal hex          |
| `gm-dashboard.tsx`    | runs under `.theme-ink`; fix stray hex                     |
| `display-screen.tsx`  | minor: normalize stray hex (keep gold)                     |
| Růže (`RuzeDashboard`)| student theme for now; own identity deferred to a separate update (see below) |

## Deferred: Růže update (separate spec, right after this migration)

Direction agreed 2026-07-29; NOT part of this migration:

- **Character:** Růže is an in-game hacker who "overrode her permissions" —
  a student who can also award points to other students.
- **UI:** hybrid between student and teacher — student dashboard plus a
  point-giving capability.
- **Theme:** rose/pink color identity (`.theme-ruze` on top of the theme
  system this spec builds).
- **Aesthetic:** rugged / torn-apart / hacked look — glitch effects, torn
  edges, code spilling out. Deliberately cool, not realistic.
- Gets its own brainstorm round (visual mockups of glitch variants) + spec.

## Out of scope

- Růže's own theme/content (deferred above)
- Login (already migrated, commit 50e3048)
- Any logic/data changes — purely visual
