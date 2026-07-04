import type { Lesson } from '@/features/lessons/lessonModel'

// NODE-07-02 · 4th node of the post-template redesign, HARD (2026-06-21). Bespoke
// concrete exercises, no mechanic engine, no scenario/constraint wrapper. statr-flavoured:
// a real eval table (v1 vs v2 per case) to read, a signal-vs-noise judgment, a ship
// decision, a success-criterion design. Format mix: pick · multi · pick · pick.
//
// GROUND-UP: task success measures the OUTCOME of each case, not wording; a regression is a
// change that breaks previously-green cases — and the aggregate average routinely HIDES one
// (a critical case regresses while the headline number rises). The durable skills (grow with
// better models): compare paired per-case, separate signal from stochastic noise, weight
// critical cases, and never game the eval set. Options shuffle at render; nothing telegraphed.
export const taskSuccessRegression: Lesson = {
  id: 'LESSON-07-02',
  roadmapNodeId: 'NODE-07-02',
  conceptIds: ['CONCEPT-EVAL-002', 'CONCEPT-EVAL-004'],
  prerequisites: ['NODE-07-01'],
  title: 'Task Success and Regression',
  estimatedMinutes: 8,
  lessonMode: 'task-first',
  learningGoal:
    'Echte Outcomes messen, stille Regressionen erkennen und Signal von Rauschen trennen.',
  interactionType: 'eval-designer',
  visualModelId: 'flow',
  feedbackPatternId: 'FB-PATTERN-NO-REGRESSION-SET',
  reviewHooks: ['CONCEPT-EVAL-004', 'eval_transfer'],
  blocks: [
    {
      kind: 'note',
      tone: 'info',
      title: 'Task Success & Regression',
      text: 'Der Eval-Harness steht (07-01). Task Success misst, ob ein Fall sein ZIEL erreicht (Outcome), nicht den Wortlaut. Eine Regression ist eine Änderung, die vorher grüne Fälle bricht — oft versteckt hinter einem gleich gebliebenen oder gestiegenen Durchschnitt.',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'hidden-regression',
        format: 'pick',
        stem: 'Du vergleichst Prompt v1 mit v2 auf demselben Eval-Set. Was ist die richtige Lesart dieser Tabelle?',
        code: `Eval: 10 Faelle (Support-Agent)   ✓ = Ziel erreicht

Fall                   v1    v2
#1  Adresse aendern     ✓     ✓
#2  Bestellstatus       ✓     ✓
#3  Refund anstossen     ✗     ✓
#4  Storno Zahlung *     ✓     ✗   (* kritisch)
#5  FAQ allgemein       ✓     ✓
#6  Gutschein pruefen    ✗     ✓
#7  Adresse loeschen    ✓     ✓
#8  Eskalation          ✓     ✓
#9  Rechnung senden     ✓     ✓
#10 Sprache wechseln     ✗     ✗
                       ----  ----
                       7/10  8/10`,
        options: [
          {
            id: 'critical-regression',
            text: 'v2 besteht insgesamt mehr Fälle, hat aber einen kritischen Fall (#4 Storno Zahlung) neu gebrochen — eine Regression, die der Durchschnitt verdeckt.',
            correct: true,
            why: 'Genau das: v2 fixt #3 und #6, bricht aber #4 — und #4 ist als kritisch markiert. Der Schnitt steigt (7→8), trotzdem ist ein wichtiger Fall regrediert. Deshalb paarweise pro Fall vergleichen, nicht nur die Kopfzahl.',
          },
          {
            id: 'just-ship',
            text: 'v2 ist besser — 8/10 statt 7/10 — also ausrollen.',
            correct: false,
            why: 'Die Kopfzahl-Falle. Der Durchschnitt steigt, weil zwei kleine Fälle dazukommen — und überdeckt, dass ein kritischer Fall gekippt ist. Nicht alle Fälle wiegen gleich.',
          },
          {
            id: 'all-noise',
            text: 'v1 und v2 sind praktisch gleichwertig; die Unterschiede sind Rauschen.',
            correct: false,
            why: 'Drei Fälle ändern sich gerichtet (zwei fixed, einer gebrochen) — das ist kein zufälliges Flackern, sondern ein Effekt der Prompt-Änderung.',
          },
          {
            id: 'avg-only',
            text: 'Erfolg misst man am Durchschnitt; einzelne Fälle zählen einzeln nicht.',
            correct: false,
            why: 'Falsches Prinzip. Der Durchschnitt ist eine Zusammenfassung — die Entscheidung hängt an den einzelnen (besonders kritischen) Fällen, die er glättet.',
          },
        ],
        takeaway: 'Die aggregierte Erfolgsquote kann eine Regression verstecken. Vergleiche paarweise pro Fall — und gewichte die kritischen, die nicht gleich viel wert sind.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'signal-vs-noise',
        format: 'multi',
        stem: 'LLM-Ausgaben sind stochastisch. Welche Beobachtungen rechtfertigen es, von einer ECHTEN Regression zu sprechen — statt von Rauschen?',
        options: [
          {
            id: 'reproducible',
            text: 'Derselbe Fall fällt über mehrere Wiederholungen reproduzierbar durch, nicht nur einmal.',
            correct: true,
            why: 'Reproduzierbarkeit trennt Signal von Zufall. Ein Fehler, der bei jedem Durchlauf auftritt, ist real.',
          },
          {
            id: 'category-down',
            text: 'Eine ganze Kategorie (z. B. alle Refund-Fälle) verschlechtert sich systematisch.',
            correct: true,
            why: 'Ein Muster über eine Gruppe ist kaum Zufall — das deutet auf eine echte Ursache in der Änderung.',
          },
          {
            id: 'new-failuretype',
            text: 'Es taucht ein neuer Fehlertyp auf, den es in v1 nie gab.',
            correct: true,
            why: 'Ein qualitativ neues Versagen (nicht nur eine andere Zahl) ist ein starkes Signal, dass die Änderung etwas gebrochen hat.',
          },
          {
            id: 'one-flip',
            text: 'Ein einzelner Fall ist bei einem von 50 Durchläufen gekippt.',
            correct: false,
            why: 'Bei stochastischem Output ist ein 1-von-50-Flip plausibel Rauschen. Erst reproduzieren, bevor du ihn eine Regression nennst.',
          },
          {
            id: 'within-variance',
            text: 'Der Durchschnitt ist um 0,5 Punkte gefallen — innerhalb der Lauf-zu-Lauf-Streuung.',
            correct: false,
            why: 'Eine Bewegung innerhalb der bekannten Varianz ist kein Signal. Ohne genug Fälle/Wiederholungen misst du Rauschen.',
          },
        ],
        takeaway: 'Eine Regression braucht Reproduzierbarkeit oder ein Muster (Kategorie / neuer Fehlertyp). Ein einzelner Flip im Rauschen ist keiner — genug Fälle und Wiederholungen, bevor du blockierst oder ausrollst.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'ship-decision',
        format: 'pick',
        stem: 'v2 hebt den Durchschnitt um 6% und behebt einen echten Bug — bricht aber reproduzierbar einen Fall, in dem jetzt Kontodaten ohne Auth-Check herausgegeben werden. Was tun?',
        options: [
          {
            id: 'block',
            text: 'Nicht ausrollen, bis dieser Fall grün ist — ein neuer kritischer/sicherheitsrelevanter Bruch ist ein harter Blocker, kein Durchschnitts-Posten.',
            correct: true,
            why: 'Ein Sicherheits-Regress sticht jeden Durchschnittsgewinn. Erst den Fall fixen (oder v2 zurückhalten); der Schnitt ist hier irrelevant.',
          },
          {
            id: 'ship-avg',
            text: 'Ausrollen — der Durchschnitt und der Bugfix überwiegen den einen Fall.',
            correct: false,
            why: 'Das mittelt einen Sicherheitsbruch weg. Kritische Fälle sind keine Stimmen in einem Durchschnitt; einer reicht zum Blockieren.',
          },
          {
            id: 'backlog',
            text: 'Ausrollen und den kritischen Fall als bekanntes Problem ins Backlog legen.',
            correct: false,
            why: 'Eine Datenabfluss-Regression bewusst live zu schalten ist kein Backlog-Ticket, sondern ein vermeidbarer Vorfall.',
          },
          {
            id: 'remove-case',
            text: 'Den kritischen Fall aus dem Eval-Set entfernen, dann ist v2 grün.',
            correct: false,
            why: 'Das Eval-Set zu frisieren, damit der Build grün wird, ist der Kardinalfehler: du reparierst die Messung, nicht das System — und blendest genau das aus, was dich schützt.',
          },
        ],
        takeaway: 'Nicht jeder Fall wiegt gleich. Einen kritischen Regress fixt man — man rollt nicht darüber hinweg und entfernt erst recht nicht den Fall aus dem Eval.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'success-criterion',
        format: 'pick',
        stem: 'Du definierst das Erfolgskriterium für einen Tool-nutzenden Agenten-Fall („storniere Bestellung #123"). Was misst Task Success am ehesten richtig?',
        options: [
          {
            id: 'end-state',
            text: 'Prüfen, ob am Ende der korrekte Zustand erreicht ist: Bestellung #123 storniert, keine andere verändert.',
            correct: true,
            why: 'Outcome statt Wortlaut. Der Endzustand ist genau das Ziel des Falls — egal, über welchen Weg oder mit welcher Formulierung der Agent dort hinkommt.',
          },
          {
            id: 'text-sim',
            text: 'Die Textähnlichkeit der Agenten-Antwort zu einer Referenzantwort messen.',
            correct: false,
            why: 'Misst Formulierung, nicht Erfüllung. Der Agent kann die „richtigen" Worte sagen und trotzdem die falsche (oder gar keine) Stornierung auslösen.',
          },
          {
            id: 'toolcall-count',
            text: 'Prüfen, ob der Agent die erwartete Anzahl Tool-Calls gemacht hat.',
            correct: false,
            why: 'Ein Prozess-Proxy: zufällig richtig, oft falsch. Ein legitimer alternativer Weg (ein Call statt zwei) wäre erfolgreich und würde hier durchfallen.',
          },
          {
            id: 'no-crash',
            text: 'Prüfen, ob der Agent ohne Fehler/Exception durchgelaufen ist.',
            correct: false,
            why: '„Kein Crash" ist nicht „Aufgabe erledigt". Der Agent kann sauber durchlaufen und dabei die falsche Bestellung stornieren.',
          },
        ],
        takeaway: 'Task Success misst das ERGEBNIS (Endzustand), nicht Wortlaut, Prozess-Proxys oder „kein Crash" — sonst bestehst du Fälle, die das Ziel gar nicht erreichen.',
      },
    },
  ],
}
