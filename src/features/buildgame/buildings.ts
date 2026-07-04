// The Werft CATALOG: skill/branch/zone DATA plus pure lookups over it. Game LOGIC
// (state, ticks, releases, missions) lives in gameModel.ts, which re-exports this file —
// consumers keep importing from gameModel.

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

export const CHARTER_ID = 'charter'

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

// ── Request-pipeline phases (the System-Karte lanes) ─────────────────────────
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
