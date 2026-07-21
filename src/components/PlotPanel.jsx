import Timer from './Timer'
import { getGrowthStage } from '../game/growth'
import { getCropOrDefault, RARITIES } from '../game/crops'

function PlotPanel({ subject, sessions, harvestedAt, cropId, onSessionSaved, onHarvest, onClose }) {
  const subjectSessions = sessions.filter((s) => s.subjectId === subject.id)
  const { stage } = getGrowthStage(subjectSessions, Date.now(), harvestedAt)
  const readyToHarvest = stage === 4

  const crop = getCropOrDefault(cropId)
  const reward = RARITIES[crop.rarity].reward

  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{subject.name}</h2>

      <p>
        Growing: {crop.name} ({RARITIES[crop.rarity].label})
      </p>

      {readyToHarvest && (
        <div className="harvest-box">
          <p>Ready to harvest!</p>
          <button onClick={() => onHarvest(subject.id)}>Harvest for {reward} coins</button>
        </div>
      )}

      <Timer subjectId={subject.id} onSessionSaved={onSessionSaved} />
    </div>
  )
}

export default PlotPanel
