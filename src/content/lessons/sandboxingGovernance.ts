import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-08-04 · post-template redesign, HARD. Bespoke puzzle exercises (diff · multispot · pick).
// Completes the Security arc. A sandbox contains the BLAST RADIUS of a compromised/buggy agent;
// the durable skill is reading a sandbox/governance config and seeing the line that voids it.
export const sandboxingGovernance: Lesson = {
  id: 'LESSON-08-04',
  roadmapNodeId: 'NODE-08-04',
  conceptIds: ['CONCEPT-SEC-004', 'CONCEPT-PROD-003'],
  prerequisites: ['NODE-08-03'],
  title: 'Sandboxing and Governance',
  estimatedMinutes: 8,
  lessonMode: 'task-first',
  learningGoal: 'Operative Grenzen lesen und entwerfen: riskante Wirkung enthalten, Harmloses frei lassen.',
  interactionType: 'trust-boundary',
  visualModelId: 'layerStack',
  feedbackPatternId: 'FB-PATTERN-NO-OBSERVABILITY',
  reviewHooks: ['CONCEPT-SEC-004', 'trust_boundary_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Sandbox = Eindämmung',
      text: 'Eine Sandbox verhindert keine Fehler — sie begrenzt den Schaden, wenn der Agent kompromittiert ist oder Mist baut. Ihr Wert steht und fällt mit den Grenzen: ein einziger zu weiter Mount oder offener Egress hebt sie auf.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'sandbox-diff',
        format: 'diff',
        stem: 'Review des Sandbox-Configs. Welche geänderte Zeile hebt die Eindämmung auf?',
        lines: [
          { id: 's1', text: 'sandbox:', sign: ' ' },
          { id: 's2', text: '  network: none', sign: ' ' },
          { id: 's3', text: '  filesystem:', sign: ' ' },
          { id: 's4', text: '    mounts: [ "/app/in:ro" ]', sign: '-' },
          {
            id: 's5',
            text: '    mounts: [ "/:rw" ]',
            sign: '+',
            bad: true,
            note: 'Mountet das GESAMTE Host-Dateisystem schreibbar in die Sandbox. Damit kann der Agent alles lesen und überschreiben — die Sandbox ist wertlos.',
          },
          { id: 's6', text: '  cpu: 1', sign: ' ' },
          { id: 's7', text: '  cpu_limit: 2', sign: '+', note: 'Harmlos — nur etwas mehr Rechenzeit, keine neue Fähigkeit.' },
          { id: 's8', text: '  timeout_s: 30', sign: ' ' },
        ],
        takeaway: 'Eine einzige Mount-Zeile kann eine Sandbox aushebeln. Bei Containment zählt die weiteste Grenze, nicht der Durchschnitt der Einstellungen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'governance-gaps',
        format: 'multispot',
        stem: 'Ein Agent geht in Produktion. Tippe jede Zeile an, die eine fehlende Governance-/Sicherheitskontrolle ist.',
        lines: [
          { id: 'g1', text: 'Alle Tool-Calls werden mit Eingaben geloggt.' },
          { id: 'g2', text: 'Der Agent-Prozess läuft als root im Container.', isAttack: true, note: 'Kein Least Privilege: ein Ausbruch hat sofort volle Rechte. Als unprivilegierter User laufen lassen.' },
          { id: 'g3', text: 'Ausgehende Verbindungen sind auf eine Allowlist beschränkt.' },
          { id: 'g4', text: 'Es gibt kein Rate-Limit für Aktionen/Ausgaben.', isAttack: true, note: 'Ohne Rate-Limit kann ein Loop oder Missbrauch unbegrenzt Aktionen/Kosten erzeugen, bevor jemand eingreift.' },
          { id: 'g5', text: 'Secrets liegen als Klartext-Umgebungsvariablen vor.', isAttack: true, note: 'Klartext-Secrets sind bei jedem Leak/Dump sofort kompromittiert — über einen Secret-Store mit kurzer Lebensdauer beziehen.' },
          { id: 'g6', text: 'Ein Kill-Switch kann den Agenten sofort stoppen.' },
          { id: 'g7', text: 'High-Value-Aktionen haben keinen Audit-Eintrag.', isAttack: true, note: 'Ohne Audit-Log lässt sich ein Vorfall nicht rekonstruieren — wer, was, wann, wie viel bleibt unbekannt.' },
        ],
        takeaway: 'Governance ist mehr als die Sandbox: Least Privilege (kein root), Rate-Limits, sichere Secrets und ein Audit-Log für riskante Aktionen.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'sandbox-purpose',
        format: 'pick',
        stem: 'Was leistet eine Sandbox — und was nicht?',
        options: [
          {
            id: 'contain',
            text: 'Sie begrenzt den Blast-Radius, wenn der Agent kompromittiert ist oder fehlerhaft handelt — Eindämmung, nicht Fehlerverhinderung.',
            correct: true,
            why: 'Die Sandbox geht davon aus, dass etwas schiefgeht, und sorgt dafür, dass der Schaden klein bleibt.',
          },
          {
            id: 'correct',
            text: 'Sie sorgt dafür, dass der Agent korrekt handelt.',
            correct: false,
            why: 'Korrektheit ist eine andere Achse (Prompt, Tools, Evals). Die Sandbox kümmert sich nur um die Folgen eines Fehlers.',
          },
          {
            id: 'replace',
            text: 'Sie ersetzt Least Privilege und Approval-Gates.',
            correct: false,
            why: 'Sie ergänzt sie. Eine Sandbox mit root-Rechten und ungegateten High-Value-Aktionen enthält wenig.',
          },
          {
            id: 'inject',
            text: 'Sie verhindert Prompt Injection.',
            correct: false,
            why: 'Injection passiert im Modell-Input; die Sandbox kann nur begrenzen, was eine erfolgreiche Injection anrichtet — nicht, dass sie passiert.',
          },
        ],
        takeaway: 'Eine Sandbox enthält Schaden; Korrektheit, Least Privilege und Approval-Gates sind eigene, ergänzende Kontrollen.',
      },
    },
  ],
}
