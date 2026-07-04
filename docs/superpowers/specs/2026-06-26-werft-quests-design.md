# Werft × Roadmap — "Quests" main game mode (design)

Date: 2026-06-26 · Status: **APPROVED — Phases 1+2 implemented (engine bridge + quest board)** · Decision: DEC-0014 follow-up; OQ-0013(c)
Reward model chosen by user: **Geld + Skill-Unlock ("learn it to build it")**.

**Resolved (user, 2026-06-26):** OQ-A → Werft is the **default landing** (`/` redirects to `/build`), roadmap
stays its own tab. OQ-B → **hard unlock** confirmed. OQ-C → direction arcs (11–12) map to team/direction
skills; the Capstone (10-05) and "Ship It" (13-04) are **Charter-tier keystones** (tier 6 / 7).

**Phase 1 shipped:** `content/werft/questMap.ts` (all 55 nodes → budget/skills/charterTier + `SKILL_QUEST`),
`features/buildgame/questBridge.ts` (`reconcileQuests`, idempotent), `GameState.questsClaimed`/`learned` (v9),
`canBuy` quest-gate, `BuildGamePage` reconciles from `useProgress`, SelectedPanel quest-lock notice, `/`→Werft.
**Phase 2 shipped:** `features/buildgame/QuestBoard.tsx` (the roadmap re-surfaced via `useRoadmap` — status +
"+N € · unlocks X" reward chips, tap → open the lesson), a **Quests** toolbar button + **J** keybind, SelectedPanel
**"Zur Lektion →"** deep-link, coach nudge to the quest loop, and nav cleanup (dropped redundant "Start"; Werft
leads). Tests: `werftQuests.test.ts` + quest-board render test. **Build green; 213/213.**
Next (deferred): balance/onboarding tuning (OQ-0013), maybe a "recommended next quest" in the coach, win state.

---

## 1. Goal

Unify the two halves of the app into one loop. The **roadmap lessons become quests** inside the
**Werft**; completing a node grants **budget** and **unlocks the matching Werft skill**. This closes
the long-standing gap (DEC-0013: the app trains judgment but never lets you *direct/build over time*)
and fixes the motivation gap (a neutral menu becomes "keep your AI system alive").

**The loop:**
> build → hit a wall (drift rising, no injection defense, can't scale) → the quest board points to the
> lesson that unlocks the fix → learn it → the skill unlocks + budget lands → build it → ship.

Learning becomes *instrumental*: you learn a thing because you need it to survive the next release.

### Non-goals
- Not deleting or rewriting any lesson content. Quests = the existing nodes, re-surfaced.
- Not forcing the game on learners who only want to study — the roadmap stays reachable standalone.
- Not auto-grading lessons differently; completion is the existing `completeNode`/`completeLesson`.

---

## 2. Core model

### 2.1 Single source of truth for "learned"
`ProgressContext` already owns node completion (persisted to localStorage). It stays the **authority**
for what's learned. The Werft **reads** progress; it does not duplicate it.

### 2.2 What a completed node grants
A node→reward map:

```ts
// content/werft/questMap.ts
interface QuestReward {
  skills?: BuildingId[]   // Werft skills this lesson unlocks (often 1, sometimes 2)
  budget: number          // one-time budget grant on completion
  charterTier?: number    // a few keystone/capstone nodes raise the Charter tier ceiling
}
export const QUEST_MAP: Partial<Record<RoadmapNodeId, QuestReward>>
```

- **Unlock** is derived live from progress: a *mapped* skill is buildable iff its quest node is
  completed. **Unmapped skills are the free "starter kit"** (always available) so the game is playable
  before any lesson (see §2.4).
- **Budget** is a *one-time* grant per node, tracked in `GameState.questsClaimed: string[]` so it's
  idempotent across reloads and never double-pays.

### 2.3 Mapping (proposed default — arc ≈ branch)
The Werft catalog was derived from this curriculum, so most nodes map 1:1. Representative table
(finalised in implementation; budgets are first-pass, see §4):

| Arc | Nodes → Werft skill(s) | Notes |
|---|---|---|
| 00 Foundations | 00-01, 00-02 → *(no skill)* | budget-only intro |
| 01 Augmented LLM | 01-01→`singlePrompt` · 01-03→`promptChain` · 01-02 *(judgment)* | |
| 02 Context | 02-01→`contextBudget` · 02-02→`noiseControl` · 02-03→`compression` · 02-04→`isolation` | clean 1:1 |
| 03 Tools | 03-01..03-04 → *(no direct skill)* | budget-only (Werft abstracts tools into agents/security) |
| 04 Control flow | 04-01→`workflow` · 04-02→`router` · 04-03→`orchestrator` · 04-04→`evaluatorOptimizer` · 04-05→`firstAgent`,`reactLoop` | |
| 05 Retrieval | 05-01→`rag` · 05-02→`keywordSearch`,`embeddings` · 05-03→`hybrid`,`reranking` · 05-04→`contextual` · 05-05 *(opt-depth)* | `vectorStore` is starter |
| 06 Memory/Docs | 06-01→`memoryMd`,`projectMemory` · 06-02→`decisionLog`,`featureLedger` · 06-03→`agentLearningLog` · 06-04→`idConvention` | |
| 07 Evals | 07-01→`evalHarness` · 07-02→`taskSuccess`,`regressionGate` · 07-03→`groundingEval` · 07-04→`traces`,`observability`,`postmortems` | `smokeTests` is starter |
| 08 Security | 08-01→`leastPrivilege` · 08-02→`approvalGate` · 08-03→`injectionDefense` (+`inputValidation`) · 08-04→`sandbox`,`governance` | |
| 09 Team/Repo | 09-01→`conventions` · 09-03→`sourceMaterialOs` · 09-04→`pod`,`directorPod` | |
| 10–13 Capstone/Direction/Delivery | → `briefDiscipline`,`oversight`,`decomposition`,`directorPod`; capstone `charterTier`+big budget | the "direction" payoff |

### 2.4 Starter kit (always available, no quest)
Foundational skills must be buildable from day one so the loop can start: `charter`, `soloDev`,
`scratchNotes`, `instructionsMd`, `smokeTests`, `keywordSearch`, `vectorStore`, `inputValidation`,
`singlePrompt`, `firstBee`. (Final list = every `BuildingId` not referenced in `QUEST_MAP`.)

---

## 3. Architecture

### 3.1 Bridge (read-only from progress)
`BuildGamePage` consumes `useProgress()`. A pure helper reconciles progress → game:

```ts
// features/buildgame/questBridge.ts
export const skillUnlocked = (b: BuildingId, completed: Set<RoadmapNodeId>): boolean =>
  !SKILL_QUEST[b] || completed.has(SKILL_QUEST[b])      // SKILL_QUEST = inverse of QUEST_MAP

/** Apply one-time budget (+ charterTier) for any newly-completed quest. Idempotent. */
export function claimQuests(s: GameState, completed: RoadmapNodeId[]): GameState
```

- On mount and whenever `completed` changes, `BuildGamePage` calls `setCs(prev => applyMissions(claimQuests(prev, completedIds)))`.
- `canBuy` gains an unlock check: `if (!skillUnlocked(b.id, completed)) return { ok:false, reason:'Quest nötig' }`.
  → `gameModel` stays pure; the completed-set is passed in (don't import ProgressContext into the model).

### 3.2 GameState change
Add `questsClaimed: string[]` (nodes whose budget was paid). Bump `GAME_VERSION` 8→9; `loadGame`
migration defaults it to `[]`. Reset (`resetGame`) clears `questsClaimed` (so the next reconcile
re-grants for already-completed nodes — a fresh game still benefits from prior learning; see §6).

### 3.3 Skill state on the canvas
The skilltree/`stateOf` gains a `locked-by-quest` visual: a mapped-but-unlearned skill renders
distinct from `locked` (tier-gated) — e.g. a small "Quest" tag + muted, and its SelectedPanel shows
**"Erst Quest „<node title>" abschließen"** with a button that routes to the lesson.

---

## 4. Reward tuning (principles, not final numbers)

- Budget per node scales with **arc depth** (deeper concepts pay more): ~`12 + arcIndex*6`, capstone
  nodes a large lump. Keep the *total* questable budget in line with what the current passive economy
  yields over a comparable play session so quests feel meaningful but the sim is still self-sustaining.
- Unlock is the *primary* reward; budget is the lubricant. A node that unlocks a high-impact skill
  (RAG, injectionDefense, orchestrator) needs less budget than a judgment-only node (which has no
  unlock, so budget is its whole payoff).
- Balance is coupled to lesson count now — keep `QUEST_MAP` + budgets in one file for easy tuning, and
  treat the numbers as playtest-driven (OQ-0013).

---

## 5. UI / IA

### 5.1 Quest board (the roadmap, re-surfaced in the Werft)
- A "Quests" surface reachable from the Werft (a HUD button / a tab in the Details drawer, or a
  dedicated panel). Reuse `RoadmapArcSection`/`RoadmapNodeCard` rendering; add a reward chip per node:
  **"+N € · schaltet <Skill> frei"** (or "✓ erledigt"). Tapping a node opens the existing lesson route.
- The board groups by arc (= branch), so "what do I learn next" reads as "what can I build next."

### 5.2 Werft as the main mode (hub)
- Werft becomes the prominent entry / "campaign". The **coach** already names needs ("Drift frisst
  deine Abwehr…"); extend it to **point at the unlocking quest** ("→ Quest „Decision Logs" schaltet die
  Docs-Linie frei"). When a player taps a quest-locked skill, the panel deep-links to its lesson.
- The roadmap stays reachable as its own nav tab (study-only path preserved).
- Decision still open for the spec review: does the Werft *replace* the current home, or sit beside the
  roadmap as a co-equal top tab? (Recommend: Werft is the featured/home surface, roadmap remains a tab.)

### 5.3 Return flow
Finishing a lesson → existing completion → on returning to the Werft, the reconcile fires: budget toast
("Quest erledigt: +N €, <Skill> freigeschaltet"), the skill flips from quest-locked to available, and
the coach advances.

---

## 6. Edge cases

- **Reset semantics:** resetting the *Werft* must NOT wipe lesson progress (separate stores). A reset
  game re-derives unlocks from progress and re-claims quest budget (fresh start, but your learning
  still counts). Resetting *progress* (study reset) re-locks mapped skills — acceptable + rare.
- **Dev-unlock** (FL-0033, locked-but-playable nodes): if a player opens a dev-unlocked node and
  completes it, it grants normally — fine.
- **Multi-skill nodes** (e.g. 05-02 → keyword+embeddings): unlock all listed skills, budget once.
- **Skills with no node:** always available (starter kit) — never quest-locked.
- **Nodes with no skill** (intro/tools/judgment/direction): budget-only; never block building.
- **Ordering:** unlock respects the Werft's own prerequisite + tier gates *on top of* the quest gate
  (you still need the prereqs/tier even after the quest unlocks the skill).

---

## 7. Testing

- `questBridge.test.ts` (pure): `skillUnlocked` (mapped locked until node complete; starter always
  true); `claimQuests` grants budget once + is idempotent + applies charterTier; reset re-claims.
- `gameModel`: `canBuy` returns `Quest nötig` for a mapped-unlearned skill; ok once completed.
- Integrity: every `QUEST_MAP` skill id exists in `BUILDINGS`; every mapped node id exists in the
  roadmap; starter-kit ∪ mapped = all buildings (no skill is both unreachable and unmapped).
- Render: completing a node (mock progress) shows the budget toast + flips the skill to available; the
  quest board lists nodes with reward chips.

---

## 8. Phased implementation (for the plan step)

1. **Bridge + gating (engine):** `QUEST_MAP`, `questBridge.ts`, `GameState.questsClaimed` (v9),
   `canBuy` unlock check, `claimQuests` reconcile wired into `BuildGamePage`. Tests. *(playable: learning
   now funds + unlocks the game, even before any new UI.)*
2. **Skill visuals:** quest-locked state on the canvas + SelectedPanel "do the quest" deep-link + toast.
3. **Quest board:** the roadmap re-surfaced in the Werft with reward chips.
4. **Hub/IA + coach:** Werft as featured mode; coach points at unlocking quests.
5. **Tune** budgets/`QUEST_MAP` by playtest.

---

## 9. Open questions (for review)

- OQ-A: Werft as the literal home, or featured tab beside the roadmap? (recommend: featured, roadmap
  stays a tab.)
- OQ-B: Should *some* skills be hard-gated by quests even if the player has budget (the chosen model
  already does this for all mapped skills) — confirm that's desired vs. "unlock = discount, still
  buildable." (chosen model = hard unlock; this section just flags the knob.)
- OQ-C: Capstone/direction arcs — map to team/direction skills (as proposed) or treat as pure
  budget+charterTier milestones?
