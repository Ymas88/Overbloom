import { getGrowthStage } from '../game/growth'

const STAGE_SPRITES = [
  '/sprites/plots/soil.png',
  '/sprites/plots/stage1-sprout.png',
  '/sprites/plots/stage2-growing.png',
  '/sprites/plots/stage3-mature.png',
  '/sprites/plots/stage4-harvest.png',
]

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
            <img
              src={STAGE_SPRITES[stage]}
              alt={`growth stage ${stage}`}
              className="plot-sprite"
            />
            {isWilting && (
              <img
                src="/sprites/plots/wilted.png"
                alt="wilting"
                className="plot-wilt-badge"
              />
            )}
            <span className="plot-label">{subject.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default FarmScene
