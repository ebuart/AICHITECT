import { QUEST_MAP, SKILL_QUEST, isQuestSkill } from '@/content/werft/questMap'
import { CHARTER_ID, type GameState } from './gameModel'

// Bridge: roadmap progress (the single source of truth for "learned") → Werft state. Pure + tested.
// Reading completion grants one-time Budget (idempotent via `questsClaimed`), raises the Charter tier
// on keystone nodes, and recomputes which quest-gated skills are unlocked (`learned`).

const pushLog = (log: string[], line: string) => [line, ...log].slice(0, 30)

/** A skill is buildable-gate-wise blocked iff it's quest-gated AND its quest isn't done yet. */
export const skillQuestLocked = (s: GameState, skillId: string): boolean =>
  isQuestSkill(skillId) && !s.learned.includes(skillId)

/** Reconcile the game with the set of completed roadmap node ids. Returns the same state if nothing
 *  changed (so a React effect can run it freely without churning). */
export function reconcileQuests(s: GameState, completed: string[]): GameState {
  const done = new Set(completed)
  const learned = Object.keys(SKILL_QUEST)
    .filter((skill) => done.has(SKILL_QUEST[skill]))
    .sort()

  let budget = s.budget
  let claimed = s.questsClaimed
  let charter = s.levels[CHARTER_ID] ?? 1
  let log = s.log
  for (const node of completed) {
    const q = QUEST_MAP[node]
    if (!q || claimed.includes(node)) continue
    budget += q.budget
    claimed = claimed === s.questsClaimed ? [...s.questsClaimed] : claimed
    claimed.push(node)
    if (q.charterTier && q.charterTier > charter) charter = q.charterTier
    log = pushLog(log, `Quest „${q.title}" erledigt — +${q.budget} €${q.skills?.length ? ` · ${q.skills.length} Skill(s) frei` : ''}.`)
  }

  const learnedChanged = learned.length !== s.learned.length || learned.some((x, i) => x !== s.learned[i])
  const claimedChanged = claimed.length !== s.questsClaimed.length
  const charterChanged = charter !== (s.levels[CHARTER_ID] ?? 1)
  if (!learnedChanged && !claimedChanged && !charterChanged) return s

  return {
    ...s,
    budget,
    questsClaimed: claimedChanged ? claimed : s.questsClaimed,
    learned: learnedChanged ? learned : s.learned,
    levels: charterChanged ? { ...s.levels, [CHARTER_ID]: charter } : s.levels,
    log,
  }
}
