import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-00-01 · entry node. Voice per control/10 VX rules (2026-07-05): situation-first,
// concrete anchors, no maxim takeaways. Concept: AI engineering composes existing models
// into reliable systems; ML engineering builds the models.
export const whatAiEngineeringBuilds: Lesson = {
  id: 'LESSON-00-01',
  roadmapNodeId: 'NODE-00-01',
  conceptIds: ['CONCEPT-AIE-001'],
  prerequisites: [],
  title: 'What AI Engineering Actually Builds',
  estimatedMinutes: 6,
  lessonMode: 'task-first',
  learningGoal: 'AI Engineering (Systeme aus Modellen bauen) von ML Engineering (Modelle bauen) trennen.',
  interactionType: 'failure-mode-tree',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-AIE-001', 'failure_mode_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Zwei Berufe, ein Buzzword',
      text: 'AI Engineers trainieren keine Modelle. Sie nehmen fertige (Claude, GPT, ein Embedding-Modell von der Stange) und bauen drumherum das, was aus einer Demo ein System macht: Retrieval, Tools, Evals, Guardrails. Das Modell selbst trainieren, Trainingsdaten kuratieren, an der Loss-Funktion drehen — das ist ML Engineering. Anderer Job, anderes Werkzeug.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-vs-mle',
        format: 'categorize',
        stem: 'Sprint-Planning bei einem Startup, das einen Support-Assistenten baut. Sechs Tickets liegen auf dem Board. Welche gehören zu dir (AI Engineering), welche ans ML-Team?',
        buckets: [
          { id: 'aie', label: 'Dein Board' },
          { id: 'mle', label: 'ML-Team' },
        ],
        items: [
          { id: 'w-rag', text: '„Suche über unsere 4 000 Hilfe-Artikel anbinden"', bucketId: 'aie', why: 'Retrieval über einen Bestandskorpus, mit fertigen Embedding-Modellen. Klassisches AI-Engineering-Ticket.' },
          { id: 'w-train', text: '„Eigenes Embedding-Modell für unsere Fachbegriffe trainieren"', bucketId: 'mle', why: 'Trainieren heißt Trainingsdaten, GPU-Zeit, Loss-Kurven. ML-Team.' },
          { id: 'w-tools', text: '„refund()-Tool absichern: Contract + Freigabe-Schritt"', bucketId: 'aie', why: 'Interface- und Governance-Arbeit um ein Modell herum, das schon existiert.' },
          { id: 'w-loss', text: '„Lernrate der Finetuning-Läufe optimieren"', bucketId: 'mle', why: 'Das spielt sich im Training ab. Ohne Trainings-Pipeline gibt es hier nichts zu tun.' },
          { id: 'w-eval', text: '„Messen, wie oft der Bot ein Ticket wirklich löst"', bucketId: 'aie', why: 'Task-Erfolg messen ist Systemarbeit. Kommt in ARC-07 ausführlich dran.' },
          { id: 'w-data', text: '„100 000 alte Support-Chats für Pretraining labeln"', bucketId: 'mle', why: 'Trainingsdaten herstellen. Modell-Seite.' },
        ],
        takeaway: 'Faustregel fürs Board: Braucht das Ticket Trainingsdaten oder GPU-Stunden, ist es ML. Braucht es Contracts, Belege oder Messung, ist es deins.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'aie-core',
        format: 'pick',
        stem: 'Der CTO fragt trocken: „Wenn ihr die Modelle nicht selbst baut — was baut ihr dann eigentlich?" Welche Antwort trifft es?',
        options: [
          {
            id: 'compose',
            text: 'Das System um das Modell: die Versorgung mit den richtigen Belegen, die Tool-Anbindung, die Messung, die Absicherung. Das Modell ist ein Bauteil davon.',
            correct: true,
            why: 'Und zwar das austauschbare Bauteil. Kommt nächstes Jahr ein besseres Modell, bleibt deine Arbeit stehen und füttert ab dann ein stärkeres Modell.',
          },
          {
            id: 'train',
            text: '„Wir finetunen die Modelle auf unsere Domäne."',
            correct: false,
            why: 'Kann mal ein Werkzeug sein, ist aber nicht der Beruf. Die meisten Produktionssysteme laufen komplett ohne eigenes Training.',
          },
          {
            id: 'prompt',
            text: '„Wir schreiben sehr gute Prompts."',
            correct: false,
            why: 'Prompts sind ein kleiner Teil und veralten mit jedem Modellwechsel. Wenn dein Berufsbild in einen Prompt passt, hat der CTO eine Folgefrage, die dir nicht gefällt.',
          },
          {
            id: 'api',
            text: '„Im Kern rufen wir eine API auf."',
            correct: false,
            why: 'So sieht der Prototyp aus. Zwischen dem API-Call und einem System, dem eine Firma ihre Kunden anvertraut, liegt der Rest dieser Roadmap.',
          },
        ],
        takeaway: 'Die CTO-Antwort ist nebenbei auch die Antwort auf „ersetzt AI nicht bald euren Job?": Modelle werden besser. Das System drumherum baut trotzdem jemand.',
      },
    },
  ],
}
