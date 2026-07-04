import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-03-04 · post-template redesign, HARD. Bespoke puzzle exercises (match · pick). MCP
// standardises tool/data integration over ONE protocol so an agent plugs into many providers
// without N bespoke integrations — but a third-party server is a new trust boundary.
export const mcpToolEcosystems: Lesson = {
  id: 'LESSON-03-04',
  roadmapNodeId: 'NODE-03-04',
  conceptIds: ['CONCEPT-TOOL-005'],
  prerequisites: ['NODE-03-03'],
  title: 'MCP and Tool Ecosystems',
  estimatedMinutes: 7,
  lessonMode: 'multiple-viewpoints',
  learningGoal: 'Standardisierte Tool-Anbindung über ein Protokoll modellieren — inklusive ihrer Vertrauensgrenze.',
  interactionType: 'architecture-builder',
  visualModelId: 'systemRow',
  feedbackPatternId: 'FB-PATTERN-AMBIGUOUS-TOOL-CONTRACT',
  reviewHooks: ['CONCEPT-TOOL-005'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'MCP: ein Protokoll für viele Tools',
      text: 'Statt für jedes System (CRM, Kalender, Tickets) eine eigene Integration zu bauen, standardisiert ein Protokoll wie MCP die Anbindung: Server stellen Tools bereit, der Agent (Client) bindet sie über denselben Contract ein.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'mcp-roles',
        format: 'match',
        stem: 'Ordne jedem MCP-Begriff seine Rolle zu.',
        pairs: [
          { id: 'server', left: 'MCP-Server', right: 'Stellt Tools/Ressourcen über das Standard-Protokoll bereit', why: 'Z. B. ein CRM-Server, der „get_customer" anbietet.' },
          { id: 'client', left: 'MCP-Client (Host)', right: 'Der Agent/die App, die Server einbindet und ihre Tools aufruft', why: 'Spricht jeden Server gleich an — kein server-spezifischer Code.' },
          { id: 'discovery', left: 'Tool-Discovery', right: 'Der Client fragt zur Laufzeit ab, welche Tools ein Server anbietet', why: 'Neue Tools werden verfügbar, ohne den Client neu zu bauen.' },
          { id: 'schema', left: 'Standard-Schema', right: 'Jedes Tool beschreibt sich gleich — der Agent muss pro Server nichts Eigenes lernen', why: 'Genau das macht aus N Integrationen eine.' },
        ],
        takeaway: 'Server bieten an, der Client bindet ein, Discovery findet die Tools, ein Standard-Schema macht alle gleich ansprechbar.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'mcp-risk',
        format: 'pick',
        stem: 'Du bindest einen Drittanbieter-MCP-Server ein, der praktische Tools mitbringt. Was ist das Hauptrisiko?',
        options: [
          {
            id: 'trust',
            text: 'Der fremde Server ist eine neue Vertrauensgrenze: seine Tool-Ausgaben sind untrusted und er könnte mehr Rechte verlangen, als nötig.',
            correct: true,
            why: 'Ein eingebundener Server kann Daten zurückschleusen, die als „Tool-Ergebnis" ins Prompt fließen (Injection-Fläche), und breite Scopes anfordern. Least Privilege + Tool-Output als untrusted behandeln.',
          },
          {
            id: 'latency',
            text: 'Vor allem die zusätzliche Latenz des Netzwerk-Aufrufs.',
            correct: false,
            why: 'Latenz ist ein Detail; das Sicherheitsrisiko einer fremden, eingebundenen Code-/Datenquelle wiegt weit schwerer.',
          },
          {
            id: 'format',
            text: 'Dass das Tool-Schema nicht zum Standard passt.',
            correct: false,
            why: 'Gerade das löst MCP ja — das Schema ist standardisiert. Das Risiko liegt im Vertrauen, nicht im Format.',
          },
          {
            id: 'none',
            text: 'Kein nennenswertes Risiko — MCP ist ein Sicherheitsstandard.',
            correct: false,
            why: 'MCP standardisiert die Anbindung, nicht das Vertrauen. Wer einen Server einbindet, übernimmt dessen Risiko.',
          },
        ],
        takeaway: 'Ein eingebundener MCP-Server ist Fremdcode in deinem Vertrauensbereich: enge Scopes, Tool-Output als untrusted, und nur einbinden, wem du traust.',
      },
    },
  ],
}
