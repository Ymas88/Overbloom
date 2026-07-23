import { CAVE_UNLOCK_MINUTES, getTotalStudyMinutes } from '../game/unlocks'

// Shown when the player walks up to the barred cave portal before they've
// studied enough — explains the gate instead of leaving it as a silent wall.
function CaveLockPanel({ sessions, onClose }) {
  const studied = Math.floor(getTotalStudyMinutes(sessions))
  const remaining = Math.max(0, CAVE_UNLOCK_MINUTES - studied)

  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Crystal Hollows — Sealed</h2>
      <p className="timer-display">
        {studied}/{CAVE_UNLOCK_MINUTES}m
      </p>
      <p>
        Study {remaining} more minute{remaining === 1 ? '' : 's'} to break the barrier.
      </p>
    </div>
  )
}

export default CaveLockPanel
