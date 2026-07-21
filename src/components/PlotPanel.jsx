import Timer from './Timer'
import { getGrowthStage, HARVEST_REWARD } from '../game/growth'

function PlotPanel({ subject, sessions, harvestedAt, onSessionSaved, onHarvest, onClose }) {
  const subjectSessions = sessions.filter((s) => s.subjectId === subject.id)
  const { stage } = getGrowthStage(subjectSessions, Date.now(), harvestedAt)
  const readyToHarvest = stage === 4

  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{subject.name}</h2>

      {readyToHarvest && (
        <div className="harvest-box">
          <p>Ready to harvest!</p>
          <button onClick={() => onHarvest(subject.id)}>Harvest for {HARVEST_REWARD} coins</button>
        </div>
      )}

      <Timer subjectId={subject.id} onSessionSaved={onSessionSaved} />
    </div>
  )
}

export default PlotPanel
