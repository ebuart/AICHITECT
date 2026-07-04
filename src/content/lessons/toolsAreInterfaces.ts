import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-03-01 · post-template redesign, HARD. Bespoke puzzle exercises (cloze on a real tool
// schema · match · pick). The tool's DESCRIPTION + SCHEMA is the contract the model reads to
// decide whether/how to call it — ambiguity there produces wrong calls. Durable skill: design
// the interface tight, parseable, single-purpose.
export const toolsAreInterfaces: Lesson = {
  id: 'LESSON-03-01',
  roadmapNodeId: 'NODE-03-01',
  conceptIds: ['CONCEPT-TOOL-001', 'CONCEPT-TOOL-002'],
  prerequisites: ['NODE-02-04'],
  title: 'Tools Are Interfaces',
  estimatedMinutes: 8,
  lessonMode: 'task-first',
  learningGoal: 'Den Tool-Contract (Beschreibung + Schema) so gestalten, dass das Modell richtig aufruft.',
  interactionType: 'tool-contract-forge',
  visualModelId: null,
  feedbackPatternId: null,
  reviewHooks: ['CONCEPT-TOOL-001', 'least_privilege_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Das Schema ist der Contract',
      text: 'Ein Tool ist ein Interface zwischen Agent und System. Das Modell entscheidet allein aus Beschreibung und Schema, OB und WIE es aufruft. Ist der Contract vage, ruft es zur falschen Zeit, mit falschen Werten oder ohne Pflichtfelder auf.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'fill-tool',
        format: 'cloze',
        stem: 'Vervollständige den Contract für „search_orders" so, dass das Modell ihn zuverlässig richtig nutzt.',
        code: `{
  "name": "search_orders",
  "description": ▢1,
  "parameters": {
    "type": "object",
    "properties": {
      "customer_id": { "type": "string" },
      "status": {
        "type": "string",
        "enum": ▢2
      },
      "limit": { "type": ▢3, "default": 20 }
    },
    "required": ▢4
  }
}`,
        blanks: [
          {
            id: 'desc',
            label: 'description',
            options: [
              { id: 'good', text: '"Sucht Bestellungen eines Kunden nach Status. Nutzen, wenn nach Bestellhistorie/Status gefragt wird — nicht für Zahlungen oder Stornos."', correct: true, why: 'Sagt WAS das Tool tut UND WANN man es nutzt (und wann nicht). Genau diesen Text liest das Modell, um zu entscheiden.' },
              { id: 'vague', text: '"Eine Funktion rund um Bestellungen."', correct: false, why: 'Zu vage — das Modell kann nicht ableiten, wann der Aufruf passt, und ruft zur falschen Zeit (oder gar nicht) auf.' },
              { id: 'all', text: '"Sucht alles im System."', correct: false, why: 'Falsch und gefährlich: verspricht mehr als das Tool kann und lädt zu Fehlaufrufen ein.' },
            ],
          },
          {
            id: 'enum',
            label: 'status.enum',
            options: [
              { id: 'arr', text: '["open","shipped","delivered","cancelled"]', correct: true, why: 'Ein enum bindet status an gültige Werte — das Modell kann keine erfinden.' },
              { id: 'free', text: 'weglassen (freier String)', correct: false, why: 'Ohne enum erfindet das Modell Werte wie „pending" oder „unknown", die das System nicht kennt.' },
              { id: 'str', text: '"open|shipped|delivered"', correct: false, why: 'Das ist ein String, kein Array — als enum ungültig; jeder Wert würde durchgehen.' },
            ],
          },
          {
            id: 'limit',
            label: 'limit.type',
            options: [
              { id: 'int', text: '"integer"', correct: true, why: 'limit ist eine Anzahl — eine Ganzzahl.' },
              { id: 'string', text: '"string"', correct: false, why: 'Verleitet das Modell zu „20" als Text; das System muss dann raten/parsen.' },
              { id: 'bool', text: '"boolean"', correct: false, why: 'Eine Obergrenze ist keine Ja/Nein-Größe.' },
            ],
          },
          {
            id: 'req',
            label: 'required',
            options: [
              { id: 'cust', text: '["customer_id"]', correct: true, why: 'Nur customer_id ist nötig; status und limit haben sinnvolle Defaults und bleiben optional.' },
              { id: 'all3', text: '["customer_id","status","limit"]', correct: false, why: 'Über-streng: erzwingt status/limit, obwohl Defaults reichen — jeder einfache Aufruf würde ungültig.' },
              { id: 'none', text: '[]', correct: false, why: 'Ohne customer_id sucht das Tool über alle Kunden — zu breit und meist sinnlos.' },
            ],
          },
        ],
        takeaway: 'Beschreibung (was + wann), enum für feste Werte, passende Typen und ein required nur fürs wirklich Nötige — so liest das Modell den Contract eindeutig.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'contract-consequences',
        format: 'match',
        stem: 'Ordne jedem Contract-Mangel seine typische Folge zu.',
        pairs: [
          { id: 'vague', left: 'Vage Beschreibung', right: 'Das Modell ruft zur falschen Zeit auf — oder gar nicht', why: 'Ohne klares „wann" rät das Modell den Einsatzzeitpunkt.' },
          { id: 'noenum', left: 'Kein enum bei status', right: 'Das Modell erfindet ungültige Werte wie „pending"', why: 'Ohne erlaubte Werte füllt das Modell frei — das System kennt sie nicht.' },
          { id: 'noreq', left: 'Fehlendes required-Feld', right: 'Aufruf ohne Pflichtwert → Tool schlägt zur Laufzeit fehl', why: 'Optionalität, die nicht optional ist, bricht erst in Produktion.' },
          { id: 'twojobs', left: 'Tool macht zwei Dinge (Suchen + Stornieren)', right: 'Das Modell löst ungewollt die Nebenwirkung aus', why: 'Ein Tool, eine Aufgabe — sonst kommt die gefährliche Hälfte unbeabsichtigt mit.' },
        ],
        takeaway: 'Jede Unschärfe im Contract hat eine konkrete Laufzeitfolge — der Schaden entsteht nicht im Schema, sondern beim Aufruf.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'tool-principle',
        format: 'pick',
        stem: 'Du gibst einem Agenten ein „manage_orders"-Tool, das suchen, ändern UND stornieren kann. Was ist die bessere Gestaltung?',
        options: [
          {
            id: 'split',
            text: 'In getrennte Tools aufteilen (search / update / cancel), jedes mit eigenem, engem Contract.',
            correct: true,
            why: 'Ein Tool pro Aufgabe: das Modell kann nicht versehentlich stornieren, wenn es nur suchen sollte, und jede gefährliche Aktion bekommt ihre eigene Kontrolle/Gate.',
          },
          {
            id: 'param',
            text: 'Ein Tool lassen, aber einen Parameter action: "search"|"cancel" einführen.',
            correct: false,
            why: 'Die destruktive Fähigkeit bleibt nur einen Parameter entfernt — ein falsch gewählter action-Wert storniert. Least Privilege heißt: gar nicht erst anbieten.',
          },
          {
            id: 'prompt',
            text: 'Ein Tool lassen und im System-Prompt schreiben „storniere nur, wenn nötig".',
            correct: false,
            why: 'Eine Prompt-Bitte ist kein Schutz — Injection oder ein Fehlschluss umgeht sie. Die Fähigkeit existiert weiter.',
          },
          {
            id: 'bigger',
            text: 'Ein Tool lassen; ein stärkeres Modell ruft es schon richtig auf.',
            correct: false,
            why: 'Die Gestaltung des Interfaces ist unabhängig vom Modell — ein breiter Contract bleibt ein breiter Angriffs-/Fehler-Raum.',
          },
        ],
        takeaway: 'Ein Tool, eine Aufgabe, ein enger Contract — gefährliche Fähigkeiten trennt man heraus, statt sie hinter einem Parameter oder einer Bitte zu verstecken.',
      },
    },
  ],
}
