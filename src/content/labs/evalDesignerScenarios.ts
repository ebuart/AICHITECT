import type { LabScenario } from '@/features/labs/interactionModel'
import type { EvalScenarioData } from '@/features/labs/evalDesigner/types'

// Eval Designer scenarios (PHASE_6, PH-701). Success + regression are always the
// rigorous choice (format-only and spot-check are genuine traps); the grounding
// station carries the fit decision — skip it for a system without sources (base),
// require it for a RAG system (transfer). Teaches fit, not "measure everything" (PH-705).
export const evalDesignerScenarios: LabScenario<EvalScenarioData>[] = [
  {
    id: 'ED-BASE',
    interactionType: 'eval-designer',
    labId: 'LAB-EVAL-DESIGNER',
    roadmapNodeId: 'NODE-07-01',
    title: 'Eval Designer',
    prompt:
      'Entwirf den Eval für dieses System: miss echten Task-Erfolg, sichere Regressionen ab und entscheide, ob Grounding hier überhaupt zählt.',
    concepts: ['CONCEPT-EVAL-001', 'CONCEPT-EVAL-002', 'CONCEPT-EVAL-004'],
    prerequisites: ['NODE-07-01'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'ed-default',
    feedbackProfileId: 'ed-default',
    reviewHooks: ['eval_transfer'],
    scenarioData: {
      system:
        'Ein Klassifizierer, der eingehende Support-Tickets in feste Kategorien einordnet (Billing, Bug, Feature).',
      goal: 'Verlässlich die richtige Kategorie treffen. Keine externen Quellen, keine frei formulierten Antworten.',
      stations: [
        {
          id: 'success',
          dimension: 'success_metric_fit',
          label: 'Erfolgs-Kriterium',
          question: 'Was zählt als „bestanden“?',
          bestOptionId: 'task-success',
          options: [
            { id: 'task-success', label: 'Richtige Kategorie getroffen (Task-Erfolg)', rationale: 'Passt: misst das echte Outcome — die korrekte Einordnung.' },
            { id: 'format-only', label: 'Gültiger Kategorie-String (Format)', rationale: 'Falle: ein valider Enum-Wert kann trotzdem die falsche Kategorie sein.' },
          ],
        },
        {
          id: 'regression',
          dimension: 'regression_fit',
          label: 'Regression',
          question: 'Wie sicherst du bisherige Erfolge bei Änderungen?',
          bestOptionId: 'regression-set',
          options: [
            { id: 'regression-set', label: 'Regression-Set bekannter Tickets bei jeder Änderung', rationale: 'Passt: fängt stille Brüche, wenn ein Prompt-Tweak andere Fälle verschlechtert.' },
            { id: 'spot-check', label: 'Den neuen Fall einmal von Hand prüfen', rationale: 'Falle: Spot-Checks übersehen genau die stillen Regressionen.' },
          ],
        },
        {
          id: 'grounding',
          dimension: 'grounding_fit',
          label: 'Grounding',
          question: 'Brauchst du einen Grounding-Check?',
          bestOptionId: 'ground-skip',
          options: [
            { id: 'ground-skip', label: 'Kein Grounding-Eval', rationale: 'Passt: es gibt keine Quellen-Claims zu prüfen — nur eine Kategorie.' },
            { id: 'ground-check', label: 'Claims gegen Quellen prüfen', rationale: 'Hier fehl am Platz: das System leitet nichts aus Quellen ab.' },
            { id: 'trust-fluency', label: 'Antworten nach Formulierungsqualität bewerten', rationale: 'Nie ein Qualitätssignal — und hier gibt es gar keine Freitext-Antwort.' },
          ],
        },
      ],
    },
  },
  {
    id: 'ED-TRANSFER',
    interactionType: 'eval-designer',
    labId: 'LAB-EVAL-DESIGNER',
    roadmapNodeId: 'NODE-07-03',
    title: 'Eval Designer — Transfer: RAG-Assistent',
    prompt:
      'Geändertes System: gleicher Entscheidungsraum, andere Failure-Fläche. Entwirf den Eval, den dieses System verlangt.',
    concepts: ['CONCEPT-EVAL-002', 'CONCEPT-EVAL-003', 'CONCEPT-EVAL-004'],
    prerequisites: ['NODE-07-03'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: true,
    scoringProfileId: 'ed-default',
    feedbackProfileId: 'ed-default',
    reviewHooks: ['eval_transfer', 'grounding_eval_transfer'],
    scenarioData: {
      system:
        'Ein RAG-Assistent, der Fragen aus internen Dokumenten beantwortet und dabei Quellen zitiert.',
      goal: 'Korrekte, belegte Antworten — jede Aussage muss durch die abgerufenen Quellen gestützt sein.',
      stations: [
        {
          id: 'success',
          dimension: 'success_metric_fit',
          label: 'Erfolgs-Kriterium',
          question: 'Was zählt als „bestanden“?',
          bestOptionId: 'task-success',
          options: [
            { id: 'task-success', label: 'Frage inhaltlich korrekt beantwortet (Task-Erfolg)', rationale: 'Passt: misst, ob die echte Frage richtig beantwortet wurde.' },
            { id: 'format-only', label: 'Antwort ist gültiges JSON (Format)', rationale: 'Falle: parsebar heißt nicht korrekt — die Antwort kann frei erfunden sein.' },
          ],
        },
        {
          id: 'regression',
          dimension: 'regression_fit',
          label: 'Regression',
          question: 'Wie sicherst du bisherige Erfolge bei Änderungen?',
          bestOptionId: 'regression-set',
          options: [
            { id: 'regression-set', label: 'Regression-Set bekannter Q&A bei jeder Änderung', rationale: 'Passt: ein Retrieval-/Prompt-Wechsel darf alte korrekte Antworten nicht brechen.' },
            { id: 'spot-check', label: 'Die neue Antwort einmal lesen', rationale: 'Falle: übersieht stille Regressionen in zuvor korrekten Fragen.' },
          ],
        },
        {
          id: 'grounding',
          dimension: 'grounding_fit',
          label: 'Grounding',
          question: 'Brauchst du einen Grounding-Check?',
          bestOptionId: 'ground-check',
          options: [
            { id: 'ground-skip', label: 'Kein Grounding-Eval', rationale: 'Riskant: ungestützte, halluzinierte Claims bleiben unentdeckt.' },
            { id: 'ground-check', label: 'Claims gegen Quellen prüfen', rationale: 'Passt: jede Aussage muss durch eine abgerufene Quelle gestützt sein.' },
            { id: 'trust-fluency', label: 'Antworten nach Formulierungsqualität bewerten', rationale: 'Falle: gerade die souveränsten Halluzinationen bestehen so.' },
          ],
        },
      ],
    },
  },
  {
    id: 'EVO-BASE',
    interactionType: 'eval-designer',
    labId: 'LAB-EVAL-DESIGNER',
    roadmapNodeId: 'NODE-04-04',
    title: 'Evaluator-Optimizer — den Evaluator entwerfen',
    prompt:
      'Eine Generator-Evaluator-Schleife optimiert in die Richtung, die der Evaluator misst. Entwirf den Evaluator so, dass die Schleife echten Erfolg anstrebt.',
    concepts: ['CONCEPT-CF-006'],
    prerequisites: ['NODE-04-03'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'ed-default',
    feedbackProfileId: 'ed-default',
    reviewHooks: ['eval_transfer'],
    scenarioData: {
      system:
        'Eine Generator-Evaluator-Schleife: ein Modell schlägt SQL-Queries vor, ein Evaluator bewertet sie und fordert Korrekturen, bis sie „bestehen“.',
      goal: 'Der Evaluator steuert die Optimierung. Misst er das Falsche, klettert die Schleife auf einen schlechten Proxy.',
      stations: [
        {
          id: 'success',
          dimension: 'success_metric_fit',
          label: 'Erfolgs-Kriterium',
          question: 'Woran misst der Evaluator Erfolg?',
          bestOptionId: 'task-success',
          options: [
            { id: 'task-success', label: 'Query liefert das korrekte Ergebnis auf einer Test-DB', rationale: 'Passt: misst echtes Outcome — die Schleife optimiert auf Korrektheit.' },
            { id: 'self-rating', label: 'Das Generator-Modell bewertet seine eigene Query als gut', rationale: 'Falle: die Schleife optimiert dann auf Selbstüberzeugung, nicht auf richtige Ergebnisse.' },
            { id: 'compiles', label: 'Query ist syntaktisch gültiges SQL', rationale: 'Falle: syntaktisch korrekt heißt nicht, dass sie das Richtige zurückgibt.' },
          ],
        },
        {
          id: 'regression',
          dimension: 'regression_fit',
          label: 'Regression',
          question: 'Wie sicherst du bisherige Erfolge bei Änderungen?',
          bestOptionId: 'regression-set',
          options: [
            { id: 'regression-set', label: 'Regression-Set bekannter Query-Aufgaben bei jeder Änderung', rationale: 'Passt: ein besserer Evaluator/Prompt darf alte gelöste Fälle nicht brechen.' },
            { id: 'spot-check', label: 'Die neue Query einmal ansehen', rationale: 'Falle: Spot-Checks übersehen stille Regressionen.' },
          ],
        },
        {
          id: 'grounding',
          dimension: 'grounding_fit',
          label: 'Grounding',
          question: 'Brauchst du einen Grounding-Check?',
          bestOptionId: 'ground-skip',
          options: [
            { id: 'ground-skip', label: 'Kein Grounding-Eval', rationale: 'Passt: Korrektheit zeigt sich am Ausführungsergebnis, nicht an Quellen-Claims.' },
            { id: 'ground-check', label: 'Claims gegen Quellen prüfen', rationale: 'Fehl am Platz: hier wird nichts aus Quellen zitiert, sondern ausgeführt.' },
            { id: 'trust-fluency', label: 'Query nach Plausibilität der Begründung bewerten', rationale: 'Nie ein Qualitätssignal — die Ausführung entscheidet.' },
          ],
        },
      ],
    },
  },
  {
    id: 'TSR-BASE',
    interactionType: 'eval-designer',
    labId: 'LAB-EVAL-DESIGNER',
    roadmapNodeId: 'NODE-07-02',
    title: 'Task Success & Regression',
    prompt:
      'Das Team „verbessert“ den Prompt laufend. Entwirf den Eval, der echten Erfolg misst und stille Regressionen blockt.',
    concepts: ['CONCEPT-EVAL-001', 'CONCEPT-EVAL-002'],
    prerequisites: ['NODE-07-01'],
    difficulty: 'core',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'ed-default',
    feedbackProfileId: 'ed-default',
    reviewHooks: ['eval_transfer'],
    scenarioData: {
      system:
        'Ein Funktions-Aufruf-Planer: wandelt eine User-Anfrage in den richtigen Tool-Call mit Argumenten.',
      goal: 'Den richtigen Call mit korrekten Argumenten wählen — und verhindern, dass ein Prompt-Tweak alte korrekte Fälle still bricht.',
      stations: [
        {
          id: 'success',
          dimension: 'success_metric_fit',
          label: 'Erfolgs-Kriterium',
          question: 'Was zählt als „bestanden“?',
          bestOptionId: 'task-success',
          options: [
            { id: 'task-success', label: 'Richtiger Tool-Call mit korrekten Argumenten (Task-Erfolg)', rationale: 'Passt: misst das echte Outcome der Planung.' },
            { id: 'valid-json', label: 'Antwort ist gültiges Function-Call-JSON (Format)', rationale: 'Falle: parsebar heißt nicht, dass Tool oder Argumente stimmen.' },
            { id: 'length', label: 'Begründung ist ausführlich genug', rationale: 'Falle: eine Vanity-/Proxy-Metrik, die nicht mit Korrektheit korreliert.' },
          ],
        },
        {
          id: 'regression',
          dimension: 'regression_fit',
          label: 'Regression',
          question: 'Wie sicherst du bisherige Erfolge bei Änderungen?',
          bestOptionId: 'regression-set',
          options: [
            { id: 'regression-set', label: 'Regression-Set bekannter Anfragen bei jedem Prompt-Tweak', rationale: 'Passt: fängt genau die stillen Brüche, die ein „kleiner“ Tweak auslöst.' },
            { id: 'spot-check', label: 'Den geänderten Fall einmal prüfen', rationale: 'Falle: testet nur den neuen Fall, nicht die vielen alten.' },
          ],
        },
        {
          id: 'grounding',
          dimension: 'grounding_fit',
          label: 'Grounding',
          question: 'Brauchst du einen Grounding-Check?',
          bestOptionId: 'ground-skip',
          options: [
            { id: 'ground-skip', label: 'Kein Grounding-Eval', rationale: 'Passt: der Planer leitet nichts aus Quellen ab — er wählt Tool + Argumente.' },
            { id: 'ground-check', label: 'Claims gegen Quellen prüfen', rationale: 'Fehl am Platz: es gibt keine quellengestützten Aussagen zu prüfen.' },
            { id: 'trust-fluency', label: 'Antworten nach Formulierungsqualität bewerten', rationale: 'Nie ein Qualitätssignal — und hier irrelevant.' },
          ],
        },
      ],
    },
  },
  {
    id: 'CEG-BASE',
    interactionType: 'eval-designer',
    labId: 'LAB-EVAL-DESIGNER',
    roadmapNodeId: 'NODE-10-04',
    title: 'Capstone — Eval Governance',
    prompt:
      'Dein Capstone-Assistent geht in Produktion. Entwirf den Eval als Deploy-Gate: kein Release ohne grün.',
    concepts: ['CONCEPT-EVAL-002', 'CONCEPT-EVAL-003', 'CONCEPT-PROD-002'],
    prerequisites: ['NODE-10-03'],
    difficulty: 'advanced',
    estimatedMinutes: 7,
    isTransfer: false,
    scoringProfileId: 'ed-default',
    feedbackProfileId: 'ed-default',
    reviewHooks: ['eval_transfer', 'grounding_eval_transfer'],
    scenarioData: {
      system:
        'Der Capstone-Assistent in Produktion: RAG über interne Docs + Tools, von einem ganzen Team genutzt.',
      goal: 'Governance: jeder Deploy muss durch ein Eval-Gate — echter Task-Erfolg, Regressions-Schutz und Grounding zusammen.',
      stations: [
        {
          id: 'success',
          dimension: 'success_metric_fit',
          label: 'Erfolgs-Kriterium',
          question: 'Was gilt als „bestanden“ fürs Deploy-Gate?',
          bestOptionId: 'task-success',
          options: [
            { id: 'task-success', label: 'End-to-end Task-Erfolg auf einem repräsentativen Set', rationale: 'Passt: misst echten Nutzen über realistische Fälle.' },
            { id: 'smoke-only', label: 'Eine Handvoll Smoke-Tests müssen grün sein', rationale: 'Falle: grün auf trivialen Fällen verdeckt Fehler in den schweren.' },
            { id: 'ci-green', label: 'Unit-Tests/CI sind grün', rationale: 'Falle: testet den Code, nicht die Antwortqualität des Systems.' },
          ],
        },
        {
          id: 'regression',
          dimension: 'regression_fit',
          label: 'Regression',
          question: 'Wie schützt du bestehende Qualität beim Release?',
          bestOptionId: 'regression-set',
          options: [
            { id: 'regression-set', label: 'Regression-Gate: bekannter Q&A-Satz blockt den Deploy bei Bruch', rationale: 'Passt: macht stille Regressionen zum Release-Blocker.' },
            { id: 'manual-signoff', label: 'Ein Reviewer gibt den Release frei', rationale: 'Falle: menschlicher Spot-Check skaliert nicht und übersieht stille Brüche.' },
          ],
        },
        {
          id: 'grounding',
          dimension: 'grounding_fit',
          label: 'Grounding',
          question: 'Brauchst du einen Grounding-Check?',
          bestOptionId: 'ground-check',
          options: [
            { id: 'ground-check', label: 'Claims gegen die abgerufenen Quellen prüfen', rationale: 'Passt: das System zitiert Quellen — ungestützte Claims müssen durchfallen.' },
            { id: 'ground-skip', label: 'Kein Grounding-Eval', rationale: 'Riskant: halluzinierte, scheinbar belegte Aussagen bleiben unentdeckt.' },
            { id: 'trust-fluency', label: 'Antworten nach Formulierungsqualität bewerten', rationale: 'Falle: die souveränsten Halluzinationen bestehen so.' },
          ],
        },
      ],
    },
  },
]
