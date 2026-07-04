// Werft × Roadmap "quests": completing a roadmap node grants Budget and UNLOCKS its Werft skill(s)
// ("learn it to build it"). See docs/superpowers/specs/2026-06-26-werft-quests-design.md.
//
// - `skills`: Werft building ids this node unlocks (a mapped skill is unbuildable until done).
// - `budget`: one-time grant on completion (idempotent via GameState.questsClaimed).
// - `charterTier`: a few keystones raise the Charter tier ceiling.
// Skills NOT referenced here are the free "starter kit" (always buildable): charter, soloDev,
// scratchNotes, instructionsMd, smokeTests, vectorStore, firstBee.

export interface Quest {
  title: string
  budget: number
  skills?: string[]
  charterTier?: number
}

export const QUEST_MAP: Record<string, Quest> = {
  // Arc 00 — Foundations (intro; budget-only)
  'NODE-00-01': { title: 'What AI Engineering Actually Builds', budget: 10 },
  'NODE-00-02': { title: 'The Iceberg Model', budget: 10 },

  // Arc 01 — Augmented LLM
  'NODE-01-01': { title: 'Augmented LLM', budget: 12, skills: ['singlePrompt'] },
  'NODE-01-02': { title: 'Simplicity Before Agency', budget: 12 },
  'NODE-01-03': { title: 'System Layers Map', budget: 14, skills: ['promptChain'] },

  // Arc 02 — Context
  'NODE-02-01': { title: 'Context Window and Token Budget', budget: 16, skills: ['contextBudget'] },
  'NODE-02-02': { title: 'Context Noise', budget: 16, skills: ['noiseControl'] },
  'NODE-02-03': { title: 'Context Compression', budget: 18, skills: ['compression'] },
  'NODE-02-04': { title: 'Context Isolation and Subagents', budget: 20, skills: ['isolation'] },

  // Arc 03 — Tools (Werft abstracts tools into agents/security; budget-only)
  'NODE-03-01': { title: 'Tools Are Interfaces', budget: 16 },
  'NODE-03-02': { title: 'Structured Outputs', budget: 16 },
  'NODE-03-03': { title: 'Constrained Decoding', budget: 16 },
  'NODE-03-04': { title: 'MCP and Tool Ecosystems', budget: 18 },

  // Arc 04 — Control flow & agents
  'NODE-04-01': { title: 'Workflow vs Agent', budget: 20, skills: ['workflow'] },
  'NODE-04-02': { title: 'Workflow Patterns', budget: 20, skills: ['router'] },
  'NODE-04-03': { title: 'Orchestrator-Worker', budget: 26, skills: ['orchestrator'] },
  'NODE-04-04': { title: 'Evaluator-Optimizer', budget: 26, skills: ['evaluatorOptimizer'] },
  'NODE-04-05': { title: 'Autonomous Agent Loop', budget: 24, skills: ['firstAgent', 'reactLoop'] },

  // Arc 05 — Retrieval
  'NODE-05-01': { title: 'RAG Basics', budget: 22, skills: ['rag'] },
  'NODE-05-02': { title: 'Lexical vs Semantic Retrieval', budget: 18, skills: ['keywordSearch', 'embeddings'] },
  'NODE-05-03': { title: 'Hybrid Search and Reranking', budget: 24, skills: ['hybrid', 'reranking'] },
  'NODE-05-04': { title: 'Contextual Retrieval', budget: 24, skills: ['contextual'] },
  'NODE-05-05': { title: 'Visual Document Retrieval', budget: 18 },

  // Arc 06 — Memory & docs
  'NODE-06-01': { title: 'Session vs Project Memory', budget: 20, skills: ['memoryMd', 'projectMemory'] },
  'NODE-06-02': { title: 'Decision Logs and Feature Ledgers', budget: 22, skills: ['decisionLog', 'featureLedger'] },
  'NODE-06-03': { title: 'Agent Learning Loops', budget: 24, skills: ['agentLearningLog'] },
  'NODE-06-04': { title: 'Long-Running Agent Projects', budget: 26, skills: ['idConvention', 'openQuestions'] },

  // Arc 07 — Evals & observability
  'NODE-07-01': { title: 'Eval Harness', budget: 22, skills: ['evalHarness'] },
  'NODE-07-02': { title: 'Task Success and Regression', budget: 24, skills: ['taskSuccess', 'regressionGate'] },
  'NODE-07-03': { title: 'Grounding Evaluation', budget: 24, skills: ['groundingEval'] },
  'NODE-07-04': { title: 'Traces and Postmortems', budget: 28, skills: ['traces', 'observability', 'postmortems'] },

  // Arc 08 — Security & governance
  'NODE-08-01': { title: 'Least Privilege', budget: 22, skills: ['leastPrivilege'] },
  'NODE-08-02': { title: 'Human Approval Gates', budget: 24, skills: ['approvalGate'] },
  'NODE-08-03': { title: 'Prompt Injection', budget: 26, skills: ['injectionDefense', 'inputValidation'] },
  'NODE-08-04': { title: 'Sandboxing and Governance', budget: 30, skills: ['sandbox', 'rateLimits', 'auditLog', 'governance'] },

  // Arc 09 — Team & repo
  'NODE-09-01': { title: 'Repo Legibility', budget: 20 },
  'NODE-09-02': { title: 'Conventions and Small Components', budget: 24, skills: ['conventions'] },
  'NODE-09-03': { title: 'Source Material OS', budget: 30, skills: ['sourceMaterialOs'] },
  'NODE-09-04': { title: 'Team Scale', budget: 26, skills: ['pod'] },

  // Arc 10 — Capstone (keystone raises the Charter tier ceiling)
  'NODE-10-01': { title: 'Capstone Briefing', budget: 30 },
  'NODE-10-02': { title: 'Capstone Architecture Draft', budget: 30 },
  'NODE-10-03': { title: 'Capstone Failure Injection', budget: 30 },
  'NODE-10-04': { title: 'Capstone Eval and Governance', budget: 30 },
  'NODE-10-05': { title: 'Final System Review', budget: 60, charterTier: 6 },

  // Arc 11 — The Director's Seat (direction skills)
  'NODE-11-01': { title: 'From Builder to Director', budget: 40, skills: ['directorPod'] },
  'NODE-11-02': { title: 'One Bee or Many', budget: 28 },
  'NODE-11-03': { title: 'Allocate Your Oversight', budget: 30, skills: ['oversight'] },
  'NODE-11-04': { title: 'Set the Delegation Boundaries', budget: 28 },

  // Arc 12 — Targeting the Swarm
  'NODE-12-01': { title: 'The Brief Is the Bottleneck', budget: 28, skills: ['briefDiscipline'] },
  'NODE-12-02': { title: 'Sequence the Dependencies', budget: 28, skills: ['decomposition'] },
  'NODE-12-03': { title: 'Triage the Swarm', budget: 30 },

  // Arc 13 — Delivery & acceptance (final keystone)
  'NODE-13-01': { title: 'Prioritize and Cut', budget: 30 },
  'NODE-13-02': { title: 'Accept or Send Back', budget: 30 },
  'NODE-13-03': { title: 'Direct the Build', budget: 36 },
  'NODE-13-04': { title: 'Ship It: The Build Campaign', budget: 50, charterTier: 7 },
}

/** Inverse: Werft skill id → the node that unlocks it (first wins). */
export const SKILL_QUEST: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (const [node, q] of Object.entries(QUEST_MAP)) for (const s of q.skills ?? []) if (!m[s]) m[s] = node
  return m
})()

/** Is this skill gated behind a quest (vs. a free starter-kit skill)? */
export const isQuestSkill = (skillId: string): boolean => skillId in SKILL_QUEST
