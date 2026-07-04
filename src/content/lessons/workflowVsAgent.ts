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
        stem: 'Ein Team hat die Ticket-Sortierung als autonomen Agenten gebaut; die Demo lief fehlerfrei. Welchen laufenden Preis hat diese Wahl gegenüber einem festen Workflow — auch wenn der Agent korrekt arbeitet?',
        options: [
          {
            id: 'constant-tax',
            text: 'Jeder Lauf kann andere Schritte nehmen: Tests und Debugging werden schwerer, die Fehlerfläche breiter, Kosten und Latenz variabler — bezahlt bei JEDEM Lauf, ob die Freiheit gebraucht wird oder nicht.',
            correct: true,
            why: 'Autonomie ist eine laufende Komplexitäts-Steuer, keine einmalige Baukost. Für eine Aufgabe mit festen Schritten kauft sie nichts — und die Steuer fällt trotzdem an.',
          },
          {
            id: 'only-errors',
            text: 'Der Preis fällt nur an, wenn der Agent tatsächlich Fehler macht.',
            correct: false,
            why: 'Auch der fehlerfreie Agent kostet: jede Änderung muss gegen nicht-deterministische Läufe getestet werden, jedes Review muss mehr mögliche Pfade bedenken. Die Steuer ist konstant, nicht fehlerabhängig.',
          },
          {
            id: 'token-only',
            text: 'Nur die zusätzlichen Token der Agenten-Schleife.',
            correct: false,
            why: 'Zu eng: Token sind der sichtbarste, aber kleinste Posten. Der teure Teil ist Testbarkeit, Nachvollziehbarkeit und die breitere Fehlerfläche.',
          },
          {
            id: 'demo-proof',
            text: 'Keinen — die fehlerfreie Demo zeigt ja, dass die Wahl trägt.',
            correct: false,
            why: 'Eine Demo ist ein Lauf über gutmütige Eingaben. Der Preis der Autonomie zeigt sich in Produktion: seltene Eingaben, andere Pfade, schwerere Diagnose.',
          },
        ],
        takeaway: 'Autonomie hat eine konstante Betriebs-Steuer (Testbarkeit, Fehlerfläche, Varianz) — sie lohnt nur, wo offene Aufgaben sie verlangen. Für feste Schritte bleibt der Workflow die beherrschbarere Wahl.',
      },
    },
  ],
}
