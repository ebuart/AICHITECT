import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-13-03 · the DIRECT-A-BUILD ROUND-TRIP (PC-043 / the Open-Claw exit proof), post-template
// redesign. The climax of the DIRECTION track: one concrete feature (add 2FA to login) directed
// end-to-end across FOUR phases, each a DIFFERENT bespoke mechanic — brief (cloze) → decompose
// (order) → diagnose (pick) → accept (pick). Integrates every direction skill on a real build.
export const dirDirectTheBuild: Lesson = {
  id: 'LESSON-13-03',
  roadmapNodeId: 'NODE-13-03',
  conceptIds: ['all_core'],
  prerequisites: ['NODE-13-02'],
  title: 'Direct the Build',
  estimatedMinutes: 16,
  lessonMode: 'scenario-first',
  learningGoal: 'Einen echten Feature-Build end-to-end dirigieren: briefen, zerlegen, diagnostizieren, abnehmen.',
  interactionType: 'trade-off-duel',
  visualModelId: 'layerStack',
  feedbackPatternId: 'FB-PATTERN-CAPSTONE-INTEGRATION',
  reviewHooks: ['all_core', 'capstone_transfer', 'direction_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Der Round-Trip — du dirigierst, die Biene baut',
      text: 'Jetzt alles zusammen, an einem echten Feature: „Füg 2FA zum Login hinzu." Du schreibst keine Zeile Code — du führst den Build durch vier Phasen. Phase 1: mach den Auftrag ausführbar.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rt-brief',
        format: 'cloze',
        stem: 'Phase 1 — vervollständige den Brief, sodass die Biene ihn ohne Raten umsetzen kann.',
        code: `BRIEF: 2FA zum Login hinzufügen
Kontext: ▢1
Scope:   nur ▢2
Fertig, wenn: ▢3`,
        blanks: [
          {
            id: 'ctx',
            label: 'Kontext',
            options: [
              { id: 'good', text: 'Login = Passwort + Session-Cookie; 2FA kommt als zweiter Faktor dazu. Nutzer OHNE 2FA müssen sich weiter normal einloggen.', correct: true, why: 'Genau der entscheidende Kontext: ohne ihn baut die Biene einen Flow, der Nicht-2FA-Nutzer aussperrt.' },
              { id: 'vague', text: 'Mach das Login sicherer.', correct: false, why: 'Kein Kontext, nur ein Wunsch — die Biene kennt den bestehenden Flow nicht.' },
              { id: 'none', text: '(leer lassen)', correct: false, why: 'Fehlender Kontext ist die häufigste Brief-Lücke — hier führt sie direkt zum Lockout-Bug.' },
            ],
          },
          {
            id: 'scope',
            label: 'Scope',
            options: [
              { id: 'auth', text: 'den Auth-/Login-Flow anfassen', correct: true, why: 'Enge, klare Grenze — kein Anlass für Scope-Creep.' },
              { id: 'repo', text: 'alles im Repo anfassen, was nötig scheint', correct: false, why: 'Offene Grenze lädt zu ungewollten Änderungen ein.' },
              { id: 'billing', text: 'auch das Billing modernisieren', correct: false, why: 'Themenfremd — gehört nicht in diesen Auftrag.' },
            ],
          },
          {
            id: 'done',
            label: 'Fertig, wenn',
            options: [
              { id: 'measurable', text: 'Nutzer mit aktivem 2FA braucht nach dem Passwort einen gültigen TOTP-Code; Nutzer ohne 2FA loggen sich unverändert ein; bestehende Tests bleiben grün.', correct: true, why: 'Prüfbar und vollständig — inklusive der Nicht-Aussperrung und der grünen Tests.' },
              { id: 'safer', text: 'wenn das Login sicherer ist', correct: false, why: 'Nicht messbar — woran erkennt die Biene „fertig"?' },
              { id: 'clean', text: 'wenn der Code schön ist', correct: false, why: 'Geschmack ist kein Akzeptanzkriterium.' },
            ],
          },
        ],
        takeaway: 'Ein ausführbarer Brief nennt den realen Kontext (keine Aussperrung!), eine enge Scope-Grenze und ein prüfbares „fertig".',
      },
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Phase 2 — zerlegen',
      text: 'Der Brief steht. Zerleg ihn in einen Plan, den Bienen abarbeiten können — Abhängigkeiten zuerst.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rt-decompose',
        format: 'order',
        stem: 'Phase 2 — bring die Teilaufgaben in eine abhängigkeits-respektierende Reihenfolge (zuerst → zuletzt).',
        items: [
          { id: 'rt-spec', text: 'Spec + Akzeptanzkriterien bestätigen' },
          { id: 'rt-secret', text: 'TOTP-Secret pro Nutzer speichern (Schema/Migration)' },
          { id: 'rt-enroll', text: 'Enrollment-Flow: Nutzer richtet 2FA ein (QR + Secret)' },
          { id: 'rt-login', text: 'Login-Flow: nach dem Passwort den TOTP-Code prüfen' },
          { id: 'rt-recovery', text: 'Recovery: Backup-Codes für verlorene Geräte' },
        ],
        takeaway: 'Spec → Secret-Speicher → Enrollment → Login-Prüfung → Recovery. Jede Stufe braucht die vorige als feste Grundlage.',
      },
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Phase 3 — es bricht',
      text: 'Live in Produktion: manche Nutzer sind ausgesperrt. Du rätst keinen Fix — du findest die versagende Stelle und reparierst DORT.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rt-diagnose',
        format: 'pick',
        stem: 'Phase 3 — Symptom: Nutzer, die 2FA NIE aktiviert haben, werden jetzt beim Login nach einem Code gefragt und ausgesperrt. Wo liegt die Ursache?',
        options: [
          {
            id: 'condition',
            text: 'Der Login-Check verlangt den TOTP-Code unbedingt, statt nur bei Nutzern mit aktiviertem 2FA — die Bedingung „hat 2FA aktiviert?" fehlt.',
            correct: true,
            why: 'Genau der Kontext aus Phase 1: Nicht-2FA-Nutzer dürfen sich weiter einloggen. Die fehlende Bedingung sperrt sie aus — ein Logik-Fehler im Login-Flow.',
          },
          {
            id: 'model',
            text: 'Das TOTP-Verfahren ist zu schwach und muss ausgetauscht werden.',
            correct: false,
            why: 'Das Verfahren funktioniert; das Problem ist die fehlende „nur wenn aktiviert"-Bedingung, nicht die Krypto.',
          },
          {
            id: 'db',
            text: 'Die Datenbank ist zu langsam und gibt das 2FA-Flag nicht rechtzeitig zurück.',
            correct: false,
            why: 'Es ist kein Timing-Problem — die Logik fragt den Code von allen ab, egal was die DB liefert.',
          },
          {
            id: 'password',
            text: 'Die betroffenen Nutzer haben ihr Passwort vergessen.',
            correct: false,
            why: 'Sie scheitern nicht am Passwort, sondern an der unbedingten Code-Abfrage — ein Bug, kein Nutzerfehler.',
          },
        ],
        takeaway: 'Diagnostiziere am Symptom zur Ursache: der Lockout ist eine fehlende Bedingung im Login-Flow — und sie war im Brief-Kontext schon vorgezeichnet.',
      },
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Phase 4 — abnehmen',
      text: 'Die Biene liefert die fertige PR. Letzter Schritt: gegen deinen Brief abnehmen — nicht gegen den ersten Eindruck.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rt-accept',
        format: 'pick',
        stem: 'Phase 4 — die PR behebt den Lockout, alle Akzeptanzkriterien sind erfüllt, die Tests sind grün. In der Beschreibung steht: „Hab nebenbei das Rate-Limiting am Login deaktiviert, das hat beim Testen gestört." Nimmst du ab?',
        options: [
          {
            id: 'sendback',
            text: 'Zurückweisen — das deaktivierte Rate-Limiting ist eine Sicherheitsregression und Scope-Verlassen, auch wenn der Lockout-Fix korrekt ist.',
            correct: true,
            why: 'Ein erfülltes Kriterium rechtfertigt keine eingeschmuggelte Regression. Rate-Limiting am Login schützt vor Brute-Force — das gehört wieder rein, bevor abgenommen wird.',
          },
          {
            id: 'accept',
            text: 'Abnehmen — die Akzeptanzkriterien sind ja alle erfüllt und die Tests grün.',
            correct: false,
            why: 'Die Kriterien decken den Lockout ab, nicht die heimliche Sicherheits-Schwächung. „Sieht fertig aus" übersieht die Regression.',
          },
          {
            id: 'later',
            text: 'Abnehmen und das Rate-Limiting als Ticket ins Backlog legen.',
            correct: false,
            why: 'Eine offene Brute-Force-Lücke bewusst live zu schalten ist kein Backlog-Ticket, sondern ein vermeidbares Risiko.',
          },
          {
            id: 'fix',
            text: 'Selbst schnell das Rate-Limiting wieder einschalten und durchwinken.',
            correct: false,
            why: 'Das fällt in Builder-Arbeit zurück; die Biene lernt nichts und du übernimmst stillschweigend ihren Fehler. Zurück mit klarer Ansage.',
          },
        ],
        takeaway: 'Round-Trip geschafft: briefen, zerlegen, diagnostizieren, abnehmen. Abnahme heißt gegen den Brief UND gegen eingeschmuggelte Regressionen — nicht gegen Geschmack.',
      },
    },
  ],
}
