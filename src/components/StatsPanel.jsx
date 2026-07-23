// Total time studied across every subject, all-time — not just today's
// quest progress. Computed straight from session history, nothing stored.
function StatsPanel({ sessions, onClose }) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)

  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Study Stats</h2>
      <p className="timer-display">
        {hours}h {minutes}m
      </p>
      <p>Total time studied across every subject, all-time.</p>
    </div>
  )
}

export default StatsPanel
