// Build-Sim ("Werft") — a deep, persistent base-builder over your AI system. You earn Budget,
// buy/upgrade ~50 SKILLS across seven branches (docs / retrieval / context / agents / evals /
// security / team), each a prerequisite chain that EVOLVES (e.g. scratch notes → split into
// instructions.md + memory.md → decision log → [XXX-000] convention → Source-Material-OS). A
// Charter "town hall" gates depth by tier. Crucially there are dynamic WORLD VARIABLES that
// create needs: drift + tech-debt erode your release defense and only the right skills hold them
// down, and scale grows every release so you must build orchestration/observability/governance to
// keep up. Shipping a release is the risky "raid". All logic here is pure + unit-tested.

import { isQuestSkill } from '@/content/werft/questMap'

export type Stat = 'quality' | 'security' | 'velocity' | 'resilience'
export type Var = 'drift' | 'debt' | 'scale' // drift/debt = bad (mitigated by skills); scale handling
export type Branch = 'docs' | 'retrieval' | 'context' | 'agents' | 'evals' | 'security' | 'team'
export type Category = 'docs' | 'layers' | 'team'
// Phases of an LLM request, left→right. Placing a skill in the RIGHT phase is the real lesson:
// validate at the boundary, retrieve before the model, gate before the tool, eval after the model,
// observe across everything.
export type Zone = 'boundary' | 'knowledge' | 'model' | 'tools' | 'check' | 'ops'

export interface Building {
  id: string
  name: string
  branch: Branch
  /** Depth in its branch (1..N) = the Charter tier required + the skill-tree row. */
  depth: number
  blurb: string
  requires?: string[]
  /** Stat bonus PER LEVEL (cumulative). */
  effect: Partial<Record<Stat, number>>
  /** Per-level mitigation: drift/debt = growth-per-release reduced; scale = scale handled. */
  resist?: Partial<Record<Var, number>>
  maxLevel: number
  baseCost: number
}

/** A live event bubble (Plague-Inc style): a weakness surfaced as something the player can tap to
 *  handle before it expires. */
export interface ActiveEvent {
  id: string
  born: number
  deadline: number
}

export interface GameState {
  budget: number
  xp: number
  releases: number
  cleanReleases: number
  levels: Record<string, number>
  drift: number
  debt: number
  scale: number
  trust: number
  missionsDone: string[]
  /** Refactor-and-restart count — each prestige grants a permanent legacy bonus. */
  prestige: number
  /** Which request-pipeline PHASE (lane) the player dropped each owned skill into (id → zone). */
  placed: Record<string, Zone>
  /** In-game day — time advances on its own while the clock runs (Plague-Inc loop). */
  day: number
  /** Live event bubbles awaiting the player's response. */
  events: ActiveEvent[]
  /** Roadmap nodes whose one-time quest budget has been granted (idempotency). */
  questsClaimed: string[]
  /** Quest-gated skills the player has UNLOCKED by completing the matching lesson. */
  learned: string[]
  log: string[]
  version: number
}

export const GAME_VERSION = 9
export const CHARTER_ID = 'charter'
const BASE: Record<Stat, number> = { quality: 8, security: 8, velocity: 8, resilience: 8 }
const clamp = (n: number) => Math.max(0, Math.min(100, n))

export const BRANCH_LABEL: Record<Branch, string> = {
  docs: 'Docs / Control Plane',
  retrieval: 'Retrieval',
  context: 'Context',
  agents: 'Agents & Control Flow',
  evals: 'Evals & Observability',
  security: 'Security & Governance',
  team: 'Team & Direction',
}
export const categoryOf = (b: { branch: Branch }): Category =>
  b.branch === 'docs' ? 'docs' : b.branch === 'team' ? 'team' : 'layers'

export const CHARTER: Building = {
  id: CHARTER_ID,
  name: 'Projekt-Charter',
  branch: 'docs',
  depth: 0,
  blurb: 'Contract + Non-Goals: die autoritativen Leitplanken. Sein Level ist dein Tier — höher schaltet tiefere Skills frei und hält Drift nieder.',
  effect: { resilience: 4 },
  resist: { drift: 1 },
  maxLevel: 7,
  baseCost: 70,
}

// Compact DSL for authoring the catalog.
type Opts = { req?: string[]; resist?: Partial<Record<Var, number>>; max?: number; cost?: number }
function mk(
  id: string,
  name: string,
  branch: Branch,
  depth: number,
  effect: Partial<Record<Stat, number>>,
  blurb: string,
  o: Opts = {},
): Building {
  return { id, name, branch, depth, blurb, effect, requires: o.req, resist: o.resist, maxLevel: o.max ?? 2, baseCost: o.cost ?? 14 + depth * 9 }
}

export const BUILDINGS: Building[] = [
  // ── DOCS / CONTROL PLANE — the .md line that evolves toward Pod-based SE (drift control) ──
  mk('scratchNotes', 'Scratch-Notizen', 'docs', 1, { resilience: 2 }, 'Eine einzige memory.md, in der alles landet — besser als nichts, aber ungeordnet.', { resist: { drift: 1 }, max: 1 }),
  mk('instructionsMd', 'instructions.md', 'docs', 2, { quality: 3 }, 'Die Regeln raus aus dem Gekritzel in ein eigenes Dokument — der Agent weiß, was gilt.', { req: ['scratchNotes'], resist: { drift: 2 } }),
  mk('memoryMd', 'memory.md (aufgeteilt)', 'docs', 2, { resilience: 3 }, 'Zustand getrennt von Regeln — durabler Arbeitsstand, der nicht mit den Regeln kollidiert.', { req: ['scratchNotes'], resist: { drift: 2 } }),
  mk('decisionLog', 'decisions.md (Decision Log)', 'docs', 3, { resilience: 3 }, 'Das Warum hinter Entscheidungen — Fragen werden nicht ewig neu aufgerollt.', { req: ['instructionsMd'], resist: { drift: 3 } }),
  mk('featureLedger', 'Feature Ledger', 'docs', 3, { velocity: 3 }, 'Was schon gebaut ist, kompakt — ohne den Code zu lesen.', { req: ['memoryMd'], resist: { drift: 2 } }),
  mk('openQuestions', 'Open Questions', 'docs', 4, { resilience: 2 }, 'Ungeklärtes bleibt sichtbar statt unterzugehen.', { req: ['decisionLog'], resist: { drift: 2 } }),
  mk('projectMemory', 'Project Memory', 'docs', 4, { resilience: 3, velocity: 2 }, 'Durabler Zustand: jede Session hat einen klaren Wiedereinstieg.', { req: ['featureLedger'], resist: { drift: 3 } }),
  mk('idConvention', '[XXX-000]-Konvention', 'docs', 5, { velocity: 4, quality: 2 }, 'Schluss mit Bullet-Points: jede Regel/Entscheidung bekommt eine stabile ID ([SEC-014]) — referenzierbar, auffindbar, diffbar.', { req: ['decisionLog', 'featureLedger'], resist: { drift: 4 } }),
  mk('agentLearningLog', 'Agent Learning Log', 'docs', 6, { velocity: 4, quality: 2 }, 'Wiederkehrende Fehler werden zu Regeln — der Schwarm verbessert sich über Läufe.', { req: ['projectMemory'], resist: { drift: 2 } }),
  mk('sourceMaterialOs', 'Source Material OS', 'docs', 6, { resilience: 5 }, 'Die volle Doku-Control-Plane: eine ID-referenzierte Quelle der Wahrheit für Pod-basierte SE mit Agenten.', { req: ['idConvention', 'projectMemory'], resist: { drift: 6 }, max: 3, cost: 120 }),

  // ── RETRIEVAL (quality) ──
  mk('keywordSearch', 'Keyword-Suche', 'retrieval', 1, { quality: 3 }, 'Lexikalische Suche — exakte Tokens, kein Verständnis.'),
  mk('embeddings', 'Embeddings', 'retrieval', 2, { quality: 3 }, 'Bedeutung als Vektoren — Synonyme und Paraphrasen.', { req: ['keywordSearch'] }),
  mk('vectorStore', 'Vector Store', 'retrieval', 3, { quality: 3 }, 'Skalierbarer Index für die Embeddings.', { req: ['embeddings'] }),
  mk('rag', 'RAG', 'retrieval', 4, { quality: 5 }, 'Belege zur Antwortzeit vor das Modell — aktuell statt veraltet.', { req: ['vectorStore'] }),
  mk('hybrid', 'Hybrid + RRF', 'retrieval', 5, { quality: 4 }, 'Lexikalisch + semantisch fusioniert — beide blinden Flecken gedeckt.', { req: ['rag'] }),
  mk('reranking', 'Reranking', 'retrieval', 5, { quality: 4 }, 'Cross-Encoder ordnet die Top-Kandidaten präzise nach vorne.', { req: ['hybrid'] }),
  mk('contextual', 'Contextual Retrieval', 'retrieval', 6, { quality: 4 }, 'Kontext vor jeden Chunk — auch isolierte Stücke bleiben auffindbar.', { req: ['reranking'] }),

  // ── CONTEXT (resilience/quality) ──
  mk('contextBudget', 'Context-Budget', 'context', 1, { quality: 2, resilience: 1 }, 'Den endlichen Context bewusst zuteilen.'),
  mk('noiseControl', 'Noise-Kontrolle', 'context', 2, { quality: 3 }, 'Irrelevantes raus — Signaldichte vor Menge.', { req: ['contextBudget'] }),
  mk('compression', 'Compression', 'context', 3, { resilience: 2, quality: 1 }, 'Verdichten statt droppen — kritische Details bleiben.', { req: ['noiseControl'] }),
  mk('isolation', 'Isolation / Subagents', 'context', 4, { resilience: 2 }, 'Lärmige Teilarbeit in isolierte Worker — der Hauptkontext bleibt sauber.', { req: ['compression'], resist: { scale: 2 } }),

  // ── AGENTS & CONTROL FLOW (velocity/quality) ──
  mk('singlePrompt', 'Single Prompt', 'agents', 1, { velocity: 2 }, 'Ein Aufruf — die einfachste Stufe.'),
  mk('promptChain', 'Prompt-Chain', 'agents', 2, { velocity: 3 }, 'Feste Schritte mit Gates.', { req: ['singlePrompt'] }),
  mk('workflow', 'Workflow', 'agents', 3, { velocity: 3, quality: 1 }, 'Deterministischer Control-Flow: Routing + Parallelisierung.', { req: ['promptChain'] }),
  mk('router', 'Router', 'agents', 3, { velocity: 2 }, 'Klassifizieren → Spezialpfad.', { req: ['promptChain'] }),
  mk('firstAgent', 'Autonomer Agent', 'agents', 4, { velocity: 4 }, 'Plan-Act-Observe — Autonomie, wo die Schritte offen sind.', { req: ['workflow'] }),
  mk('reactLoop', 'ReAct-Loop', 'agents', 5, { velocity: 3, quality: 2 }, 'Tool-Ökonomie + Stop-Bedingung.', { req: ['firstAgent'] }),
  mk('orchestrator', 'Orchestrator-Worker', 'agents', 6, { velocity: 4 }, 'Dynamische Zerlegung + Delegation — Voraussetzung für Skalierung.', { req: ['reactLoop', 'router'], resist: { scale: 4 } }),
  mk('evaluatorOptimizer', 'Evaluator-Optimizer', 'agents', 6, { quality: 4 }, 'Output iterativ gegen prüfbare Kriterien verbessern.', { req: ['reactLoop', 'evalHarness'] }),

  // ── EVALS & OBSERVABILITY (resilience/quality; scale handling) ──
  mk('smokeTests', 'Smoke-Tests', 'evals', 1, { resilience: 2 }, 'Ein paar Checks — besser als nichts.'),
  mk('evalHarness', 'Eval-Harness', 'evals', 2, { quality: 3, resilience: 2 }, 'Wiederholbare Messung von echtem Task-Erfolg.', { req: ['smokeTests'] }),
  mk('taskSuccess', 'Task-Success-Metrik', 'evals', 3, { resilience: 3 }, 'Erfolg am Outcome messen, nicht am Wortlaut.', { req: ['evalHarness'] }),
  mk('groundingEval', 'Grounding-Eval', 'evals', 4, { quality: 4 }, 'Jede Aussage gegen die Evidenz prüfen — Halluzinationen fangen.', { req: ['evalHarness', 'rag'] }),
  mk('regressionGate', 'Regressions-Gate', 'evals', 5, { resilience: 4 }, 'Kein Release ohne grün; kritische Fälle mit hartem Veto.', { req: ['taskSuccess'] }),
  mk('traces', 'Traces', 'evals', 3, { security: 1 }, 'Jeder Schritt nachvollziehbar.', { req: ['smokeTests'], resist: { scale: 2 } }),
  mk('observability', 'Observability', 'evals', 4, { quality: 2, security: 1 }, 'Bei Skalierung siehst du, was passiert — statt zu raten.', { req: ['traces'], resist: { scale: 4 } }),
  mk('postmortems', 'Postmortems', 'evals', 5, { resilience: 3 }, 'Vorfälle werden zu durablen Regeln.', { req: ['observability', 'decisionLog'] }),

  // ── SECURITY & GOVERNANCE (security; scale handling) ──
  mk('inputValidation', 'Input-Validierung', 'security', 1, { security: 3 }, 'An den Systemgrenzen prüfen.'),
  mk('leastPrivilege', 'Least Privilege', 'security', 2, { security: 3 }, 'Jedes Tool nur mit den nötigen Rechten.', { req: ['inputValidation'] }),
  mk('approvalGate', 'Approval-Gate', 'security', 3, { security: 4 }, 'Menschliche Freigabe für riskante, irreversible Aktionen.', { req: ['leastPrivilege'] }),
  mk('injectionDefense', 'Injection-Abwehr', 'security', 4, { security: 5 }, 'Untrusted Input strikt als Daten — unfälschbare Grenze.', { req: ['inputValidation', 'rag'] }),
  mk('sandbox', 'Sandbox', 'security', 4, { security: 4 }, 'Begrenzt den Blast-Radius, wenn doch etwas schiefgeht.', { req: ['leastPrivilege'], resist: { scale: 2 } }),
  mk('rateLimits', 'Rate-Limits', 'security', 5, { security: 2 }, 'Loops und Missbrauch unter Last abfangen.', { req: ['approvalGate'], resist: { scale: 3 } }),
  mk('auditLog', 'Audit-Log', 'security', 6, { security: 2 }, 'Wer, was, wann — rekonstruierbar.', { req: ['traces'], resist: { scale: 3 } }),
  mk('governance', 'Governance-Layer', 'security', 7, { security: 6 }, 'Least Privilege, Rate-Limits, Audit als System — Kontrolle unter Last.', { req: ['sandbox', 'approvalGate'], resist: { scale: 5 }, max: 3, cost: 120 }),

  // ── TEAM & DIRECTION (velocity; debt control; scale) ──
  mk('soloDev', 'Solo (du)', 'team', 1, { velocity: 2 }, 'Du allein — der Ausgangspunkt.', { max: 1 }),
  mk('firstBee', 'Erster Agent (Biene)', 'team', 2, { velocity: 4 }, 'Eine ausführende Biene — sie tippt, du dirigierst.', { req: ['soloDev'] }),
  mk('briefDiscipline', 'Brief-Disziplin', 'team', 3, { quality: 2 }, 'Klare Briefs mit Akzeptanzkriterien — weniger Nacharbeit, weniger Tech-Debt.', { req: ['firstBee'], resist: { debt: 3 } }),
  mk('pod', 'Pod (mehr Bienen)', 'team', 3, { velocity: 5 }, 'Mehr parallele Agenten — schneller, aber mehr Koordination.', { req: ['firstBee'] }),
  mk('decomposition', 'Decomposition', 'team', 4, { velocity: 2 }, 'Abhängigkeiten sequenzieren statt blind parallelisieren.', { req: ['briefDiscipline'], resist: { debt: 2 } }),
  mk('oversight', 'Oversight-Allocation', 'team', 4, { resilience: 2, security: 1 }, 'Aufsicht risikogewichtet verteilen.', { req: ['pod'] }),
  mk('conventions', 'Conventions & kleine Units', 'team', 5, { quality: 2 }, 'Eine Einheit, eine Aufgabe — sicher änderbar, weniger Debt.', { req: ['decomposition'], resist: { debt: 4 } }),
  mk('directorPod', 'Director-Pod', 'team', 6, { velocity: 6, quality: 3 }, 'PO + Devs dirigieren den Schwarm — Richtung schlägt Tippgeschwindigkeit.', { req: ['pod', 'oversight'], resist: { scale: 4 }, max: 3, cost: 110 }),
]

const ALL: Record<string, Building> = Object.fromEntries([CHARTER, ...BUILDINGS].map((b) => [b.id, b]))
export const buildingById = (id: string): Building | undefined => ALL[id]

export function initialGame(): GameState {
  return {
    budget: 60,
    xp: 0,
    releases: 0,
    cleanReleases: 0,
    levels: { [CHARTER_ID]: 1, soloDev: 1 },
    drift: 12,
    debt: 5,
    scale: 0,
    trust: 50,
    missionsDone: [],
    prestige: 0,
    placed: {},
    day: 0,
    events: [],
    questsClaimed: [],
    learned: [],
    log: ['Projekt gestartet. Charter Tier 1 — bau die Grundlagen, halte Drift im Griff.'],
    version: GAME_VERSION,
  }
}

// Each prestige adds a permanent "legacy" bonus to every stat (you've done this before).
export const legacyBonus = (s: GameState): number => s.prestige * 3

export const builtCount = (s: GameState): number =>
  BUILDINGS.filter((b) => (s.levels[b.id] ?? 0) > 0).length

export const tierOf = (s: GameState): number => s.levels[CHARTER_ID] ?? 1
const levelOf = (s: GameState, id: string) => s.levels[id] ?? 0

// Synergies: building the right COMBINATION grants a bonus — rewards diverse, multi-branch
// strategies (there is no single dominant path). Active when every id is at level ≥ 1.
export interface Synergy {
  ids: string[]
  bonus: Partial<Record<Stat, number>>
  label: string
}
export const SYNERGIES: Synergy[] = [
  { ids: ['rag', 'groundingEval'], bonus: { quality: 4 }, label: 'Grounded RAG' },
  { ids: ['decisionLog', 'idConvention'], bonus: { velocity: 3, resilience: 2 }, label: 'ID-disziplinierte Docs' },
  { ids: ['orchestrator', 'observability'], bonus: { velocity: 4 }, label: 'Beobachteter Schwarm' },
  { ids: ['approvalGate', 'sandbox'], bonus: { security: 4 }, label: 'Defense in Depth' },
  { ids: ['pod', 'briefDiscipline'], bonus: { quality: 3 }, label: 'Gut gebriefter Pod' },
  { ids: ['evalHarness', 'regressionGate'], bonus: { resilience: 3 }, label: 'Solides Deploy-Gate' },
  { ids: ['hybrid', 'reranking'], bonus: { quality: 3 }, label: 'Scharfes Retrieval' },
  { ids: ['injectionDefense', 'approvalGate'], bonus: { security: 4 }, label: 'Injection-fest' },
  { ids: ['sourceMaterialOs', 'agentLearningLog'], bonus: { velocity: 4, resilience: 3 }, label: 'Lernende Control-Plane' },
]
export const activeSynergies = (s: GameState): Synergy[] =>
  SYNERGIES.filter((sy) => sy.ids.every((id) => levelOf(s, id) >= 1))

// ── Placement = ARCHITECTURE. A skill you BOUGHT only pays off once you drop it into the RIGHT
// request phase on the System-Karte. Correct phase → its primary-stat bonus (which feeds release
// defense, so good ordering ships safer). Wrong phase → no bonus + a one-line lesson on where it
// belongs. The two views need each other: the Skilltree BUYS, the Karte ARRANGES correctly. ────
export const PLACE_BONUS = 2
export const ZONES: Zone[] = ['boundary', 'knowledge', 'model', 'tools', 'check', 'ops']
export const ZONE_LABEL: Record<Zone, string> = {
  boundary: 'Grenze', knowledge: 'Wissen', model: 'Modell', tools: 'Tools', check: 'Prüfung', ops: 'Betrieb',
}
// The principle each phase teaches (shown when a skill is misplaced).
export const ZONE_WHY: Record<Zone, string> = {
  boundary: 'untrusted Input an der Grenze prüfen — VOR Modell und Tools',
  knowledge: 'Wissen/Retrieval VOR das Modell — Kontext vor der Generierung',
  model: 'Steuerung & Reasoning rund ums Modell',
  tools: 'Gates direkt VOR der (irreversiblen) Tool-Aktion',
  check: 'Prüfen NACH dem Modell, bevor die Antwort rausgeht',
  ops: 'Beobachtung & Governance quer über alles',
}
const BRANCH_ZONE: Record<Branch, Zone> = {
  docs: 'model', retrieval: 'knowledge', context: 'knowledge', agents: 'model', evals: 'check', security: 'boundary', team: 'ops',
}
// Per-skill acceptable phases (canonical first) where the branch default isn't right / is too narrow.
const ZONE_OVERRIDE: Record<string, Zone[]> = {
  isolation: ['model', 'knowledge'],
  evaluatorOptimizer: ['model', 'check'],
  traces: ['ops'],
  observability: ['ops'],
  postmortems: ['ops', 'check'],
  approvalGate: ['tools'],
  sandbox: ['tools'],
  auditLog: ['ops'],
  governance: ['ops', 'tools'],
}
/** Phases that count as correct for a skill (first = canonical "belongs here"). */
export function zonesFor(id: string): Zone[] {
  if (ZONE_OVERRIDE[id]) return ZONE_OVERRIDE[id]
  const b = ALL[id]
  if (!b) return ['model']
  if (b.branch === 'docs') return ['model', 'ops'] // control-plane informs the model, is cross-cutting
  return [BRANCH_ZONE[b.branch]]
}
export const canonicalZone = (id: string): Zone => zonesFor(id)[0]

const primaryStat = (b: Building): Stat | null => {
  let best: Stat | null = null
  let bestV = 0
  for (const [k, v] of Object.entries(b.effect)) {
    if ((v as number) > bestV) {
      bestV = v as number
      best = k as Stat
    }
  }
  return best
}
export const isOwned = (s: GameState, id: string): boolean => id === CHARTER_ID || levelOf(s, id) >= 1
export const isPlaced = (s: GameState, id: string): boolean => !!s.placed[id]
export const placedZone = (s: GameState, id: string): Zone | null => s.placed[id] ?? null
/** A placed skill is correct iff its phase is in its acceptable set. */
export const isCorrectlyPlaced = (s: GameState, id: string): boolean => {
  const z = s.placed[id]
  return !!z && isOwned(s, id) && zonesFor(id).includes(z)
}
/** Owned skills not yet placed on the Karte — the "Lager" you drag from (Charter excluded). */
export const ownedUnplaced = (s: GameState): Building[] =>
  BUILDINGS.filter((b) => isOwned(s, b.id) && !isPlaced(s, b.id))
/** How much of your placed architecture is ordered correctly. */
export function architectureScore(s: GameState): { correct: number; placed: number } {
  const placed = Object.keys(s.placed).filter((id) => isOwned(s, id))
  return { correct: placed.filter((id) => isCorrectlyPlaced(s, id)).length, placed: placed.length }
}
/** Primary-stat bonus from CORRECTLY-placed skills only (wrong phase = no bonus). */
export function placementBonus(s: GameState): Record<Stat, number> {
  const out: Record<Stat, number> = { quality: 0, security: 0, velocity: 0, resilience: 0 }
  for (const id of Object.keys(s.placed)) {
    if (!isCorrectlyPlaced(s, id)) continue
    const p = primaryStat(ALL[id]!)
    if (p) out[p] += PLACE_BONUS
  }
  return out
}
/** Drop an owned skill into a request phase. No-op for Charter / un-owned. */
export function placeNode(s: GameState, id: string, zone: Zone): GameState {
  if (id === CHARTER_ID || !isOwned(s, id)) return s
  return { ...s, placed: { ...s.placed, [id]: zone } }
}
/** Send a placed skill back to the Lager (drops its placement bonus). */
export function unplaceNode(s: GameState, id: string): GameState {
  if (!s.placed[id]) return s
  const placed = { ...s.placed }
  delete placed[id]
  return { ...s, placed }
}

export function deriveStats(s: GameState): Record<Stat, number> {
  const out: Record<Stat, number> = { ...BASE }
  for (const b of [CHARTER, ...BUILDINGS]) {
    const lvl = levelOf(s, b.id)
    if (!lvl) continue
    for (const [k, v] of Object.entries(b.effect)) out[k as Stat] += (v as number) * lvl
  }
  for (const sy of activeSynergies(s)) {
    for (const [k, v] of Object.entries(sy.bonus)) out[k as Stat] += v as number
  }
  const place = placementBonus(s)
  for (const k of Object.keys(out) as Stat[]) out[k] += place[k]
  const legacy = legacyBonus(s)
  if (legacy) for (const k of Object.keys(out) as Stat[]) out[k] += legacy
  return out
}
export function deriveResists(s: GameState): Record<Var, number> {
  const out: Record<Var, number> = { drift: 0, debt: 0, scale: 0 }
  for (const b of [CHARTER, ...BUILDINGS]) {
    const lvl = levelOf(s, b.id)
    if (!lvl || !b.resist) continue
    for (const [k, v] of Object.entries(b.resist)) out[k as Var] += (v as number) * lvl
  }
  return out
}

export const buildingCost = (b: Building, level: number): number => Math.round(b.baseCost * Math.pow(1.7, level))
export function nextCost(s: GameState, b: Building): number | null {
  const lvl = levelOf(s, b.id)
  return lvl < b.maxLevel ? buildingCost(b, lvl) : null
}

export interface BuyCheck {
  ok: boolean
  reason?: string
}
export function requiresMet(s: GameState, b: Building): boolean {
  return (b.requires ?? []).every((r) => levelOf(s, r) >= 1)
}
export function canBuy(s: GameState, b: Building): BuyCheck {
  const lvl = levelOf(s, b.id)
  if (lvl >= b.maxLevel) return { ok: false, reason: 'max' }
  // Quest gate: a mapped skill is unbuildable until its roadmap lesson is completed ("learn it to
  // build it"). Starter-kit skills (not in the quest map) are unaffected.
  if (isQuestSkill(b.id) && !s.learned.includes(b.id)) return { ok: false, reason: 'Quest nötig' }
  if (b.id !== CHARTER_ID && tierOf(s) < b.depth) return { ok: false, reason: `Tier ${b.depth} nötig` }
  for (const req of b.requires ?? []) {
    if (levelOf(s, req) < 1) return { ok: false, reason: `braucht ${ALL[req]?.name ?? req}` }
  }
  const cost = buildingCost(b, lvl)
  if (s.budget < cost) return { ok: false, reason: `${cost - s.budget} € fehlen` }
  return { ok: true }
}

const push = (log: string[], line: string) => [line, ...log].slice(0, 30)

export function buy(s: GameState, id: string): GameState {
  const b = ALL[id]
  if (!b || !canBuy(s, b).ok) return s
  const lvl = levelOf(s, b.id)
  const cost = buildingCost(b, lvl)
  const line = b.id === CHARTER_ID ? `Charter → Tier ${lvl + 1}. Tiefere Skills freigeschaltet.` : `${b.name} → Lv ${lvl + 1} (−${cost} €).`
  return { ...s, budget: s.budget - cost, levels: { ...s.levels, [b.id]: lvl + 1 }, log: push(s.log, line) }
}

/** Passive budget earned per in-game DAY (your system shipping value over time), dragged by debt. */
export function dayIncome(s: GameState): number {
  return Math.max(1, Math.round(deriveStats(s).velocity * 0.5 - s.debt * 0.1))
}

/** True when everything unlockable at the current tier is already maxed — only a Charter upgrade unblocks more. */
export function tierCapped(s: GameState): boolean {
  const tier = tierOf(s)
  return !BUILDINGS.some((b) => b.depth <= tier && requiresMet(s, b) && (s.levels[b.id] ?? 0) < b.maxLevel)
}

/** "System ausgereift" — the soft win: Charter at max tier (reached by finishing the curriculum's
 *  capstone quests) AND a track record of clean releases. The sandbox continues afterwards. */
export const isMature = (s: GameState): boolean => tierOf(s) >= CHARTER.maxLevel && s.cleanReleases >= 5

export function releaseDefense(s: GameState): number {
  const st = deriveStats(s)
  const base = 0.35 * st.quality + 0.4 * st.security + 0.25 * st.resilience
  return Math.max(0, Math.round(base - 0.5 * s.drift - 0.4 * s.debt))
}
export function releaseThreat(s: GameState): number {
  const r = deriveResists(s)
  const handled = Math.max(0.25, 1 - r.scale / 40)
  return Math.round(30 + s.releases * 8 + s.scale * handled)
}

export type ReleaseResult = 'clean' | 'hotfix' | 'incident'
export interface ReleaseOutcome {
  result: ReleaseResult
  reward: number
  text: string
}

export function shipRelease(s: GameState): { state: GameState; outcome: ReleaseOutcome } {
  const defense = releaseDefense(s)
  const threat = releaseThreat(s)
  const r = deriveResists(s)
  const n = s.releases + 1
  let outcome: ReleaseOutcome

  // What's dragging you down (named in non-clean outcomes)?
  const drag =
    s.drift >= 45 ? 'Drift frisst deine Abwehr — bau Docs ([XXX-000], Decision Log, Source-Material-OS).' : s.debt >= 45 ? 'Tech-Debt bremst alles — bau Conventions/Decomposition.' : s.scale > defense ? 'Die Skalierung übersteigt dein System — bau Orchestrator/Observability/Governance.' : 'Die Stats reichen noch nicht — bau Qualität/Sicherheit/Resilienz aus.'

  if (defense >= threat) {
    const reward = Math.round(45 + s.scale * 0.5)
    outcome = { result: 'clean', reward, text: `Release v${n} sauber ausgeliefert (Abwehr ${defense} ≥ Bedrohung ${threat}). +${reward} €, +3 XP.` }
  } else if (defense >= threat - 12) {
    const reward = Math.round(20 + s.scale * 0.2)
    outcome = { result: 'hotfix', reward, text: `Release v${n} ging raus, aber mit Hotfixes. +${reward} €, +1 XP. ${drag}` }
  } else {
    const penalty = Math.min(s.budget, Math.round(8 + s.scale * 0.2))
    outcome = { result: 'incident', reward: -penalty, text: `Release v${n} ist live gescheitert (Abwehr ${defense} < Bedrohung ${threat}). −${penalty} €. ${drag}` }
  }

  const clean = outcome.result === 'clean'
  const advanced = outcome.result !== 'incident'
  // The world only HARDENS when you actually ship (clean/hotfix): scale grows, drift/debt rise
  // unless your skills hold them down. A failed release is a setback, NOT a spiral — nothing grows,
  // so you can regroup (sprint, build, tier up) and try again.
  const state: GameState = {
    ...s,
    budget: Math.max(0, s.budget + outcome.reward),
    xp: s.xp + (clean ? 3 : outcome.result === 'hotfix' ? 1 : 0),
    releases: advanced ? n : s.releases,
    cleanReleases: s.cleanReleases + (clean ? 1 : 0),
    drift: clamp(s.drift + (advanced ? Math.max(0, 9 - r.drift) : 0)),
    debt: clamp(s.debt + (advanced ? Math.max(0, (clean ? 3 : 7) - r.debt) : 0)),
    scale: clamp(s.scale + (advanced ? 8 : 0)),
    trust: clamp(s.trust + (clean ? 6 : outcome.result === 'incident' ? -8 : 1)),
    log: push(s.log, outcome.text),
  }
  return { state, outcome }
}

// ── Missions: goal-driven progression (claimed once, reward auto-granted) ────
export interface Mission {
  id: string
  label: string
  hint: string
  reward: { budget?: number; xp?: number }
  done: (s: GameState) => boolean
}
export const MISSIONS: Mission[] = [
  { id: 'm-build3', label: 'Erste Schritte', hint: '3 Skills bauen', reward: { budget: 25 }, done: (s) => builtCount(s) >= 3 },
  { id: 'm-tier2', label: 'Aufstieg', hint: 'Tier 2 erreichen', reward: { budget: 35 }, done: (s) => tierOf(s) >= 2 },
  { id: 'm-rag', label: 'Evidenz', hint: 'RAG bauen', reward: { budget: 40 }, done: (s) => levelOf(s, 'rag') >= 1 },
  { id: 'm-ship', label: 'Erster Release', hint: 'einen Release ausliefern', reward: { budget: 30, xp: 1 }, done: (s) => s.releases >= 1 },
  { id: 'm-clean', label: 'Sauber geliefert', hint: 'einen sauberen Release', reward: { budget: 50, xp: 2 }, done: (s) => s.cleanReleases >= 1 },
  { id: 'm-drift', label: 'Doku-Disziplin', hint: 'Drift unter 8', reward: { budget: 50, xp: 1 }, done: (s) => s.drift < 8 },
  { id: 'm-sec', label: 'Sicherheitsfestung', hint: 'Sicherheit ≥ 35', reward: { budget: 45 }, done: (s) => deriveStats(s).security >= 35 },
  { id: 'm-gate', label: 'Solides Gate', hint: 'Regressions-Gate bauen', reward: { budget: 50 }, done: (s) => levelOf(s, 'regressionGate') >= 1 },
  { id: 'm-tier4', label: 'Reife', hint: 'Tier 4 erreichen', reward: { budget: 80, xp: 2 }, done: (s) => tierOf(s) >= 4 },
  { id: 'm-scale', label: 'Skaliert', hint: 'Scale ≥ 50 und trotzdem release-bereit', reward: { budget: 90, xp: 3 }, done: (s) => s.scale >= 50 && releaseDefense(s) >= releaseThreat(s) },
  { id: 'm-smos', label: 'Volle Control-Plane', hint: 'Source-Material-OS bauen', reward: { budget: 80, xp: 2 }, done: (s) => levelOf(s, 'sourceMaterialOs') >= 1 },
  { id: 'm-5clean', label: 'Verlässlich', hint: '5 saubere Releases', reward: { budget: 120, xp: 4 }, done: (s) => s.cleanReleases >= 5 },
]

/** Grant any newly-satisfied missions (pure). Call after every state change. */
export function applyMissions(s: GameState): GameState {
  let next = s
  for (const m of MISSIONS) {
    if (next.missionsDone.includes(m.id) || !m.done(next)) continue
    next = {
      ...next,
      budget: next.budget + (m.reward.budget ?? 0),
      xp: next.xp + (m.reward.xp ?? 0),
      missionsDone: [...next.missionsDone, m.id],
      log: push(next.log, `Mission „${m.label}" erfüllt: +${m.reward.budget ?? 0} €${m.reward.xp ? `, +${m.reward.xp} XP` : ''}.`),
    }
  }
  return next
}

// ── Events: a weakness surfaces as a live bubble during play. Tap it in time to handle it; let it
// expire and the penalty lands. `good` events are upside you collect by tapping.
export interface GameEvent {
  id: string
  /** Short bubble label. */
  text: string
  /** Why it happened / what to build — shown on the bubble. */
  hint: string
  good?: boolean
  when: (s: GameState) => boolean
  apply: (s: GameState) => GameState
}
const adj = (s: GameState, p: Partial<Pick<GameState, 'budget' | 'trust' | 'drift' | 'debt'>>): GameState => ({
  ...s,
  budget: Math.max(0, s.budget + (p.budget ?? 0)),
  trust: clamp(s.trust + (p.trust ?? 0)),
  drift: clamp(s.drift + (p.drift ?? 0)),
  debt: clamp(s.debt + (p.debt ?? 0)),
})
export const EVENTS: GameEvent[] = [
  { id: 'injection', text: 'Prompt-Injection-Versuch', hint: 'Ungeschütztes Tool wird angegriffen. Bau Injection-Abwehr / Input-Validierung.', when: (s) => deriveStats(s).security < 28 && levelOf(s, 'injectionDefense') < 1 && s.day >= 5, apply: (s) => adj(s, { budget: -18, trust: -10 }) },
  { id: 'blackout', text: 'Ausfall unbemerkt', hint: 'Last steigt, aber du fliegst blind. Bau Observability / Traces.', when: (s) => s.scale >= 25 && levelOf(s, 'observability') < 1, apply: (s) => adj(s, { trust: -8, budget: -12 }) },
  { id: 'drift-crisis', text: 'Drift-Krise', hint: 'Niemand weiß mehr, was autoritativ ist. Bau die Docs-Linie aus.', when: (s) => s.drift >= 55, apply: (s) => adj(s, { debt: 10 }) },
  { id: 'debt-crunch', text: 'Tech-Debt-Crunch', hint: 'Jede Änderung bricht etwas. Bau Conventions / Decomposition.', when: (s) => s.debt >= 55, apply: (s) => adj(s, { budget: -12 }) },
  { id: 'audit-pass', text: 'Audit bestanden', hint: 'Sammle den Reputations-Bonus ein.', good: true, when: (s) => s.trust >= 72 && levelOf(s, 'auditLog') >= 1, apply: (s) => adj(s, { budget: 25, trust: 4 }) },
]
export const triggeredEvent = (s: GameState): GameEvent | null => EVENTS.find((e) => e.when(s)) ?? null
const eventDef = (id: string): GameEvent | undefined => EVENTS.find((e) => e.id === id)
export const eventById = eventDef

// ── The clock (Plague-Inc loop) ──────────────────────────────────────────────
// Time advances on its own while the player presses Play. Each day: passive income accrues, entropy
// (drift/debt) creeps unless your structure holds it, weaknesses surface as event bubbles, and every
// RELEASE_EVERY days the system auto-ships a release. The player keeps building + handles events.
export const RELEASE_EVERY = 12
export const EVENT_TTL = 6
const EVENT_CHECK = 4

function spawnEvents(s: GameState): GameState {
  if (s.day % EVENT_CHECK !== 0) return s
  const def = EVENTS.find((e) => e.when(s) && !s.events.some((a) => a.id === e.id))
  if (!def) return s
  return { ...s, events: [...s.events, { id: def.id, born: s.day, deadline: s.day + EVENT_TTL }], log: push(s.log, `${def.good ? '★' : '⚠'} ${def.text}`) }
}
function resolveExpired(s: GameState): GameState {
  const due = s.events.filter((e) => e.deadline <= s.day)
  if (!due.length) return s
  let next: GameState = { ...s, events: s.events.filter((e) => e.deadline > s.day) }
  for (const a of due) {
    const def = eventDef(a.id)
    if (def && !def.good) next = { ...def.apply(next), log: push(next.log, `✗ Unbehandelt: ${def.text}`) }
  }
  return next
}
/** The player tapped a bubble in time: good → collect the reward; bad → mitigated, no penalty. */
export function handleEvent(s: GameState, id: string): GameState {
  const def = eventDef(id)
  if (!def || !s.events.some((e) => e.id === id)) return s
  const events = s.events.filter((e) => e.id !== id)
  if (def.good) return { ...def.apply({ ...s, events }), log: push(s.log, `✓ ${def.text}`) }
  return { ...s, events, trust: clamp(s.trust + 3), log: push(s.log, `✓ Abgewehrt: ${def.text}`) }
}

export interface TickResult {
  state: GameState
  /** Set when an auto-release fired this tick. */
  outcome?: ReleaseOutcome
}
/** Advance one in-game day: income + entropy creep + event spawn/expiry + the auto-release cadence. */
export function tick(s: GameState): TickResult {
  const r = deriveResists(s)
  const driftStep = r.drift >= 3 ? -1 : r.drift >= 1 ? 0 : 1 // docs pay drift down; none → it creeps
  const debtStep = r.debt >= 2 ? -1 : 1
  let next: GameState = {
    ...s,
    day: s.day + 1,
    budget: s.budget + dayIncome(s),
    drift: clamp(s.drift + driftStep),
    debt: clamp(s.debt + (s.day % 2 === 0 ? debtStep : 0)),
    scale: clamp(s.scale + (s.releases > 0 && s.day % 3 === 0 ? 1 : 0)),
  }
  next = spawnEvents(next)
  next = resolveExpired(next)
  let outcome: ReleaseOutcome | undefined
  if (next.day % RELEASE_EVERY === 0) {
    const res = shipRelease(next)
    next = res.state
    outcome = res.outcome
  }
  return { state: next, outcome }
}

// ── Prestige: refactor & restart, keeping a permanent legacy bonus ───────────
export const canPrestige = (s: GameState): boolean => s.cleanReleases >= 5
export function doPrestige(s: GameState): GameState {
  if (!canPrestige(s)) return s
  const p = s.prestige + 1
  return {
    ...initialGame(),
    prestige: p,
    budget: 60 + p * 40,
    log: [`Refactor & Neustart — Prestige ${p}. Permanenter Legacy-Bonus: +${p * 3} auf alle Stats.`],
  }
}

// ── persistence ──────────────────────────────────────────────────────────────
const KEY = 'flightdeck.buildgame.v9'
export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialGame()
    const parsed = JSON.parse(raw) as GameState
    if (parsed?.version !== GAME_VERSION || !parsed.levels) return initialGame()
    return { ...parsed, placed: parsed.placed ?? {}, day: parsed.day ?? 0, events: parsed.events ?? [], questsClaimed: parsed.questsClaimed ?? [], learned: parsed.learned ?? [] }
  } catch {
    return initialGame()
  }
}
export function saveGame(s: GameState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* storage unavailable */
  }
}
export function resetGame(): GameState {
  const fresh = initialGame()
  saveGame(fresh)
  return fresh
}
