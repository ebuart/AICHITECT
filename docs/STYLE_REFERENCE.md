# Brutalist B/W — Style Reference

A portable design system you can drop into a new project (Tailwind v4 + React assumed, but the
ideas are framework-agnostic). This is the system used across the "AI Engineering Flight Deck" app.

---

## 1. Philosophy

- **Pure black & white.** One background, one ink, **exactly one working grey**. No palette beyond that
  except rare, thin status hues.
- **Borders and geometry ARE the design.** Structure comes from hairline borders and layout, not from
  fills, shadows, or color. A "card" is just background + a 1px border.
- **Flat, strictly 2D.** No blur, no shadow, no gradient, no glow. (Bonus: dropping `backdrop-blur`
  removed real mobile lag.)
- **Zero radius.** Sharp corners everywhere. (Circles via `rounded-full` are the only exception.)
- **Two typefaces, with meaning:** a grotesque/sans to **read**, a monospace ("typer") for anything
  you **click** and for **code**. The mono face is the "voice of interaction."
- **Active = inversion.** The selected/active state is a white block with black text (and it flips in
  light mode). No accent color needed.
- **Color is rationed.** Status hues (success/warning/danger) appear as **thin border + text only**,
  and ideally only **on reveal** (after an answer/event), never as big fills.

---

## 2. Tokens (Tailwind v4 `@theme`) — copy/paste

```css
@import 'tailwindcss';

@theme {
  /* palette — black, white, exactly ONE working grey */
  --color-deck-bg: #000000;
  --color-deck-surface: #000000;       /* a card is bg + a hairline; no real fill */
  --color-deck-surface-2: #0b0b0b;     /* nested panel, barely separated */
  --color-deck-border: #ffffff;        /* stark hairline = primary structure */
  --color-deck-border-dim: #333333;    /* THE one grey — secondary divisions */
  --color-deck-accent: #ffffff;        /* active = inversion */
  --color-deck-muted: #8a8a8a;         /* secondary text */

  /* state — rare, thin, BORDER + TEXT only */
  --color-deck-success: #58e08a;
  --color-deck-warning: #e8c24a;
  --color-deck-danger:  #f25a5a;
  --color-deck-locked:  #444444;

  /* zero radius everywhere */
  --radius-deck: 0px; --radius-xs: 0px; --radius-sm: 0px; --radius-md: 0px;
  --radius-lg: 0px;   --radius-xl: 0px; --radius-2xl: 0px; --radius-3xl: 0px;

  /* type — grotesque to READ, monospace to CLICK / for code */
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-typer: ui-monospace, 'SF Mono', 'JetBrains Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
}

:root { color-scheme: dark; }

html, body, #root { height: 100%; }

body {
  margin: 0;
  background-color: var(--color-deck-bg);
  color: var(--color-white);          /* flips to ink under .theme-light */
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* The typer face is the voice of anything you click, and of code. */
button, a, [role='button'], select, input, textarea, code, pre, kbd, samp {
  font-family: var(--font-typer);
}
```

In markup the tokens are used as `bg-deck-bg`, `border-deck-border`, `text-deck-muted`,
`border-deck-success`, etc. Plain `text-white` / `bg-white` / `text-black` are used freely too — see
light mode for why that's safe.

---

## 3. Light mode — one block, zero per-component work

Because the whole app is black/white **tokens**, and Tailwind v4 compiles `bg-white`/`text-white`/etc.
to `var(--color-white)` / `var(--color-black)`, you invert the entire app by re-pointing those two
variables plus the deck tokens under one root class. No component edits.

```css
html.theme-light {
  color-scheme: light;
  --color-white: #000000;   /* "ink"  — text-white/border-white/bg-white now resolve to black */
  --color-black: #ffffff;   /* "paper"— text-black/bg-black now resolve to white */
  --color-deck-bg: #ffffff;
  --color-deck-surface: #ffffff;
  --color-deck-surface-2: #f1f1f1;
  --color-deck-border: #000000;
  --color-deck-border-dim: #c9c9c9;
  --color-deck-accent: #000000;
  --color-deck-muted: #5f5f5f;
  --color-deck-success: #1f9d57;   /* state hues darkened for contrast on white */
  --color-deck-warning: #8a6d0a;
  --color-deck-danger:  #cc2f2f;
}
```

Toggle by adding/removing `theme-light` on `<html>` and persisting the choice:

```ts
export const applyTheme = (t: 'dark' | 'light') =>
  document.documentElement.classList.toggle('theme-light', t === 'light')
// call before first paint to avoid a flash; persist to localStorage.
```

> Caveat: anything that hard-codes a hex (e.g. an SVG `stroke="#fff"`) will NOT flip. Use a token
> class instead — Tailwind has `stroke-deck-border`, `fill-deck-accent`, etc. for SVG.

---

## 4. Typography rules

- **Sans (`font-sans`)** = reading: prose, lesson text, descriptions, headings.
- **Typer (`font-typer`, mono)** = interaction + data: buttons, labels, KPIs, code, node chips, tags,
  anything tabular. It's applied automatically to `button/a/input/...` via the base CSS.
- Sizes run small and tight. The working scale (Tailwind arbitrary px):
  `text-[9px]` (micro labels) · `text-[10px]`/`text-[11px]` (typer labels, chips) · `text-[12px]`/
  `text-[13px]` (body) · `text-sm`/`text-base` (panel titles) · `text-lg`–`text-xl` (page titles).
- Labels are usually `uppercase tracking-wide` (or `tracking-widest` for section heads) in muted text.
- Use `tabular-nums` for any changing number (counters, budgets, stats) so they don't jitter.

---

## 5. Color usage rules

| Need | Do |
|---|---|
| Primary structure / separation | `border border-deck-border` (white hairline) |
| Secondary / quiet division | `border-deck-border-dim` (the one grey) |
| Secondary text | `text-deck-muted` |
| Active / selected / "on" | **invert**: `bg-white text-black` (or a `ring`) |
| Success / warning / danger | **border + text only**: `border-deck-success text-deck-success` — never a big fill |
| Disabled / locked | `border-deck-border-dim text-deck-muted opacity-50` |

Status color appears sparingly and ideally only after a reveal (answer submitted, event fired). Avoid
filled colored buttons; prefer a colored hairline + colored text.

---

## 6. Component recipes (class strings)

**Card / panel** — the base primitive (bg + hairline, no fill):
```html
<section class="flex flex-col gap-1.5 border border-deck-border bg-deck-surface p-2.5">…</section>
```
Section title inside a card:
```html
<h2 class="font-typer text-[10px] uppercase tracking-widest text-deck-muted">Title</h2>
```

**Segmented toggle** (active = inversion):
```html
<button class="flex-1 border px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide transition-colors
  border-white bg-white text-black">Active</button>
<button class="flex-1 border px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide transition-colors
  border-deck-border-dim text-deck-muted hover:border-white hover:text-white">Idle</button>
```

**Primary action button** (outline → fills white on hover):
```html
<button class="border border-white px-3 py-1.5 font-typer text-[11px] uppercase
  text-white transition-colors hover:bg-white hover:text-black">Do it</button>
```

**KPI / readout** (label above value; mono; tabular):
```html
<div class="flex flex-col">
  <span class="text-[9px] uppercase tracking-wide text-deck-muted">Budget</span>
  <span class="text-lg font-bold tabular-nums text-white">128 €</span>
</div>
```

**Meter / bar** (hairline track + white fill):
```html
<div class="h-1.5 border border-deck-border-dim">
  <div class="h-full bg-white" style="width: 64%"></div>
</div>
```

**Status chip / tag** (thin colored hairline):
```html
<span class="border border-deck-success px-2 py-0.5 font-typer text-[10px] text-deck-success">+4 Qual</span>
```

**Selected node / item** (full inverse + ring — unmistakable on either theme):
```html
<button class="border z-10 border-white bg-white text-black ring-2 ring-deck-accent
  ring-offset-2 ring-offset-deck-bg">…</button>
```

**Modal / overlay** (centered box, click-backdrop to close, no blur):
```html
<div class="absolute inset-0 z-40 flex items-center justify-center p-4" onClick={close}>
  <div class="max-h-[82%] w-[min(460px,94vw)] overflow-y-auto border border-deck-border
    bg-deck-bg p-4" onClick={stop}>…</div>
</div>
```

**Fullscreen overlay HUD** (canvas fills; controls float; gaps stay draggable):
- Wrapper: `relative h-full w-full overflow-hidden`.
- Each floating cluster: a positioned box (`absolute left-2 top-2 …`) with a solid `bg-deck-bg` and a
  hairline. Make the wrapper `pointer-events-none` and the actual panels `pointer-events-auto` so the
  empty gaps pass touches through to the canvas behind.

**KNIME-style node** (for graph/canvas UIs): a small `bg-deck-bg` chip with a hairline, a 2×2px status
"light" (`bg-deck-success` built / `bg-deck-warning` partial / `border border-white` available /
`border-deck-border-dim` locked), optional level "pips" (`h-1.5 w-2 border`), and tiny side "ports".
Wires are one SVG of orthogonal **elbow paths** (`M…L…L…L…`), white + animated stroke when both ends
are active, dim dashed when not. Use `stroke-deck-border` / `stroke-deck-border-dim` (token classes, so
they flip in light mode).

---

## 7. Spacing, sizing, geometry

- **Borders are 1px hairlines.** Don't thicken borders for emphasis — invert or add a `ring` instead.
- **Gaps** small: `gap-1`/`gap-1.5`/`gap-2`/`gap-3`. Card padding `p-2`–`p-3`.
- **Zero radius** (tokens force it). Circles only via `rounded-full`.
- Dense grids: `grid grid-cols-2 … lg:grid-cols-4` for control decks; collapse to fewer columns on
  mobile. Equal-height cards via flex `justify-between`.
- Tap targets: `min-h-9` (~36px) for header controls, `min-h-12` for bottom-tab items.
- Respect iOS safe areas: `pb-[env(safe-area-inset-bottom)]` on fixed bottom bars.

---

## 8. Motion

Sparse and purposeful. Default to **none**; animate only to signal live state.

- **Color transitions:** `transition-colors` (≈150ms) on interactive elements and animated wires
  (`transition-[stroke] duration-500`).
- **Ambient "alive" cues** (used while a clock/sim runs): a faint **breathing dot grid** and a very
  subtle **lane pulse**. Both gate on an `isRunning` flag and respect reduced motion:

```css
.deck-dots {                 /* dotted "paper" */
  background-image: radial-gradient(currentColor 1.4px, transparent 1.9px);
  background-size: 28px 28px; color: var(--color-deck-border-dim); opacity: 0.16;
}
@keyframes deck-breathe {    /* CENTERED: scale from the middle, no directional drift */
  0%,100% { opacity: 0.12; transform: scale(1); }
  50%     { opacity: 0.46; transform: scale(1.06); }
}
.deck-dots-anim { transform-origin: center; animation: deck-breathe 5s ease-in-out infinite; }

@keyframes deck-lane-pulse { 0%,100% { opacity: 0.02; } 50% { opacity: 0.07; } }  /* ≈1/6 distraction */
.deck-lane-pulse { animation: deck-lane-pulse 6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .deck-dots-anim, .deck-lane-pulse { animation: none; }
}
```

Lessons learned tuning these: keep ambient animation **slow** (5–6s) and **faint** (peak opacity well
under 0.5 for a full-bleed layer, ~0.07 for accent bands); breathe from **center** (a directional
`background-position` drift reads as "sliding," not "breathing").

---

## 9. Interaction gotchas worth keeping

- **Custom pan/zoom/drag canvas:** do tap-selection on `pointerup` (recorded down-target + a small
  move threshold), NOT the native `click`. Capturing a pointer onto an ancestor (for robust dragging)
  retargets the synthesized click away from the node, so `onClick` silently never fires — worst on
  touch. Keep `onClick` only as a convenience/test path.
- **Fit-to-view once per mount,** not on every size change — re-fitting on content changes yanks the
  camera. Remount (`key=`) when you genuinely want a fresh fit.
- **Functional state updates** (`setState(prev => …)`) for anything that can fire while a timer/loop is
  also updating the same state, to avoid stale-closure double-spends.
- **Selected state must be readable:** an inversion (`bg-white text-black`) beats a same-color ring —
  a white ring on a white border is invisible.

---

## 10. Minimal starter

`index.css` = sections 2 + 3 + 8 above. Then build everything from the **card** primitive (section 6),
reach for **inversion** for "active," and ration the **status hues** to thin borders on reveal. If it
needs a shadow, a gradient, or a second accent color — it's off-system.
