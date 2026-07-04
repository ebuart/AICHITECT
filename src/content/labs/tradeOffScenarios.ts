import type { LabScenario } from '@/features/labs/interactionModel'
import type { DuelScenarioData } from '@/features/labs/tradeOffDuel/types'

// Trade-off Duel scenarios. Base (Simplicity Before Agency, 01-02): the simple/cheap
// choice fits. Transfer (Workflow vs Agent, 04-01): an open task warrants the agent and
// a high-accuracy need warrants the bigger model — so it is a FIT decision, not "always simplest".
export const tradeOffScenarios: LabScenario<DuelScenarioData>[] = [
  {
    id: 'TOD-BASE',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-01-02',
    title: 'Trade-off Duel',
    prompt: 'Wähle für jede Entscheidung die Architektur, die zur Aufgabe und ihren Constraints passt.',
    concepts: ['CONCEPT-AIE-004', 'CONCEPT-PROD-001', 'CONCEPT-PROD-002'],
    prerequisites: ['NODE-01-01'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['tradeoff_transfer'],
    scenarioData: {
      scenario: 'Eingehende Tickets sollen in feste Kategorien einsortiert werden. Die Schritte sind bekannt und stabil.',
      constraint: 'Hohes Volumen, knappes Budget, akzeptable Qualität reicht.',
      stations: [
        {
          id: 'arch', dimension: 'simplicity_fit', label: 'Architektur', question: 'Workflow oder autonomer Agent?',
          bestOptionId: 'workflow',
          options: [
            { id: 'workflow', label: 'Workflow / Router', rationale: 'Passt: vorhersehbare, stabile Aufgabe — testbar und kontrollierbar.' },
            { id: 'agent', label: 'Autonomer Agent', rationale: 'Overengineered: Autonomie ohne offene Planung erhöht Kosten und Fehlerfläche.' },
          ],
        },
        {
          id: 'model', dimension: 'tradeoff_fit', label: 'Modell', question: 'Welche Modell-Wahl?',
          bestOptionId: 'small-eval',
          options: [
            { id: 'small-eval', label: 'Kleines, schnelles Modell + Eval', rationale: 'Passt: niedrige Latenz/Kosten, Qualität per Eval abgesichert.' },
            { id: 'biggest', label: 'Das größte verfügbare Modell', rationale: 'Falle: teuer/langsam ohne nötigen Qualitätsgewinn für die Klassifikation.' },
          ],
        },
      ],
    },
  },
  {
    id: 'TOD-TRANSFER',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-04-01',
    title: 'Trade-off Duel — Transfer: offene Aufgabe',
    prompt: 'Geänderte Constraints: gleiche Methode. Wähle, was jetzt wirklich passt.',
    concepts: ['CONCEPT-CF-001', 'CONCEPT-PROD-002'],
    prerequisites: ['NODE-03-04'],
    difficulty: 'core',
    estimatedMinutes: 6,
    isTransfer: true,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['tradeoff_transfer'],
    scenarioData: {
      scenario: 'Eine offene Recherche-Aufgabe: die nötigen Schritte sind vorab unbekannt und hängen von Zwischenergebnissen ab.',
      constraint: 'Hohe Genauigkeit gefordert, Latenz ist zweitrangig.',
      stations: [
        {
          id: 'arch', dimension: 'simplicity_fit', label: 'Architektur', question: 'Workflow oder autonomer Agent?',
          bestOptionId: 'agent',
          options: [
            { id: 'workflow', label: 'Fester Workflow', rationale: 'Zu starr: unbekannte, dynamische Schritte passen nicht in einen festen Pfad.' },
            { id: 'agent', label: 'Autonomer Agent (mit Stop-Bedingungen)', rationale: 'Passt: offene Planung rechtfertigt Autonomie — mit Budget und Checkpoints.' },
          ],
        },
        {
          id: 'model', dimension: 'tradeoff_fit', label: 'Modell', question: 'Welche Modell-Wahl?',
          bestOptionId: 'bigger-accurate',
          options: [
            { id: 'bigger-accurate', label: 'Stärkeres Modell für Genauigkeit', rationale: 'Passt: Genauigkeit ist gefordert, Latenz ist hier zweitrangig.' },
            { id: 'cheapest', label: 'Das billigste Modell', rationale: 'Falle: spart Kosten, verfehlt aber die geforderte Genauigkeit.' },
          ],
        },
      ],
    },
  },
  {
    id: 'DIR-BRIEF-BASE',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-12-01',
    title: 'Der Brief ist der Engpass',
    prompt:
      'Ein Stakeholder-Auftrag, wörtlich so an einen Agenten gegeben. Mach ihn ausführbar — der Agent baut, was dasteht, nicht was du meinst.',
    concepts: ['CONCEPT-DIR-005'],
    prerequisites: ['NODE-11-04'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['direction_transfer', 'tradeoff_transfer'],
    scenarioData: {
      scenario: 'Auftrag, wörtlich: „Bau einen CSV-Export für Bestellungen — schnell und sicher.“ Ein starker Agent würde sofort loslegen.',
      constraint: '„Schnell“ und „sicher“ kann der Agent nicht prüfen — und du auch nicht. Was hier zählt, ist, das Vage in Prüfbares zu übersetzen, ohne die Umsetzung vorzuschreiben.',
      stations: [
        {
          id: 'spec', dimension: 'simplicity_fit', label: 'Anforderung', question: 'Wie gibst du „schnell und sicher“ weiter?',
          bestOptionId: 'measurable',
          options: [
            { id: 'measurable', label: 'Messbar machen: welche Felder, welches Format, p95-Latenzziel, welche Auth-Rolle — Umsetzung offen', rationale: 'Passt: der Agent zielt präzise und wählt den Weg selbst. „Schnell/sicher“ werden zu prüfbaren Zahlen.' },
            { id: 'feels-clear', label: 'So lassen — „schnell und sicher“ sagt klar, worauf es ankommt', rationale: 'Die teuerste Falle: qualitative Ziele FÜHLEN sich klar an, sind aber nicht ausführbar. Der Agent rät, was „schnell genug“ heißt — und liegt plausibel daneben.' },
            { id: 'prescribe', label: 'Sicher ist sicher: die genaue SQL-Query und die Function-Signaturen vorgeben', rationale: 'Falle der Gründlichen: du schreibst die Lösung selbst, der Agent kann nicht optimieren, und der Brief bricht bei jeder Schema-Änderung.' },
          ],
        },
        {
          id: 'done', dimension: 'tradeoff_fit', label: 'Definition of Done', question: 'Wie wird „sicher“ ein „fertig“-Kriterium?',
          bestOptionId: 'testable',
          options: [
            { id: 'testable', label: 'Prüfbar: nur Rollen mit `orders:read` exportieren — Test mit und ohne Recht', rationale: 'Passt: bestanden/durchgefallen ist eindeutig; der Agent (und CI) kann es selbst prüfen.' },
            { id: 'review', label: 'Ein Senior reviewt den Export vor jedem Release', rationale: 'Falle, die verantwortungsvoll wirkt: verschiebt die Prüfung auf einen Menschen statt sie messbar zu machen — subjektiv und skaliert nicht.' },
            { id: 'no-obvious', label: '„Keine offensichtlichen Sicherheitslücken“', rationale: 'Falle: „offensichtlich“ ist nicht testbar — was zählt als Lücke? Klingt nach Kriterium, ist keins.' },
          ],
        },
      ],
    },
  },
  {
    id: 'DIR-SWARM-COST',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-11-02',
    title: 'Eine Biene oder ein Schwarm — die Kosten',
    prompt:
      'Mehr Bienen klingt nach mehr Tempo. Wäg die andere Seite ab: jede zusätzliche Biene kostet Koordination, Integration und Tokens. Wann zahlt sich Parallelität wirklich aus?',
    concepts: ['CONCEPT-DIR-002'],
    prerequisites: ['NODE-11-01'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['direction_transfer', 'overengineering_repair'],
    scenarioData: {
      scenario: 'Du überlegst, mehr Agenten auf das Feature zu setzen. Aktuelle Praxis ist deutlich: ab einer kleinen Pod-Größe bremst jede weitere Biene mehr, als sie beiträgt — die Koordination frisst den Gewinn.',
      constraint: 'Ein klar umrissener Task mit eng gekoppelten Schritten. Parallelität erzeugt hier vor allem Merge- und Abstimmungsaufwand.',
      stations: [
        {
          id: 'size', dimension: 'simplicity_fit', label: 'Pod-Größe', question: 'Wie viele Bienen setzt du auf den Task?',
          bestOptionId: 'small',
          options: [
            { id: 'small', label: 'So wenige wie nötig — ein kleiner Pod', rationale: 'Passt: ein definierter Task braucht keinen Schwarm; weniger Koordination, weniger Integrationsnähte.' },
            { id: 'max', label: 'So viele wie möglich fürs Tempo', rationale: 'Falle: jede zusätzliche Biene bringt Koordinations- und Integrationskosten, die den Tempogewinn auffressen.' },
          ],
        },
        {
          id: 'when', dimension: 'tradeoff_fit', label: 'Wann parallel?', question: 'Wann lohnt sich überhaupt eine zusätzliche Biene?',
          bestOptionId: 'independent',
          options: [
            { id: 'independent', label: 'Nur bei einer wirklich unabhängigen Teilaufgabe', rationale: 'Passt: Parallelität zahlt sich nur, wenn die Arbeit ohne enge Kopplung getrennt laufen kann.' },
            { id: 'always', label: 'Immer — mehr Hände sind mehr Output', rationale: 'Falle: bei gekoppelter Arbeit erzeugt mehr Parallelität mehr Konflikte und Merge-Aufwand, nicht mehr Output.' },
          ],
        },
      ],
    },
  },
  {
    id: 'DIR-INTERVENE',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-12-03',
    title: 'Eingreifen oder laufen lassen',
    prompt:
      'Eine Biene driftet seit einer Weile vom Brief ab — schon halb fertig, aber auf dem falschen Weg. Entscheide, was du tust, und wie du es früher fängst. Sunk Cost zählt nicht.',
    concepts: ['CONCEPT-DIR-007'],
    prerequisites: ['NODE-12-02'],
    difficulty: 'advanced',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['direction_transfer'],
    scenarioData: {
      scenario: 'Eine von mehreren parallelen Bienen weicht erkennbar vom Brief ab. Sie hat schon einiges produziert — manches brauchbar, der Kurs aber falsch.',
      constraint: 'Stoppen wirft Arbeit weg; laufen lassen wirft mehr weg. Was schon investiert ist, ist verloren — entscheide nach dem, was noch kommt.',
      stations: [
        {
          id: 'action', dimension: 'tradeoff_fit', label: 'Sofort', question: 'Was tust du mit der abdriftenden Biene?',
          bestOptionId: 'rebrief',
          options: [
            { id: 'rebrief', label: 'Re-briefen und mit korrigiertem Ziel weiterlaufen lassen', rationale: 'Passt: korrigiert den Kurs und behält die brauchbaren Teile.' },
            { id: 'letfinish', label: 'Fertig laufen lassen — ist ja fast fertig', rationale: 'Falle: Sunk-Cost — fast fertig auf dem falschen Weg ist immer noch der falsche Weg.' },
            { id: 'hardstop', label: 'Hart stoppen und komplett neu starten', rationale: 'Overkill: wirft auch die brauchbaren Teile weg; meist reicht ein Re-Brief.' },
          ],
        },
        {
          id: 'prevent', dimension: 'simplicity_fit', label: 'Künftig', question: 'Wie fängst du Drift früher, ohne zu micromanagen?',
          bestOptionId: 'checkpoints',
          options: [
            { id: 'checkpoints', label: 'Frühe Checkpoints gegen den Brief', rationale: 'Passt: Drift früh fangen kostet weniger als spät — kurze Leine nur an den richtigen Stellen.' },
            { id: 'micromanage', label: 'Jeden einzelnen Schritt vorab freigeben', rationale: 'Falle: Mikromanagement erstickt die Autonomie, die den Agenten überhaupt nützlich macht.' },
          ],
        },
      ],
    },
  },
  {
    id: 'DIR-ACCEPT-BASE',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-13-02',
    title: 'Abnehmen oder zurückgeben',
    prompt:
      'Der Agent liefert eine PR für den CSV-Export. Review heißt: gegen den BRIEF prüfen, nicht gegen Geschmack. Nimm nichts ab, das ein Akzeptanzkriterium verfehlt — und blockiere nichts wegen Stil.',
    concepts: ['CONCEPT-DIR-009'],
    prerequisites: ['NODE-13-01'],
    difficulty: 'advanced',
    estimatedMinutes: 6,
    isTransfer: false,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['direction_transfer', 'tradeoff_transfer'],
    scenarioData: {
      scenario: 'Der Brief verlangte: nur Rollen mit `orders:read` dürfen exportieren, p95 < 200 ms, CSV mit Header. Die gelieferte PR: läuft, ist schnell, sauber geschrieben — aber der Rollen-Check fehlt komplett.',
      constraint: 'Eine PR wird gegen die Akzeptanzkriterien abgenommen, nicht gegen den ersten Eindruck. „Sieht fertig aus“ ist keine Abnahme.',
      stations: [
        {
          id: 'verdict', dimension: 'tradeoff_fit', label: 'Entscheidung', question: 'Was tust du mit der PR?',
          bestOptionId: 'sendback-gap',
          options: [
            { id: 'sendback-gap', label: 'Zurück: das Kriterium „nur orders:read“ ist nicht erfüllt', rationale: 'Passt: ein verfehltes, geprüftes Sicherheitskriterium blockiert die Abnahme — egal wie sauber der Rest ist.' },
            { id: 'accept-looks', label: 'Abnehmen — läuft, ist schnell und sauber geschrieben', rationale: 'Rubber-Stamp-Falle: „sieht fertig aus“ ist keine Prüfung; ein definiertes Sicherheitskriterium fehlt und du winkst es durch.' },
            { id: 'sendback-style', label: 'Zurück: die Variablennamen gefallen dir nicht', rationale: 'Nitpick-Falle: Stil blockiert keine Abnahme; das hält Lieferung auf, ohne ein Kriterium zu adressieren.' },
          ],
        },
        {
          id: 'feedback', dimension: 'simplicity_fit', label: 'Rückmeldung', question: 'Wie gibst du es zurück?',
          bestOptionId: 'specific',
          options: [
            { id: 'specific', label: 'Mit dem konkret verfehlten Kriterium + einem Testfall (mit/ohne Recht)', rationale: 'Passt: der Agent kann gezielt nachbessern und selbst prüfen — eine Runde, fertig.' },
            { id: 'vague', label: '„Bitte nochmal sicherer machen.“', rationale: 'Falle: vage Rückmeldung erzeugt eine weitere Runde Raten — derselbe Brief-Fehler wie am Anfang, nur später.' },
          ],
        },
      ],
    },
  },
  {
    id: 'RT-BRIEF',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-13-03',
    title: 'Round-Trip — Phase 1: briefen',
    prompt:
      'Echter Build, end-to-end. Auftrag: „Füg 2FA zum Login hinzu — sicher, aber nicht nervig.“ Übersetze beides in prüfbare Kriterien, bevor eine Biene loslegt.',
    concepts: ['CONCEPT-DIR-005', 'all_core'],
    prerequisites: ['NODE-13-02'],
    difficulty: 'capstone',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['direction_transfer', 'capstone_transfer'],
    scenarioData: {
      scenario: 'Feature-Request, wörtlich: „2FA für den Login, sicher aber nicht nervig.“ Ein starker Agent würde sofort eine Variante bauen — die Frage ist, welche.',
      constraint: '„Sicher“ und „nicht nervig“ sind keine Vorgaben, die der Agent prüfen kann. Mach beide testbar, ohne die Umsetzung vorzuschreiben.',
      stations: [
        {
          id: 'secure', dimension: 'simplicity_fit', label: 'Sicher', question: 'Wie machst du „sicher“ prüfbar?',
          bestOptionId: 'standard',
          options: [
            { id: 'standard', label: 'TOTP nach RFC 6238, Secret verschlüsselt at rest, Recovery-Codes — Umsetzung offen', rationale: 'Passt: konkrete, prüfbare Anforderungen; der Agent wählt Library und Schema selbst.' },
            { id: 'bestpractice', label: '„Nach gängigen Security-Best-Practices umsetzen“', rationale: 'Die teure Falle: klingt verantwortungsvoll, ist aber nicht prüfbar — welcher Standard, welche Recovery? Der Agent rät.' },
            { id: 'prescribe', label: 'Die genaue Library, Tabellen und das Verschlüsselungsverfahren vorschreiben', rationale: 'Falle der Gründlichen: du baust die Lösung, der Agent kann nicht optimieren, und es bricht, wenn die Library wechselt.' },
          ],
        },
        {
          id: 'ux', dimension: 'tradeoff_fit', label: 'Nicht nervig', question: 'Wie machst du „nicht nervig“ zu einem Kriterium?',
          bestOptionId: 'risk-based',
          options: [
            { id: 'risk-based', label: '2FA nur bei neuem Gerät / Risiko-Signal, „Gerät merken“ für 30 Tage', rationale: 'Passt: messbar (Reibung nur wenn nötig) und sicher — ein klares, testbares Verhalten.' },
            { id: 'always', label: 'Bei JEDEM Login abfragen — sicherer ist immer besser', rationale: 'Falle: verwechselt mehr Reibung mit mehr Sicherheit; genau das „nervig“, das der Brief ausschließt — Nutzer schalten es ab.' },
          ],
        },
      ],
    },
  },
  {
    id: 'RT-ACCEPT',
    interactionType: 'trade-off-duel',
    labId: 'LAB-TRADE-OFF-DUEL',
    roadmapNodeId: 'NODE-13-03',
    title: 'Round-Trip — Phase 4: abnehmen',
    prompt:
      'Die Biene liefert die 2FA-PR. Tests grün, läuft sauber — aber prüf gegen DEINEN Brief, nicht gegen den ersten Eindruck.',
    concepts: ['CONCEPT-DIR-009', 'all_core'],
    prerequisites: ['NODE-13-02'],
    difficulty: 'capstone',
    estimatedMinutes: 5,
    isTransfer: false,
    scoringProfileId: 'tod-default',
    feedbackProfileId: 'tod-default',
    reviewHooks: ['direction_transfer', 'capstone_transfer'],
    scenarioData: {
      scenario: 'Die PR: TOTP funktioniert, „Gerät merken“ ist drin, Tests grün, sauberer Code. Aber die Recovery-Codes aus deinem Brief fehlen — genau die Lücke, die vorhin Nutzer ausgesperrt hat.',
      constraint: 'Abnahme heißt: alle Akzeptanzkriterien erfüllt. Ein fehlendes Sicherheits-Kriterium blockiert — auch wenn alles andere glänzt.',
      stations: [
        {
          id: 'verdict', dimension: 'tradeoff_fit', label: 'Abnahme', question: 'Was tust du mit der PR?',
          bestOptionId: 'sendback',
          options: [
            { id: 'sendback', label: 'Zurück: Recovery-Codes (Brief-Kriterium) fehlen', rationale: 'Passt: ein definiertes Kriterium ist nicht erfüllt — und es ist genau das, was sonst Nutzer aussperrt.' },
            { id: 'accept', label: 'Abnehmen — TOTP läuft, Tests sind grün, Code ist sauber', rationale: 'Rubber-Stamp-Falle: grüne Tests prüfen nur, was getestet wurde; das fehlende Kriterium ist nicht getestet — und du winkst es durch.' },
            { id: 'merge-fix', label: 'Mergen und Recovery-Codes als Ticket nachziehen', rationale: 'Falle: ein Sicherheits-Kriterium „später“ heißt in Produktion ohne Recovery — der Vorfall von vorhin, nochmal.' },
          ],
        },
        {
          id: 'closeout', dimension: 'simplicity_fit', label: 'Abschluss', question: 'Wie verhinderst du, dass die Lücke wiederkommt?',
          bestOptionId: 'regression',
          options: [
            { id: 'regression', label: 'Recovery-Code-Flow als Akzeptanz- UND Regressionstest ergänzen', rationale: 'Passt: das Kriterium wird ab jetzt automatisch geprüft — die ganze Fehlerklasse ist zu.' },
            { id: 'manual', label: 'Einmal manuell prüfen, dass es jetzt da ist', rationale: 'Falle: ein Einmal-Check — die nächste Änderung kann es still wieder brechen.' },
          ],
        },
      ],
    },
  },
]
