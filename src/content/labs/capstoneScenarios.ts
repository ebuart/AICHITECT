import type { LabScenario } from '@/features/labs/interactionModel'
import type { CapstoneScenarioData } from '@/features/labs/capstoneSimulator/types'

// Capstone Simulator scenarios (PHASE_8, PH-901/902). The integrated architecture
// draft: one decision per system layer, designed together. Base = a large AI-native
// dev-team system (the full rigorous architecture is correct). Transfer = an early
// prototype where retrieval is premature (no corpus yet) — fit the architecture to
// the stage (PC-032) while eval/security/repo stay rigorous (PH-903 forbids skipping them).
export const capstoneScenarios: LabScenario<CapstoneScenarioData>[] = [
  {
    id: 'CAP-BASE',
    interactionType: 'capstone-simulator',
    labId: 'LAB-CAPSTONE-SIMULATOR',
    roadmapNodeId: 'NODE-10-02',
    title: 'Capstone — Architektur-Entwurf',
    prompt:
      'Entwirf das AI-native Dev-System integriert: triff für jede Ebene die Entscheidung, die über Monate verständlich, testbar, kontrollierbar und wartbar bleibt.',
    concepts: ['all_core'],
    prerequisites: ['NODE-10-01'],
    difficulty: 'capstone',
    estimatedMinutes: 12,
    isTransfer: false,
    scoringProfileId: 'cap-default',
    feedbackProfileId: 'cap-default',
    reviewHooks: ['capstone_transfer'],
    scenarioData: {
      system:
        'Ein AI-gestütztes Entwicklungssystem für eine große, über Monate wachsende Codebasis: menschliche Devs + AI-Agents/Subagents arbeiten gemeinsam an Features.',
      goal: 'Verständlich, testbar, kontrollierbar und wartbar bleiben — über Monate und im Team.',
      stations: [
        {
          id: 'context', dimension: 'context_fit', label: 'Context',
          question: 'Wie hältst du den Agent-Context über Monate beherrschbar?',
          bestOptionId: 'control-plane',
          options: [
            { id: 'control-plane', label: 'Control Plane: stabile Regeln + durable Progress-Memory + isolierte Subagent-Contexts', rationale: 'Passt: bounded Hot-Context, durable State, Noise bleibt im Worker (ARC-02/06).' },
            { id: 'dump-all', label: 'Immer alle Docs in den Context laden', rationale: 'Falle: Context-Noise; das Wichtige geht unter.' },
            { id: 'chat-only', label: 'Auf den Chat-Verlauf verlassen', rationale: 'Falle: flüchtig — Constraints gehen über Sessions verloren.' },
          ],
        },
        {
          id: 'tools', dimension: 'tools_fit', label: 'Tools',
          question: 'Wie gibst du Agents Tool-Zugriff?',
          bestOptionId: 'least-priv',
          options: [
            { id: 'least-priv', label: 'Typed Tool-Contracts + Least Privilege + Approval für high-impact', rationale: 'Passt: minimale, klare Wirkung; riskante Aktionen hinter Approval (ARC-03/08).' },
            { id: 'broad', label: 'Voller Zugriff für Flexibilität', rationale: 'Falle: ein mehrdeutiger Task wird irreversibel.' },
          ],
        },
        {
          id: 'retrieval', dimension: 'retrieval_fit', label: 'Retrieval',
          question: 'Wie findet das System Evidenz über Code und Docs?',
          bestOptionId: 'hybrid-rerank',
          options: [
            { id: 'hybrid-rerank', label: 'Hybrid (lexical + semantic) + Reranking über Code/Docs', rationale: 'Passt: exakte Identifier UND Konzepte; großer Korpus (ARC-05).' },
            { id: 'semantic-only', label: 'Nur semantische Embeddings', rationale: 'Falle: verfehlt exakte Symbole/Fehlercodes im Code.' },
            { id: 'none', label: 'Kein Retrieval', rationale: 'Falle: bei großer Codebasis fehlt die Evidenz.' },
          ],
        },
        {
          id: 'eval', dimension: 'eval_fit', label: 'Eval',
          question: 'Wie misst du Verlässlichkeit?',
          bestOptionId: 'task-regression',
          options: [
            { id: 'task-regression', label: 'Task-Erfolg + Regression-Set + Grounding', rationale: 'Passt: echtes Outcome, keine stillen Regressionen, belegte Antworten (ARC-07).' },
            { id: 'format-only', label: 'Nur Format-/Schema-Checks', rationale: 'Falle: maschinenlesbar, aber inhaltlich falsch.' },
            { id: 'none', label: 'Keine Evals', rationale: 'Falle: untestbares Design — im Capstone unzulässig.' },
          ],
        },
        {
          id: 'security', dimension: 'security_fit', label: 'Security',
          question: 'Wie sicherst du das System ab?',
          bestOptionId: 'priv-approval-sandbox',
          options: [
            { id: 'priv-approval-sandbox', label: 'Least Privilege + Approval-Gates + Input-Isolation + Sandbox', rationale: 'Passt: destruktive Aktionen kontrolliert, untrusted Input als Daten (ARC-08).' },
            { id: 'trust', label: 'Den Agents vertrauen, Logs im Nachhinein prüfen', rationale: 'Falle: kein Approval, kein Schutz gegen Injection.' },
          ],
        },
        {
          id: 'repo', dimension: 'repo_fit', label: 'Repo',
          question: 'Wie bleibt das Repo für Menschen und Agents wartbar?',
          bestOptionId: 'legible-control-plane',
          options: [
            { id: 'legible-control-plane', label: 'Lesbare Struktur + kleine Units + Source-Material control plane (Decision-Log/Ledger)', rationale: 'Passt: Wissen in Artefakten, kein Bottleneck im Kopf (ARC-09).' },
            { id: 'tribal', label: 'Wissen bei den erfahrenen Devs belassen', rationale: 'Falle: Tribal Knowledge bricht beim Team-Wachstum.' },
          ],
        },
      ],
    },
  },
  {
    id: 'CAP-TRANSFER',
    interactionType: 'capstone-simulator',
    labId: 'LAB-CAPSTONE-SIMULATOR',
    roadmapNodeId: 'NODE-10-02',
    title: 'Capstone — Transfer: früher Prototyp',
    prompt:
      'Gleiches System, andere Reife: ein früher Prototyp ohne nennenswerten Code/Docs-Korpus. Passe die Architektur an die Phase an — ohne Eval, Security und Wartbarkeit zu opfern.',
    concepts: ['all_core'],
    prerequisites: ['NODE-10-01'],
    difficulty: 'capstone',
    estimatedMinutes: 8,
    isTransfer: true,
    scoringProfileId: 'cap-default',
    feedbackProfileId: 'cap-default',
    reviewHooks: ['capstone_transfer', 'retrieval_method_transfer'],
    scenarioData: {
      system:
        'Ein früher Prototyp eines AI-Features: kleine Codebasis, noch kein großer Wissens-Korpus, aber bereits Tool-Zugriff auf echte Ressourcen.',
      goal: 'Schnell vorankommen, ohne Verlässlichkeit, Sicherheit und Wartbarkeit zu opfern.',
      stations: [
        {
          id: 'context', dimension: 'context_fit', label: 'Context',
          question: 'Wie hältst du den Agent-Context beherrschbar?',
          bestOptionId: 'control-plane',
          options: [
            { id: 'control-plane', label: 'Schlanke Control Plane: aktive Regeln + durable Entscheidungen', rationale: 'Passt: auch klein lohnt sich durable State + bounded Context.' },
            { id: 'dump-all', label: 'Alles in den Context laden', rationale: 'Falle: unnötiger Noise schon früh.' },
          ],
        },
        {
          id: 'tools', dimension: 'tools_fit', label: 'Tools',
          question: 'Wie gibst du dem Agent Tool-Zugriff?',
          bestOptionId: 'least-priv',
          options: [
            { id: 'least-priv', label: 'Least Privilege + Approval für destruktive Aktionen', rationale: 'Passt: echter Ressourcen-Zugriff braucht Grenzen ab Tag 1.' },
            { id: 'broad', label: 'Voller Zugriff — es ist nur ein Prototyp', rationale: 'Falle: „nur Prototyp“ mit echtem Zugriff ist genau das Risiko.' },
          ],
        },
        {
          id: 'retrieval', dimension: 'retrieval_fit', label: 'Retrieval',
          question: 'Wie findet das System Evidenz?',
          bestOptionId: 'none',
          options: [
            { id: 'none', label: 'Noch kein Retrieval — es gibt keinen nennenswerten Korpus', rationale: 'Passt: Retrieval ist verfrüht; einfachste tragfähige Wahl (PC-032).' },
            { id: 'hybrid-rerank', label: 'Volle Hybrid + Reranking Pipeline aufbauen', rationale: 'Falle: überbaut ohne Korpus, der den Aufwand rechtfertigt.' },
          ],
        },
        {
          id: 'eval', dimension: 'eval_fit', label: 'Eval',
          question: 'Wie misst du Verlässlichkeit?',
          bestOptionId: 'task-regression',
          options: [
            { id: 'task-regression', label: 'Task-Erfolg + kleines Regression-Set', rationale: 'Passt: auch früh sichern Regressionen echtes Verhalten ab (ARC-07).' },
            { id: 'none', label: 'Evals später, erst Features', rationale: 'Falle: untestbar — im Capstone unzulässig, auch früh.' },
          ],
        },
        {
          id: 'security', dimension: 'security_fit', label: 'Security',
          question: 'Wie sicherst du das System ab?',
          bestOptionId: 'priv-approval-sandbox',
          options: [
            { id: 'priv-approval-sandbox', label: 'Least Privilege + Approval + Input-Isolation + Sandbox', rationale: 'Passt: echter Zugriff erfordert Governance ab Tag 1 (ARC-08).' },
            { id: 'trust', label: 'Sicherheit kommt nach dem Prototyp', rationale: 'Falle: genau hier passieren die teuren Vorfälle.' },
          ],
        },
        {
          id: 'repo', dimension: 'repo_fit', label: 'Repo',
          question: 'Wie hältst du es wartbar?',
          bestOptionId: 'legible-control-plane',
          options: [
            { id: 'legible-control-plane', label: 'Lesbare Struktur + kleine Units + Decision-Log von Anfang an', rationale: 'Passt: früh angelegte Control Plane skaliert mit (ARC-09).' },
            { id: 'tribal', label: 'Struktur später aufräumen', rationale: 'Falle: aus dem Prototyp wird Tribal-Knowledge-Schuld.' },
          ],
        },
      ],
    },
  },
  {
    id: 'CAP-BRIEF',
    interactionType: 'capstone-simulator',
    labId: 'LAB-CAPSTONE-SIMULATOR',
    roadmapNodeId: 'NODE-10-01',
    title: 'Capstone — Briefing: Non-Negotiables',
    prompt:
      'Bevor du entwirfst: lege fest, was im Scope NICHT verhandelbar ist. Erfolg heißt beherrschbar über Monate, nicht maximal autonom.',
    concepts: ['all_core'],
    prerequisites: ['NODE-09-04'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'cap-default',
    feedbackProfileId: 'cap-default',
    reviewHooks: ['capstone_transfer'],
    scenarioData: {
      system:
        'Ein AI-gestütztes Dev-System für eine über Monate wachsende Codebasis: Menschen + Agents arbeiten gemeinsam. Das Team will schnell starten und „den Rest später“ machen.',
      goal: 'Festlegen, was ab Tag 1 zum Scope gehört, damit das System beherrschbar bleibt.',
      stations: [
        {
          id: 'eval', dimension: 'eval_fit', label: 'Eval',
          question: 'Das Team will „erst Features, Evals später“. Was kommt ins Briefing?',
          bestOptionId: 'keep-eval',
          options: [
            { id: 'keep-eval', label: 'Eval (Task-Erfolg + Regression) ist ab Tag 1 im Scope', rationale: 'Passt: ohne Messung ist das System unbeweisbar — auch früh.' },
            { id: 'defer-eval', label: 'Evals erst nach dem ersten Release', rationale: 'Falle: macht das System untestbar; Regressionen bleiben unsichtbar.' },
          ],
        },
        {
          id: 'security', dimension: 'security_fit', label: 'Security',
          question: 'Die Agents bekommen echten Tool-Zugriff. Was ist non-negotiable?',
          bestOptionId: 'govern',
          options: [
            { id: 'govern', label: 'Least Privilege + Approval für high-impact ab Tag 1', rationale: 'Passt: echter Zugriff braucht Grenzen, bevor etwas schiefgeht.' },
            { id: 'later-security', label: 'Sicherheit kommt nach dem Prototyp', rationale: 'Falle: genau in dieser Phase passieren die teuren Vorfälle.' },
          ],
        },
        {
          id: 'repo', dimension: 'repo_fit', label: 'Repo',
          question: 'Mehrere Devs und Agents über Monate. Was gehört ins Briefing?',
          bestOptionId: 'control-plane',
          options: [
            { id: 'control-plane', label: 'Lesbare Struktur + Control-Plane-Docs von Anfang an', rationale: 'Passt: Wissen in Artefakten, kein Bottleneck im Kopf.' },
            { id: 'tribal', label: 'Struktur ergibt sich später von selbst', rationale: 'Falle: aus „später“ wird Tribal-Knowledge-Schuld.' },
          ],
        },
      ],
    },
  },
  {
    id: 'CAP-REVIEW',
    interactionType: 'capstone-simulator',
    labId: 'LAB-CAPSTONE-SIMULATOR',
    roadmapNodeId: 'NODE-10-05',
    title: 'Capstone — Final Defense',
    prompt:
      'Verteidige die Architektur: pro Ebene den Trade-off und seine Mitigation benennen — nicht Perfektion behaupten.',
    concepts: ['all_core'],
    prerequisites: ['NODE-10-04'],
    difficulty: 'capstone',
    estimatedMinutes: 7,
    isTransfer: true,
    scoringProfileId: 'cap-default',
    feedbackProfileId: 'cap-default',
    reviewHooks: ['capstone_transfer'],
    scenarioData: {
      system:
        'Letztes Review deines Capstone-Systems. Eine reife Architektur kennt ihre Trade-offs und Failure Modes — und zeigt, wie sie sie kontrolliert.',
      goal: 'Jede Ebene verteidigbar machen: Trade-off offenlegen + Mitigation zeigen.',
      stations: [
        {
          id: 'security', dimension: 'security_fit', label: 'Security',
          question: 'Wie verteidigst du die Approval-Gates?',
          bestOptionId: 'tradeoff',
          options: [
            { id: 'tradeoff', label: 'Reibung als Trade-off benennen; Mitigation: nur bei high-impact gaten', rationale: 'Passt: kennt die Kosten und kontrolliert sie gezielt.' },
            { id: 'perfect', label: 'Behaupten, es gebe keinerlei Reibung', rationale: 'Falle: ein Review ohne benannte Trade-offs ist Marketing.' },
            { id: 'over', label: 'Jede Aktion durch ein Approval-Gate führen', rationale: 'Falle: überzogene Reibung bremst auch harmlose Schritte — Approval gehört nur auf high-impact.' },
          ],
        },
        {
          id: 'eval', dimension: 'eval_fit', label: 'Eval',
          question: 'Wie verteidigst du die Eval-Suite?',
          bestOptionId: 'tradeoff',
          options: [
            { id: 'tradeoff', label: 'Wartungsaufwand benennen; Mitigation: an reale Failure-Cases gekoppelt', rationale: 'Passt: die Suite bleibt schlank und relevant.' },
            { id: 'perfect', label: 'Behaupten, die Suite fange alles ab', rationale: 'Falle: keine Suite ist vollständig — das verschleiert die Lücken.' },
            { id: 'drop', label: 'Die Suite klein halten und Lücken ignorieren', rationale: 'Falle: spart Pflege, lässt aber Regressionen durch.' },
          ],
        },
        {
          id: 'repo', dimension: 'repo_fit', label: 'Repo',
          question: 'Wie verteidigst du die Repo-Struktur?',
          bestOptionId: 'tradeoff',
          options: [
            { id: 'tradeoff', label: 'Mehr Dateien/Docs als Trade-off benennen; Mitigation: klare Konventionen', rationale: 'Passt: der Preis ist bekannt und durch Konventionen beherrscht.' },
            { id: 'perfect', label: 'Behaupten, die Struktur sei selbsterklärend', rationale: 'Falle: ohne benannte Konventionen driftet sie doch.' },
            { id: 'tribal', label: 'Auf die erfahrenen Devs verweisen', rationale: 'Falle: macht Wissen wieder zum Bottleneck.' },
          ],
        },
      ],
    },
  },
]
