import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-10-01 · CAPSTONE opener, post-template redesign. Bespoke puzzle exercises (categorize ·
// pick) on a concrete capstone system (an AI support assistant: RAG answers + refund/escalate
// tools). Scoping a SYSTEM means pinning the non-negotiables (grounding, governance, evals)
// before any implementation — and cutting the out-of-scope (avatar, fine-tuning).
export const capstoneBriefing: Lesson = {
  id: 'LESSON-10-01',
  roadmapNodeId: 'NODE-10-01',
  conceptIds: ['all_core'],
  prerequisites: ['NODE-09-04'],
  title: 'Capstone Briefing',
  estimatedMinutes: 7,
  lessonMode: 'scenario-first',
  learningGoal: 'Ein AI-natives System scopen: die nicht verhandelbaren Anforderungen festlegen, Out-of-Scope schneiden.',
  interactionType: 'capstone-simulator',
  visualModelId: 'layerStack',
  feedbackPatternId: 'FB-PATTERN-CAPSTONE-INTEGRATION',
  reviewHooks: ['all_core', 'capstone_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Die Capstone-Aufgabe',
      text: 'Du dirigierst den Bau eines KI-Support-Assistenten: beantwortet Kundenfragen belegt aus den Hilfe-Docs und kann Rückerstattungen auslösen + an Menschen eskalieren. Lege fest, was Pflicht, was Beiwerk und was außerhalb des Scopes ist — bevor irgendein Agent loslegt.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'scope-requirements',
        format: 'categorize',
        stem: 'Ordne jede Anforderung ein.',
        buckets: [
          { id: 'core', label: 'Kern (Pflicht)' },
          { id: 'nice', label: 'Nice-to-have' },
          { id: 'out', label: 'Out of Scope' },
        ],
        items: [
          { id: 'c-ground', text: 'Antworten müssen aus den Hilfe-Docs belegt sein (Grounding)', bucketId: 'core', why: 'Ohne Grounding halluziniert der Bot Support-Antworten — der Kern der Verlässlichkeit.' },
          { id: 'c-approval', text: 'Rückerstattungen über 100 € brauchen menschliche Freigabe', bucketId: 'core', why: 'Eine teure, irreversible Aktion ohne Gate ist ein vermeidbarer Vorfall — Governance ist Pflicht.' },
          { id: 'c-eval', text: 'Ein Eval-Set, das Task-Erfolg und Grounding misst', bucketId: 'core', why: 'Ohne Messung ist jede Regression ein Ratespiel — nicht aufschiebbar.' },
          { id: 'c-lang', text: 'Antworten in 12 Sprachen', bucketId: 'nice', why: 'Wertvoll, aber nicht überlebenswichtig für die erste tragfähige Version.' },
          { id: 'c-avatar', text: 'Ein animiertes Avatar-Gesicht für den Bot', bucketId: 'out', why: 'Kosmetik ohne Bezug zur Kernaufgabe — raus.' },
          { id: 'c-finetune', text: 'Das Modell selbst auf Support-Daten fine-tunen', bucketId: 'out', why: 'AI-Engineering löst das über Retrieval, nicht über Training — und Fine-Tuning veraltet bei wechselnden Docs sofort.' },
        ],
        takeaway: 'Pflicht ist, was Verlässlichkeit und Sicherheit trägt (Grounding, Approval, Evals); Sprachen sind nice; Avatar und Fine-Tuning sind out.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'brief-first',
        format: 'pick',
        stem: 'Was legst du im System-Brief ZUERST fest, bevor ein Agent etwas baut?',
        options: [
          {
            id: 'criteria',
            text: 'Ziel + messbare Erfolgskriterien + Datenquelle + Sicherheits-/Governance-Grenzen.',
            correct: true,
            why: 'Diese vier steuern jede spätere Entscheidung. Ohne sie baut der Schwarm in unkontrollierte Richtungen.',
          },
          {
            id: 'stack',
            text: 'Den genauen Tech-Stack und das Framework.',
            correct: false,
            why: 'Implementierungsdetail — das darf der Agent innerhalb der Grenzen wählen; es ist nicht das, was den Erfolg definiert.',
          },
          {
            id: 'model',
            text: 'Welches Modell verwendet wird.',
            correct: false,
            why: 'Austauschbar und nachrangig gegenüber Ziel, Kriterien und Grenzen.',
          },
          {
            id: 'ui',
            text: 'Das genaue UI-Design des Chat-Fensters.',
            correct: false,
            why: 'Oberfläche, nicht Fundament — sie entscheidet nicht über Verlässlichkeit oder Sicherheit.',
          },
        ],
        takeaway: 'Ein System-Brief pinnt zuerst Ziel, messbare Kriterien, Datenquelle und Grenzen — Stack, Modell und UI folgen daraus.',
      },
    },
  ],
}
