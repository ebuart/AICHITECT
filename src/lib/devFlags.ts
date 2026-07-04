// Dev-only flags. Kept out of feature logic so the production build stays correct.

// Playtest convenience: in `npm run dev`, roadmap nodes are greyed-but-playable —
// prerequisites are NOT enforced, so any lesson/lab can be opened to test it. The
// production build keeps real roadmap gating (PC-002, RD-001, QG-047). Flip the
// expression to `false` to restore gating in dev too.
export const UNLOCK_ALL = import.meta.env.DEV
