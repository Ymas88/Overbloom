import { useEffect, useRef } from 'react'
import { getGrowthStage } from '../game/growth'
import { playSound } from '../playSound'

const STAGE_SPRITES = [
  '/sprites/plots/soil.png',
  '/sprites/plots/stage1-sprout.png',
  '/sprites/plots/stage2-growing.png',
  '/sprites/plots/stage3-mature.png',
  '/sprites/plots/stage4-harvest.png',
]

function FarmScene({ subjects, sessions }) {
  const previousStages = useRef({})

  const plots = subjects.map((subject) => {
    const subjectSessions = sessions.filter(
      (session) => session.subjectId === subject.id
    )
    return { subject, ...getGrowthStage(subjectSessions) }
  })

  // Play a chime whenever a subject's stage goes up compared to last render.
  // Skipped on first sight of a subject so page load never plays sound.
  const stageSignature = plots.map((p) => `${p.subject.id}:${p.stage}`).join(',')
  useEffect(() => {
    plots.forEach(({ subject, stage }) => {
      const previous = previousStages.current[subject.id]
      if (previous !== undefined && stage > previous) {
        playSound('/sounds/stage-up.mp3')
      }
      previousStages.current[subject.id] = stage
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSignature])

  if (subjects.length === 0) {
    return <p>Add a subject below to start your farm.</p>
  }

  return (
    <div className="farm-grid">
      {plots.map(({ subject, stage, isWilting }) => (
        <div key={subject.id} className="plot">
          {/* key={stage} remounts the wrapper on stage change, replaying the pop-in animation */}
          <div className="plot-sprite-wrap" key={stage}>
            <img
              src={STAGE_SPRITES[stage]}
              alt={`growth stage ${stage}`}
              className="plot-sprite"
            />
          </div>
          {isWilting && (
            <img
              src="/sprites/plots/wilted.png"
              alt="wilting"
              className="plot-wilt-badge"
            />
          )}
          <span className="plot-label">{subject.name}</span>
        </div>
      ))}
    </div>
  )
}

export default FarmScene
