// Trust Boundary mechanic (MECH-BOUNDARY, control/07). Place each system element into
// the trust zone that contains its risk — protect the dangerous paths, don't over-block
// the harmless ones. Tap-to-zone (mobile-safe, LR-015), no drag.

export interface TrustZone {
  id: string
  label: string
  hint: string
}

export interface BoundaryElement {
  id: string
  label: string
  note: string
  risk: 'high' | 'low'
  /** The zone that correctly contains this element. */
  bestZone: string
  /** Consequence of leaving it in too permissive / wrong a zone. */
  wrongText: string
}

export interface BoundaryScenarioData {
  system: string
  zones: TrustZone[]
  elements: BoundaryElement[]
}

/** elementId -> zoneId. */
export type BoundaryConfig = Record<string, string>
