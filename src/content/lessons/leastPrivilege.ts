import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-08-01 · post-template redesign, HARD. Bespoke puzzle exercises (multispot · diff ·
// categorize). Least privilege = each tool/agent gets only the permissions it needs, so a
// single bug or injection can't escalate into a big incident. The durable skill is reading a
// permission grant / config change and spotting over-broad scope.
export const leastPrivilege: Lesson = {
  id: 'LESSON-08-01',
  roadmapNodeId: 'NODE-08-01',
  conceptIds: ['CONCEPT-SEC-001'],
  prerequisites: ['NODE-07-04'],
  title: 'Least Privilege',
  estimatedMinutes: 7,
  lessonMode: 'task-first',
  learningGoal: 'Tool-/Agent-Permissions auf das Nötige minimieren — über-breiten Scope erkennen.',
  interactionType: 'security-incident-room',
  visualModelId: 'decisionPair',
  feedbackPatternId: 'FB-PATTERN-BROAD-TOOL-PERMISSION',
  reviewHooks: ['CONCEPT-SEC-001', 'least_privilege_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Least Privilege',
      text: 'Jedes Tool und jeder Agent bekommt nur die Rechte, die es für seine Aufgabe braucht. Je enger der Scope, desto kleiner der Schaden, wenn ein Bug oder eine Injection das Tool missbraucht.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'over-broad-scopes',
        format: 'multispot',
        stem: 'Ein Agent bekommt diese Berechtigungen. Tippe alle an, die zu weit gefasst sind.',
        lines: [
          { id: 's1', text: 'files:read auf /app/config (nur die eigene Config lesen)', note: 'Eng begrenzt — passt.' },
          { id: 's2', text: 'db:* auf die gesamte Produktionsdatenbank', isAttack: true, note: 'Wildcard auf alles: jede Tabelle, jede Operation. Nur die nötigen Tabellen + Operationen freigeben.' },
          { id: 's3', text: 'secrets:read auf ALLE Projekt-Secrets', isAttack: true, note: 'Braucht meist einen einzigen Key, bekommt aber alle — bei Kompromittierung maximaler Schaden.' },
          { id: 's4', text: 'http:GET auf api.partner.com (eine erlaubte Domain)', note: 'Eine Domain, eine Methode — eng.' },
          { id: 's5', text: 'shell:exec ohne Einschränkung', isAttack: true, note: 'Beliebige Befehle = faktisch vollständige Übernahme der Maschine. Fast nie nötig.' },
          { id: 's6', text: 'email:send nur an Adressen @firma.de', note: 'Auf die interne Domain begrenzt — passt.' },
        ],
        takeaway: 'Verdächtig ist jeder Scope mit Wildcard, „alle" oder ohne Einschränkung. Eng gefasste, zweckgebundene Rechte sind das Ziel.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'config-diff',
        format: 'diff',
        stem: 'Review dieses Tool-Config-Diffs. Welche geänderte Zeile schafft das eigentliche Risiko?',
        lines: [
          { id: 'd1', text: 'tool: run_report', sign: ' ' },
          { id: 'd2', text: 'description: "Erzeugt einen Analytics-Report"', sign: ' ' },
          { id: 'd3', text: 'params:', sign: ' ' },
          { id: 'd4', text: '  range: string', sign: ' ' },
          { id: 'd5', text: '  db_role: readonly', sign: '-' },
          {
            id: 'd6',
            text: '  db_role: admin',
            sign: '+',
            bad: true,
            note: 'readonly → admin: aus einem reinen Lese-Tool wird Voll-Zugriff. Ein Report braucht nie Schreib-/Admin-Rechte — klassische Rechte-Eskalation, im Review leicht übersehen.',
          },
          { id: 'd7', text: '  timeout_s: 30', sign: ' ' },
          { id: 'd8', text: '  cache: true', sign: '+', note: 'Harmlose Ergänzung — ändert nichts an den Rechten.' },
        ],
        takeaway: 'Eine einzige Rollen-Zeile kann ein Lese-Tool in einen Voll-Zugriff verwandeln. Bei Reviews zählt die Rechte-Änderung, nicht die Zeilenzahl.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'autonomy-buckets',
        format: 'categorize',
        stem: 'Setze die Autonomie pro Tool: none = läuft frei · log = läuft + protokolliert · approve = menschliches Gate. Regeln: externer Write → approve; PII berühren → mindestens log; read-only ohne PII → none (nicht über-gaten).',
        buckets: [
          { id: 'none', label: 'none' },
          { id: 'log', label: 'log' },
          { id: 'approve', label: 'approve' },
        ],
        items: [
          { id: 't-search', text: 'search_web (read-only, kein PII)', bucketId: 'none', why: 'Read-only ohne PII — nach Regel 3 nicht über-gaten.' },
          { id: 't-profile', text: 'read_user_profile (liest PII, kein externer Write)', bucketId: 'log', why: 'PII berührt → mindestens log; kein externer Write → kein Approval nötig. Die präzise Mitte.' },
          { id: 't-email', text: 'send_email (externer Write, enthält PII)', bucketId: 'approve', why: 'Externer Write → approve. Die strengste zutreffende Regel gewinnt (R1 vor R2).' },
          { id: 't-delete', text: 'delete_record (externer, destruktiver Write)', bucketId: 'approve', why: 'Destruktiv und extern → hartes Approval-Gate.' },
          { id: 't-status', text: 'get_order_status (read-only, intern, kein PII)', bucketId: 'none', why: 'Reiner interner Read ohne PII — frei laufen lassen.' },
        ],
        takeaway: 'Oversight ist Least Privilege mit Kopplung: die strengste zutreffende Regel gewinnt — aber alles auf approve zu setzen (Über-Gating) ist auch falsch.',
      },
    },
  ],
}
