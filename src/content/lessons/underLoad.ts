import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-14-01 · opener of the ARCHITECTURE-PHYSICS track (ARC-14, OQ-0017). Built in the
// control/10 protocol grammar from the first commit: Akte first (IX-11), raw metrics
// (IX-12), guided load protocol (EXP-LOAD), then Little's-Law computation and a transfer.
// The life-pattern: the supermarket checkout. Two registers, a queue, and everything
// queueing theory has to say about production systems.
export const underLoad: Lesson = {
  id: 'LESSON-14-01',
  roadmapNodeId: 'NODE-14-01',
  conceptIds: ['CONCEPT-SYS-001'],
  prerequisites: ['NODE-01-03'],
  title: 'Under Load: Queues & Backpressure',
  estimatedMinutes: 12,
  lessonMode: 'worked-trace-first',
  learningGoal: 'Systeme unter Last lesen: Kapazität, Warteschlangen, Retry-Stürme, Backpressure.',
  interactionType: 'agent-trace-debugger',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-SYS-001'],
  blocks: [
    {
      kind: 'dossier',
      intro: 'Gleiche Firma wie im letzten Fall. Diesmal meldet sich der Assistent nicht mit falschen Antworten, sondern gar nicht mehr.',
      files: [
        {
          name: 'infra/llm-gateway.md',
          meta: 'Architektur-Notiz',
          body: `## LLM-Gateway

Anfragen laufen über ein Gateway mit
2 parallelen Slots (Provider-Konto,
Concurrency-Limit).

Eine Antwort dauert ~1,0 s.
Rechnerische Kapazität: 2 Antworten/s.

Warteschlange: unbegrenzt (Default).
Client-Timeout: keiner gesetzt.`,
        },
        {
          name: 'monitoring/dienstag.log',
          meta: '10:00–10:20 Uhr',
          body: `09:55  neu/s: 1,2   warteschlange: 0
10:00  ▸ LinkedIn-Post live (Marketing)
10:02  neu/s: 2,4   warteschlange: 3
10:05  neu/s: 3,5   warteschlange: 41
10:08  neu/s: 3,5   warteschlange: 118
10:11  erste beschwerden: "hängt"
10:14  neu/s: 3,4   warteschlange: 219
10:20  neu/s: 3,5   warteschlange: 344`,
        },
        {
          name: '#status (Slack)',
          meta: 'Dienstag, 10:16',
          body: `[10:16] Aylin: Assistent antwortet nicht
mehr, Anfragen laufen ins Leere.

[10:17] Jonas: Timeout ist nicht gesetzt,
soll ich 8 s Timeout + automatischen
Retry einbauen? Dann merkt der Nutzer
wenigstens was.

[10:19] Aylin: klingt vernünftig?`,
        },
        {
          name: 'provider/limits.md',
          meta: 'Auszug Anbieter-Doku',
          body: `Rate Limits (euer Tier):

  Concurrency:  2 parallele Requests
  RPM:          150 requests/min
  TPM:          80 000 tokens/min

Bei Überschreitung: HTTP 429.
Empfehlung: Anfragen client-seitig
begrenzen statt blind wiederholen.`,
        },
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Zwei Kassen, ein Ansturm',
      text: 'Das Gateway ist ein Supermarkt mit zwei Kassen. Dienstag um 10:00 kam der Ansturm. Unten läuft der Vormittag fünfmal ab, mit unterschiedlichen Stellschrauben, inklusive Jonas\' Timeout-Idee aus dem Slack.',
    },
    {
      kind: 'explorer',
      explorerId: 'EXP-LOAD',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'littles-law',
        format: 'pick',
        stem: 'Mittwoch, neuer Stau: Die Warteschlange steht bei 40, der Durchsatz bei 2/s. Ein Kollege fragt, wie lange eine Anfrage wartet, die sich jetzt anstellt. Die Rechnung aus dem Protokoll:',
        options: [
          {
            id: 'twenty',
            text: '~20 Sekunden: 40 Wartende geteilt durch 2 abgearbeitete pro Sekunde.',
            correct: true,
            why: 'Little\'s Law, rückwärts gelesen: Wartezeit = Schlange / Durchsatz. Die Rechnung braucht keine Monitoring-Suite, nur zwei Zahlen, und funktioniert an jeder Kasse der Welt.',
          },
          {
            id: 'two',
            text: '~2 Sekunden: das System schafft ja 2 pro Sekunde.',
            correct: false,
            why: 'Der Durchsatz sagt, wie schnell die Schlange schrumpft, nicht wie lang sie ist. Vor der Anfrage stehen 40 andere.',
          },
          {
            id: 'forty',
            text: '~40 Sekunden: eine Sekunde pro Wartendem.',
            correct: false,
            why: 'Das rechnet mit einem Slot. Es arbeiten zwei parallel, die Schlange leert sich doppelt so schnell.',
          },
          {
            id: 'unknowable',
            text: 'Nicht abschätzbar, dafür braucht es Load-Tests.',
            correct: false,
            why: 'Für Prognosen unter neuen Bedingungen ja. Für die aktuelle Wartezeit reichen Schlange und Durchsatz, das ist der Witz an Little\'s Law.',
          },
        ],
        takeaway: 'Schlange / Durchsatz = Wartezeit. Zwei ablesbare Zahlen ersetzen das Rätselraten, wie schlimm es gerade ist.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'transfer-blackfriday',
        format: 'pick',
        stem: 'Anderes Team, gleiche Physik: Deren RAG-Suche rechnet mit dem Fünffachen der üblichen Last am Black Friday. Das Budget erlaubt keine zusätzlichen Slots. Welcher Umbau übersteht den Tag?',
        options: [
          {
            id: 'shed',
            text: 'Warteschlange hart begrenzen, Überschuss sofort mit 429 + „bitte später" beantworten, interne Batch-Jobs für den Tag pausieren.',
            correct: true,
            why: 'Backpressure plus Priorität: Die begrenzte Schlange hält die Wartezeit der Bedienten endlich, das Absagen ist ehrlich, und die gestrichenen Batch-Jobs geben die Slots den Kunden. Lauf 4, in Produktion.',
          },
          {
            id: 'retry',
            text: 'Automatische Retries mit drei Versuchen, damit keine Anfrage verloren geht.',
            correct: false,
            why: 'Lauf 3, verschärft: Unter Überlast verdreifachen Retries die Last im schlechtesten Fall. Genau dann, wenn das System es am wenigsten tragen kann.',
          },
          {
            id: 'timeout',
            text: 'Client-Timeout von 30 auf 180 Sekunden erhöhen, dann brechen weniger Anfragen ab.',
            correct: false,
            why: 'Die Schlange wächst bei Ankunft über Kapazität trotzdem grenzenlos. Längeres Warten verteilt das Scheitern nur nach hinten, an wartende Kunden.',
          },
          {
            id: 'cache-nothing',
            text: 'Ein Dashboard mit Live-Metriken aufsetzen, um den Tag eng zu überwachen.',
            correct: false,
            why: 'Sehenswert, aber zuschauen ist kein Ventil. Ohne Begrenzung zeigt das Dashboard nur präziser, wie die Schlange ins Unendliche wächst.',
          },
        ],
        takeaway: 'Wenn Kapazität fest ist, bleiben genau zwei Hebel: weniger annehmen (ehrlich absagen) oder Unwichtiges streichen. Alles andere verschiebt das Problem.',
      },
    },
  ],
}
