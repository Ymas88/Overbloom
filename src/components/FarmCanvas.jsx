import { useEffect, useRef } from 'react'
import { drawScene } from '../canvas/scene'
import { drawSprite, SCENE_WIDTH, SCENE_HEIGHT } from '../canvas/sprites'
import { onTilesetReady } from '../canvas/tileset'
import { onGrowthSpritesReady } from '../canvas/growthSprites'

// Movement isn't wired up yet — the character just stands in the field so
// the new top-down look can be reviewed before that lands.
const PLAYER_X = SCENE_WIDTH / 2
const PLAYER_Y = SCENE_HEIGHT - 48

function FarmCanvas({ subjects, sessions }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    function render() {
      drawScene(ctx, { subjects, sessions })
      drawSprite(ctx, 'player', PLAYER_X, PLAYER_Y, 0, { facing: 'down' })
    }

    render()
    onTilesetReady(render)
    onGrowthSpritesReady(render)
  }, [subjects, sessions])

  return (
    <canvas
      ref={canvasRef}
      width={SCENE_WIDTH}
      height={SCENE_HEIGHT}
      className="farm-canvas"
    />
  )
}

export default FarmCanvas
