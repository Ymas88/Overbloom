import { getGrowthStage } from '../game/growth'

const STAGE_EMOJI = ['🟫', '🌱', '🌿', '🌾', '✨']

function FarmScene({ subjects, sessions }) {
  if (subjects.length === 0) {
    return <p>Add a subject below to start your farm.</p>
  }

  return (
    <div className="farm-grid">
      {subjects.map((subject) => {
        const subjectSessions = sessions.filter(
          (session) => session.subjectId === subject.id
        )
        const { stage, isWilting } = getGrowthStage(subjectSessions)

        return (
          <div key={subject.id} className="plot">
            <span className="plot-emoji">
              {STAGE_EMOJI[stage]}
              {isWilting && ' 🥀'}
            </span>
            <span className="plot-label">{subject.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default FarmScene
