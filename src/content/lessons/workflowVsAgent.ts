import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-04-01 · post-template redesign, HARD. Bespoke puzzle exercises (categorize · pick). The
// core control-flow judgment: a predictable task → fixed workflow (simplest, cheapest, testable);
// an open task whose steps aren't known up front → an agent. The default bias is workflow; an
// agent is the exception that must earn its place.
export const workflowVsAgent: Lesson = {
  id: 'LESSON-04-01',
  roadmapNodeId: 'NODE-04-01',
  conceptIds: ['CONCEPT-CF-001'],
  prerequisites: ['NODE-03-04'],
  title: 'Workflow vs Agent',
  estimatedMinutes: 8,
  lessonMode: 'task-first',
  learningGoal: 'Zwischen vorhersehbarem Workflow und autonomem Agent begründet wählen.',
  interactionType: 'architecture-builder',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-OVERENGINEERED-AGENTS',
  reviewHooks: ['CONCEPT-CF-001', 'overengineering_repair'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Workflow oder Agent?',
      text: 'Ein Workflow führt feste, vorab bekannte Schritte aus — vorhersehbar, billig, testbar. Ein Agent entscheidet selbst, welche Schritte nötig sind — nötig nur, wenn die Schritte vorab NICHT feststehen. Default ist der Workflow; der Agent muss sich verdienen.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'task-shape',
        format: 'categorize',
        stem: 'Workflow oder Agent — was passt zur Form der Aufgabe?',
        buckets: [
          { id: 'workflow', label: 'Workflow (fest)' },
          { id: 'agent', label: 'Agent (autonom)' },
        ],
        items: [
          { id: 't-extract', text: 'PDF-Rechnungen in eine feste JSON-Struktur extrahieren', bucketId: 'workflow', why: 'Immer dieselben Schritte, bekanntes Zielformat — ein fester Ablauf reicht.' },
          { id: 't-bug', text: 'Einen unbekannten Bug in einem fremden Repo finden und fixen', bucketId: 'agent', why: 'Die nötigen Schritte hängen davon ab, was die Exploration findet — vorab nicht planbar.' },
          { id: 't-route', text: 'Eingehende Mails in 3 Typen klassifizieren und je eine Standardantwort senden', bucketId: 'workflow', why: 'Klassifizieren → routen; ein deterministisches Routing-Muster.' },
          { id: 't-research', text: 'Ein Thema aus mehreren, vorab unbekannten Quellen recherchieren und einen Bericht schreiben', bucketId: 'agent', why: 'Offen und dynamisch: welche Quellen, wie tief — ergibt sich erst im Lauf.' },
          { id: 't-report', text: 'Täglich denselben Report aus derselben Datenbank erzeugen', bucketId: 'workflow', why: 'Vollständig vorhersehbar — ein Cronjob mit festen Schritten.' },
          { id: 't-trip', text: 'Eine mehrteilige Reise unter wechselnden Verfügbarkeiten planen und buchen', bucketId: 'agent', why: 'Der Plan muss auf Zwischenergebnisse (ausgebucht, teurer) reagieren — adaptive Schritte.' },
        ],
        takeaway: 'Stehen die Schritte vorab fest → Workflow. Hängen sie von Zwischenergebnissen ab und sind nicht planbar → Agent.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'default-bias',
        format: 'pick',
        stem: 'Eine Aufgabe ließe sich als fester Workflow ODER als Agent lösen. Was ist die richtige Default-Haltung?',
        options: [
          {
            id: 'workflow-default',
            text: 'Den Workflow nehmen, solange die Schritte feststehen — der Agent ist die Ausnahme für echt offene Aufgaben.',
            correct: true,
            why: 'Weniger bewegliche Teile heißt weniger Kosten, weniger Fehlerquellen, bessere Testbarkeit. Autonomie nur einführen, wo sie nötig ist.',
          },
          {
            id: 'agent-modern',
            text: 'Den Agenten nehmen — er ist flexibler und zukunftssicherer.',
            correct: false,
            why: 'Flexibilität, die die Aufgabe nicht braucht, ist nur zusätzliches Risiko und Kosten. „Moderner" ist kein Architektur-Argument.',
          },
          {
            id: 'llm-agent',
            text: 'Sobald ein LLM beteiligt ist, ist es automatisch ein Agent.',
            correct: false,
            why: 'Ein LLM-Schritt in einem festen Ablauf ist trotzdem ein Workflow — Autonomie ist das Unterscheidungsmerkmal, nicht „LLM ja/nein".',
          },
          {
            id: 'biggest',
            text: 'Immer das mächtigste Setup, dann ist man auf alles vorbereitet.',
            correct: false,
            why: 'Über-Engineering: Mächtigkeit, die man nicht nutzt, zahlt man trotzdem in Komplexität und Betrieb.',
          },
        ],
        takeaway: 'So einfach wie möglich, so autonom wie nötig — Workflow ist der Default, der Agent verdient sich seinen Platz an offenen Aufgaben.',
      },
    },
  ],
}
