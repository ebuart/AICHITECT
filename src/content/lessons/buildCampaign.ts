import type { Lesson } from '@/features/lessons/lessonModel'
import { shipKlauspilot } from '@/content/campaigns/shipKlauspilot'

// NODE-13-04 · the PRODUCTION CAPSTONE: a stateful "direct the whole build" strategy game. After
// 53 nodes of recognition + judgment, this is the simulation of DOING it — one product directed
// end-to-end, decisions carrying state, early shortcuts surfacing as late incidents, a launch
// scorecard tracing your choices to whether it shipped. Hosts the BuildCampaign engine.
export const buildCampaign: Lesson = {
  id: 'LESSON-13-04',
  roadmapNodeId: 'NODE-13-04',
  conceptIds: ['all_core'],
  prerequisites: ['NODE-13-03'],
  title: 'Ship It — The Build Campaign',
  estimatedMinutes: 20,
  lessonMode: 'scenario-first',
  learningGoal: 'Ein ganzes Produkt end-to-end dirigieren — jede Entscheidung trägt Folgen bis zum Launch.',
  interactionType: 'capstone-simulator',
  visualModelId: 'layerStack',
  feedbackPatternId: 'FB-PATTERN-CAPSTONE-INTEGRATION',
  reviewHooks: ['all_core', 'capstone_transfer', 'direction_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Jetzt baust du — als Director',
      text: 'Kein Quiz mehr: hier dirigierst du den Bau eines ganzen Produkts. Jede Entscheidung bewegt deine Meter (Qualität, Sicherheit, Umfang), kostet Aufsicht und trägt Folgen — ein früher Shortcut wird dich am Launch-Tag einholen. Am Ende: dein Scorecard.',
    },
    { kind: 'campaign', campaign: shipKlauspilot },
  ],
}
