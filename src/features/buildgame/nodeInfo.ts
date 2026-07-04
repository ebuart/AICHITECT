import type { Zone } from './gameModel'

// Encyclopedia-style explanations shown in a node's Info box (NOT the short panel label). Each one
// says what the thing actually IS and why it matters in a real AI system — plain, concrete, 1–3
// sentences. Deliberately not marketing hero-phrases. Falls back to the building's blurb if missing.
export const NODE_INFO: Record<string, string> = {
  charter:
    'Der Projekt-Charter ist das eine Dokument, das festhält, was das System leisten soll – und ausdrücklich, was nicht (Non-Goals). Bei Unklarheit oder Streit gewinnt der Charter; er ist die oberste Referenz. Sein „Level" steht im Spiel für die Reife des Projekts (dein Tier) und schaltet tiefere Skills frei.',

  // Docs / Control Plane
  scratchNotes:
    'Eine einzige Datei, in der erstmal alles landet: Entscheidungen, offene Fragen, Zwischenstände. Unstrukturiert, aber besser als nichts – sie holt Wissen aus deinem Kopf an einen Ort. Der typische erste Schritt, bevor man Regeln und Zustand sauber trennt.',
  instructionsMd:
    'Die Regeln und Konventionen für den Agenten, herausgelöst aus den Notizen in ein eigenes, stabiles Dokument. So weiß das Modell verlässlich, was gilt – Stil, Grenzen, Vorgehen – statt es bei jedem Lauf neu zu erraten.',
  memoryMd:
    'Der durable Arbeitszustand, getrennt von den Regeln. instructions.md sagt, WIE gearbeitet wird; memory.md hält fest, WO das Projekt gerade steht. Die Trennung verhindert, dass sich Regeln und Stand gegenseitig überschreiben.',
  decisionLog:
    'Ein Log der getroffenen Entscheidungen samt Begründung (warum so, welche Alternativen verworfen). Verhindert, dass dieselben Fragen monatelang neu aufgerollt werden, und macht spätere Korrekturen nachvollziehbar.',
  featureLedger:
    'Eine kompakte Liste dessen, was bereits gebaut und fertig ist. So bekommt man – oder ein Agent – den Stand des Systems, ohne den ganzen Code lesen zu müssen.',
  openQuestions:
    'Eine sichtbare Liste des Ungeklärten. Bewusste offene Punkte, die sonst untergehen, bleiben so präsent – aus „das haben wir vergessen" wird „das steht noch offen".',
  projectMemory:
    'Durabler Projektzustand, der über einzelne Sessions hinweg hält. Jede neue Session – Mensch oder Agent – findet einen klaren Wiedereinstieg, statt bei null anzufangen.',
  idConvention:
    'Jede Regel und Entscheidung bekommt eine stabile ID wie [SEC-014] statt loser Stichpunkte. Dadurch sind sie referenzierbar („siehe [SEC-014]"), auffindbar und im Diff verfolgbar – die Grundlage, um mit mehreren Agenten diszipliniert zu arbeiten.',
  agentLearningLog:
    'Wiederkehrende Fehler werden festgehalten und zu Regeln verdichtet. So lernt der Agenten-Schwarm über Läufe hinweg dazu, statt denselben Fehler immer wieder zu machen.',
  sourceMaterialOs:
    'Die ausgereifte Doku-Control-Plane: alle Quellen – Regeln, Entscheidungen, Zustand, Lernlog – als eine ID-referenzierte Quelle der Wahrheit. Damit lässt sich ein Projekt verlässlich von einem ganzen Schwarm aus Agenten bearbeiten.',

  // Retrieval
  keywordSearch:
    'Klassische, lexikalische Suche: Sie findet Dokumente, in denen die exakten Suchbegriffe vorkommen. Schnell und präzise bei genauen Tokens (Namen, IDs, Fehlercodes), aber sie versteht keine Bedeutung – Synonyme oder Umschreibungen findet sie nicht.',
  embeddings:
    'Texte werden in Vektoren (lange Zahlenlisten) übersetzt, die ihre Bedeutung erfassen. Ähnliche Inhalte landen nah beieinander, sodass auch Synonyme und Paraphrasen gefunden werden – die Basis semantischer Suche.',
  vectorStore:
    'Eine Datenbank, die Embeddings speichert und blitzschnell die ähnlichsten findet (Nearest-Neighbor-Suche). Erst sie macht semantische Suche über große Mengen praktisch skalierbar.',
  rag:
    'Retrieval-Augmented Generation: Statt sich nur auf das Modellwissen zu verlassen, werden zur Antwortzeit passende Belege gesucht und dem Modell mitgegeben. So antwortet es auf Basis aktueller, projektspezifischer Quellen statt aus dem (veralteten) Training.',
  hybrid:
    'Kombiniert lexikalische und semantische Suche und fusioniert beide Trefferlisten (Reciprocal Rank Fusion). Deckt die blinden Flecken beider Verfahren ab – exakte Begriffe UND Bedeutung.',
  reranking:
    'Ein zweites, genaueres Modell (Cross-Encoder) sortiert die besten Kandidaten neu und schiebt die wirklich relevanten nach vorn. Teurer pro Treffer, aber deutlich präziser an der Spitze der Liste.',
  contextual:
    'Jeder Textabschnitt bekommt vor dem Indexieren etwas Kontext vorangestellt (z. B. woher er stammt). Dadurch bleiben auch einzelne, herausgelöste Chunks auffindbar und verständlich, statt aus dem Zusammenhang gerissen zu sein.',

  // Context
  contextBudget:
    'Der Kontext eines Modells ist begrenzt. Context-Budgeting heißt, diesen Platz bewusst zu verteilen – nur das Wichtigste hinein, statt alles hineinzukippen.',
  noiseControl:
    'Irrelevante Inhalte aktiv aussortieren, bevor sie ins Modell gelangen. Hohe Signaldichte schlägt schiere Menge – zu viel Rauschen verschlechtert nachweislich die Antworten.',
  compression:
    'Lange Inhalte verdichten (zusammenfassen), statt sie komplett wegzulassen. Kritische Details bleiben erhalten, während Platz im Kontext frei wird.',
  isolation:
    'Lärmige Teilaufgaben werden in eigene Subagenten mit eigenem Kontext ausgelagert. Der Hauptkontext bleibt sauber, und mehrere Teilprobleme lassen sich parallel bearbeiten.',

  // Agents & control flow
  singlePrompt:
    'Ein Prompt ist die Anweisung, die du einer generativen KI gibst. Beim Single Prompt steckt die ganze Aufgabe in einem einzigen Aufruf: Das Modell analysiert ihn und erzeugt direkt die wahrscheinlichste passende Antwort. Einfachste Stufe – gut für klar umrissene Aufgaben, aber ohne Zwischenschritte oder Kontrolle.',
  promptChain:
    'Mehrere Prompts werden zu festen Schritten verkettet, oft mit Prüfungen (Gates) dazwischen. Jeder Schritt baut auf dem Ergebnis des vorigen auf – verlässlicher als ein einziger großer Prompt.',
  workflow:
    'Deterministischer Control-Flow: feste Logik entscheidet, welche Schritte in welcher Reihenfolge laufen (Routing, Parallelisierung). Vorhersehbar und gut testbar, weil Code den Ablauf steuert und nicht das Modell.',
  router:
    'Eine Vorstufe, die die Anfrage klassifiziert und auf den passenden Spezialpfad lenkt (z. B. Frage vs. Aktion). So bearbeitet jeden Fall der dafür beste Prompt oder das beste Tool statt eines Allzweck-Prompts.',
  firstAgent:
    'Ein Agent plant selbst, handelt, beobachtet das Ergebnis und plant neu (Plan-Act-Observe). Sinnvoll, wenn die Schritte vorab nicht feststehen – mehr Autonomie, aber auch weniger Kontrolle als ein fester Workflow.',
  reactLoop:
    'Das Muster „Reasoning + Acting": Der Agent wechselt zwischen Nachdenken und Tool-Aufrufen, bis eine Stop-Bedingung erfüllt ist. Entscheidend sind sparsamer Tool-Einsatz und ein klares Abbruchkriterium, damit er nicht endlos läuft.',
  orchestrator:
    'Ein Orchestrator zerlegt eine große Aufgabe dynamisch und verteilt die Teile an Worker-Agenten. Voraussetzung, um Arbeit zu skalieren – aber er braucht Beobachtbarkeit, sonst verliert man den Überblick.',
  evaluatorOptimizer:
    'Ein Agent erzeugt, ein zweiter bewertet anhand prüfbarer Kriterien und gibt Feedback – in Schleife, bis das Ergebnis passt. Hebt die Qualität iterativ, kostet aber zusätzliche Durchläufe.',

  // Evals & observability
  smokeTests:
    'Wenige, schnelle Checks, die nur prüfen, ob das Grundlegende überhaupt funktioniert. Kein vollständiger Beweis, aber sie fangen die offensichtlichsten Brüche früh ab.',
  evalHarness:
    'Ein wiederholbares Testgerüst, das den echten Aufgaben-Erfolg misst – nicht nur, ob der Code läuft. Erst damit lässt sich objektiv sagen, ob eine Änderung das System besser oder schlechter macht.',
  taskSuccess:
    'Misst Erfolg am erreichten Endzustand, nicht am Wortlaut der Antwort. Beispiel: „Bestellung storniert?" – geprüft wird die tatsächliche Wirkung, nicht ob die Formulierung hübsch klingt.',
  groundingEval:
    'Prüft, ob jede Aussage der Antwort durch die mitgegebenen Belege gedeckt ist. Fängt Halluzinationen – frei Erfundenes – ab, indem Behauptung gegen Quelle gehalten wird.',
  regressionGate:
    'Ein hartes Tor vor dem Release: ohne grüne Tests kein Ausliefern, kritische Fälle haben ein Veto. Verhindert, dass eine Änderung still etwas kaputtmacht, das vorher lief.',
  traces:
    'Jeder Schritt eines Laufs wird nachvollziehbar protokolliert: welcher Prompt, welches Tool, welches Ergebnis. Grundlage, um im Nachhinein zu verstehen, warum der Agent etwas getan hat.',
  observability:
    'Aus Traces, Metriken und Logs entsteht ein Live-Bild des laufenden Systems. Bei Last siehst du, was passiert, statt zu raten – unverzichtbar, sobald es skaliert.',
  postmortems:
    'Nach einem Vorfall wird strukturiert aufgearbeitet, was schiefging und warum. Die Erkenntnisse werden zu dauerhaften Regeln, damit derselbe Fehler nicht wiederkommt.',

  // Security & governance
  inputValidation:
    'Eingaben werden an der Systemgrenze geprüft, bevor irgendwo damit gearbeitet wird – Format, Grenzen, Plausibilität. Die erste Verteidigungslinie; ungeprüfte Eingaben sind die häufigste Schwachstelle.',
  leastPrivilege:
    'Jedes Tool und jeder Agent bekommt nur die minimal nötigen Rechte. Geht etwas schief oder wird etwas übernommen, bleibt der mögliche Schaden klein.',
  approvalGate:
    'Vor riskanten, schwer umkehrbaren Aktionen (Geld bewegen, löschen, senden) wird eine menschliche Freigabe verlangt. Ein bewusster Stopp genau dort, wo Fehler teuer werden.',
  injectionDefense:
    'Prompt-Injection heißt: schädliche Anweisungen stecken versteckt in fremden Inhalten, und der Agent befolgt sie als Befehl. Die Abwehr behandelt untrusted Inhalte strikt als Daten, nie als Anweisung – eine klare, unfälschbare Grenze.',
  sandbox:
    'Code oder Tools laufen in einer abgeschotteten Umgebung mit begrenztem Zugriff. Wenn doch etwas schiefgeht, ist der Blast-Radius eingedämmt und greift nicht aufs ganze System über.',
  rateLimits:
    'Begrenzen, wie oft etwas pro Zeit passieren darf. Fängt Endlosschleifen, Kostenexplosionen und Missbrauch unter Last ab, bevor sie eskalieren.',
  auditLog:
    'Ein manipulationssicheres Protokoll: wer hat wann was getan. Macht Vorfälle im Nachhinein rekonstruierbar und ist für Compliance oft Pflicht.',
  governance:
    'Least Privilege, Rate-Limits, Freigaben und Audit als ein zusammenhängendes System statt loser Einzelmaßnahmen. Hält Kontrolle aufrecht, auch wenn das System stark wächst.',

  // Team & direction
  soloDev:
    'Der Ausgangspunkt: Du arbeitest allein, triffst alle Entscheidungen und führst alles selbst aus. Funktioniert im Kleinen, wird aber schnell zum Flaschenhals.',
  firstBee:
    'Eine ausführende „Biene": ein Agent, der die Tipparbeit übernimmt, während du dirigierst. Der erste Schritt von „selbst machen" zu „delegieren".',
  briefDiscipline:
    'Klare Aufträge mit Akzeptanzkriterien, bevor ein Agent loslegt. Ein guter Brief verhindert Nacharbeit und damit Tech-Debt – die meiste Schludrigkeit entsteht aus unklaren Aufträgen.',
  pod:
    'Mehrere Agenten arbeiten parallel an Teilaufgaben. Mehr Durchsatz – aber auch mehr Koordinationsaufwand, der gemanagt werden will.',
  decomposition:
    'Eine große Aufgabe in saubere Teilaufgaben zerlegen und ihre Abhängigkeiten ordnen, statt blind alles parallel zu starten. Weniger Konflikte, weniger Nacharbeit.',
  oversight:
    'Aufsicht dorthin lenken, wo das Risiko am größten ist, statt überall gleich viel zu prüfen. Begrenzte Aufmerksamkeit wird risikogewichtet eingesetzt.',
  conventions:
    'Gemeinsame Konventionen und kleine, fokussierte Einheiten – eine Einheit, eine Aufgabe. Solcher Code ist sicher änderbar und erzeugt weniger Tech-Debt.',
  directorPod:
    'Ein Product-Owner und Devs dirigieren den Agenten-Schwarm: Richtung, Priorisierung, Review. Klare Führung schlägt reine Tippgeschwindigkeit – entscheidend, sobald viele Agenten zusammenarbeiten.',
}

// The request phases, explained (2–3 sentences) — shown in the Info box for any owned skill.
export const ZONE_INFO: Record<Zone, string> = {
  boundary:
    'Die Grenze ist die Stelle, an der untrusted Eingaben ins System kommen – von Nutzern, Tools oder externen Quellen. Hier wird geprüft, validiert und abgewehrt, BEVOR irgendetwas das Modell oder ein Tool erreicht. Was hier durchrutscht, lässt sich später kaum noch einfangen – darum gehören Input-Validierung und Injection-Abwehr genau hierhin.',
  knowledge:
    'In dieser Phase wird Wissen beschafft und aufbereitet, das dem Modell für die Antwort fehlt – Retrieval, Embeddings, RAG, Kontext-Pflege. Wichtig ist: Das passiert VOR der Generierung, denn Belege nützen nur, wenn sie dem Modell vorliegen, bevor es antwortet.',
  model:
    'Das Herz des Ablaufs: Hier denkt und entscheidet das Modell, gesteuert durch Prompts, Agenten-Schleifen und die Doku-Control-Plane. Die Skills hier formen, WIE die Anfrage verarbeitet wird – vom einzelnen Prompt bis zum orchestrierten Schwarm.',
  tools:
    'Wenn das Modell in der Welt handelt – Tools aufruft, Daten ändert, etwas auslöst – braucht es Leitplanken direkt davor. Freigaben, Sandboxing und minimale Rechte sitzen genau VOR der Aktion, weil sich irreversible Schritte nicht zurücknehmen lassen.',
  check:
    'Nachdem das Modell geantwortet hat, aber BEVOR die Antwort rausgeht, wird geprüft: Deckt sie sich mit den Belegen, besteht sie die Tests, ist sie release-würdig? Diese Phase fängt Fehler und Halluzinationen ab, bevor der Nutzer sie sieht.',
  ops:
    'Quer über allem liegt der Betrieb: beobachten, protokollieren, regeln, aus Vorfällen lernen. Diese Skills gehören keiner einzelnen Stufe an, sondern halten das ganze System unter Last sichtbar und steuerbar.',
}
