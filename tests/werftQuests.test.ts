import { describe, it, expect } from 'vitest'
import { reconcileQuests } from '@/features/buildgame/questBridge'
import { skilltreeGraph } from '@/features/buildgame/graphs'
import { BUILDINGS, buildingById, canBuy, initialGame, isMature, type GameState } from '@/features/buildgame/gameModel'
import { QUEST_MAP, SKILL_QUEST } from '@/content/werft/questMap'
import { nodes } from '@/content/roadmap/nodes'

const withBudget = (s: GameState, budget: number): GameState => ({ ...s, budget })

describe('Werft × Roadmap quests ("learn it to build it")', () => {
  it('completing a node grants its budget ONCE and unlocks its skill', () => {
    const s0 = initialGame()
    const s1 = reconcileQuests(s0, ['NODE-05-01']) // RAG Basics → unlocks `rag`
    expect(s1.learned).toContain('rag')
    expect(s1.budget).toBe(s0.budget + QUEST_MAP['NODE-05-01'].budget)
    expect(s1.questsClaimed).toContain('NODE-05-01')
    // idempotent: same completed set → no change, same reference
    expect(reconcileQuests(s1, ['NODE-05-01'])).toBe(s1)
  })

  it('multi-skill nodes unlock all listed skills; keystones raise the Charter tier', () => {
    const s = reconcileQuests(initialGame(), ['NODE-08-04', 'NODE-13-04'])
    expect(s.learned).toEqual(expect.arrayContaining(['sandbox', 'rateLimits', 'auditLog', 'governance']))
    expect(s.levels.charter).toBe(7) // NODE-13-04 → charterTier 7
  })

  it('canBuy gates a quest skill until learned; starter-kit skills are free', () => {
    const rag = buildingById('rag')!
    const locked = withBudget(initialGame(), 9999)
    expect(canBuy(locked, rag).reason).toBe('Quest nötig')

    const unlocked = reconcileQuests(locked, ['NODE-05-01'])
    // now the quest gate is lifted (it still needs prereqs/tier — but NOT a quest)
    expect(canBuy(unlocked, rag).reason).not.toBe('Quest nötig')

    // a starter skill (not in the quest map) is buildable with no quest done
    expect(canBuy(withBudget(initialGame(), 9999), buildingById('scratchNotes')!).ok).toBe(true)
  })

  it('isMature is the soft win: max Charter tier (capstone) + 5 clean releases', () => {
    expect(isMature(initialGame())).toBe(false)
    const base = initialGame()
    const won: GameState = { ...base, levels: { ...base.levels, charter: 7 }, cleanReleases: 5 }
    expect(isMature(won)).toBe(true)
    expect(isMature({ ...won, cleanReleases: 4 })).toBe(false) // needs both
    expect(isMature({ ...won, levels: { ...won.levels, charter: 6 } })).toBe(false)
  })

  it('the skilltree shows quest-gated skills as locked + flagged until their lesson is done', () => {
    const treeNode = (s: GameState, id: string) => skilltreeGraph(s).nodes.find((n) => n.id === id)!
    const s0 = initialGame()
    const rag0 = treeNode(s0, 'rag')
    expect(rag0.state).toBe('locked') // not a poppable "available" node
    expect(rag0.quest).toBe(true) // carries the 🔒 quest flag
    // a starter skill is NOT quest-flagged
    expect(treeNode(s0, 'scratchNotes').quest).toBeFalsy()
    // after the lesson, the quest flag clears (it's then gated only by tier/prereqs)
    const learned = reconcileQuests(s0, ['NODE-05-01'])
    expect(treeNode(learned, 'rag').quest).toBeFalsy()
  })

  it('catalog integrity: every mapped skill + node is real; SKILL_QUEST is consistent', () => {
    const skillIds = new Set(BUILDINGS.map((b) => b.id))
    const nodeIds = new Set(nodes.map((n) => n.id))
    for (const [node, q] of Object.entries(QUEST_MAP)) {
      expect(nodeIds.has(node), `unknown roadmap node ${node}`).toBe(true)
      for (const skill of q.skills ?? []) expect(skillIds.has(skill), `${node} → unknown skill ${skill}`).toBe(true)
    }
    for (const [skill, node] of Object.entries(SKILL_QUEST)) {
      expect(QUEST_MAP[node].skills, `${skill} → ${node}`).toContain(skill)
    }
  })
})
