# AICHITECT — AI Engineering Flight Deck

[![CI](https://github.com/ebuart/AICHITECT/actions/workflows/ci.yml/badge.svg)](https://github.com/ebuart/AICHITECT/actions/workflows/ci.yml)

A gamified, mobile-first PWA that teaches **AI-native system architecture** — the durable senior skills of *decomposing, directing, judging, and curating* AI systems, not prompt tricks that the next model generation erases.

Think roadmap.sh × TryHackMe × Plague Inc., for AI engineering.

> **Language:** lesson content is German-first (the app chrome has a DE/EN toggle; an English content translation rolls out arc by arc). This README is English so you can judge the engineering either way.

## What's inside

- **54-node curriculum graph** across 14 arcs — Foundations, Context Engineering, Tool Boundaries, Agents & Control Flow, Retrieval, Memory, Evals & Observability, Security & Governance, Repo Architecture, a Capstone, and a three-arc **Direction track** (briefing, decomposing, triaging, and accepting the work of agent swarms — the PM/tech-lead half of AI engineering that's rarely taught).
- **53 hands-on lessons, zero multiple-choice filler.** Every lesson is bespoke exercises over concrete material: fill a real tool JSON schema, order a token-budget cut, spot the injected line in a PR description, judge a decoding trace token by token, mark ungrounded claims against sources, accept or send back an agent's delivery.
- **19 interactive lab engines** (pure scoring logic + a React board each): context allocator, trust-boundary placement, incident triage, pipeline builder, eval designer, security incident room, repo refactor, capstone simulator, and more.
- **The Werft** — a real-time strategy build-game over an AI system. Buy and place ~50 skills along the six phases of an LLM request (boundary → knowledge → model → tools → check → ops); drift and tech-debt erode your release defense while auto-releases test it. Completing roadmap lessons unlocks skills in the game — learn it to build it.
- **Review & mastery** as a pure projection of progress (spaced queue, repair missions) — no XP, no streaks.

## Engineering

| Area | How it's built |
|---|---|
| Stack | React 19, TypeScript (max-strict), Vite 7, Tailwind v4, PWA |
| Architecture | Feature folders; pure domain logic separated from rendering everywhere (`roadmapStatus`, `gameModel`, scoring engines are React-free and unit-tested) |
| Content as data | The whole curriculum — graph, lessons, lab scenarios — is typed data; a registry maps scenarios to engines, so new content needs no new UI |
| Persistence | Local-first behind a `StorageAdapter` boundary (swap to IndexedDB/Supabase without touching call sites) |
| Quality gates | 221 tests: pure scoring, render smokes, persistence round-trips, full unlock-chain traversal — and **executable content-quality rules** (see below) |
| Performance | Route-level code splitting; ~110 kB gz initial JS; service worker |
| Tooling | ESLint (typescript-eslint + react-hooks v7), GitHub Actions CI (lint + strict build + tests) |

### Pedagogy as CI

The most unusual part of the codebase: editorial standards are enforced as failing tests, not intentions. `tests/contentQuality.test.ts` bans lazy distractors ("model too small", "prompt too short"), verdict-announcing option labels, and AI-slop phrasing across every scenario in the registry — so a future content pass can't quietly reintroduce a giveaway answer. Direction-track pedagogy (which move *should* win each scenario) is asserted in `tests/directionScenarios.test.ts`.

### Built by directing AI — deliberately

This project was built by directing Claude Code, and that's the point: the app teaches exactly the workflow that built it. The control plane lives in [`/source_material`](source_material/) — a project contract, non-goals, build principles, quality gates, a decision log, a feature ledger, and open questions, all ID-referenced (`PC-002`, `LR-011a`, `DEC-0014`) so rules survive across sessions and agents. The curriculum's "doc control plane" cluster teaches the same system.

## Run it

```bash
npm ci
npm run dev        # localhost:5173
npm test           # vitest, 221 tests
npm run build      # tsc -b (strict) + vite + PWA
npm run lint
```

## Status

- Curriculum, labs, review loop, and the Werft are feature-complete and green; balance numbers in the game are first-pass pending device playtests.
- Deployment: Vercel-ready, not yet live.
- English content translation: mechanism shipped (chrome toggle), lesson translation rolling out arc by arc.

## License

[MIT](LICENSE) — © Maximilian Voigt
