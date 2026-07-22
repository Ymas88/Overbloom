import { useEffect, useRef } from 'react'
import { drawScene, computeLayout, getInteractionTargets, findNearbyTarget, PORTAL_RANGE } from '../canvas/scene'
import {
  drawSprite,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  HARVEST_ANIM_DURATION,
  SWORD_SWING_DURATION,
} from '../canvas/sprites'

const PLAYER_SPEED = 90 // virtual px per second
const MARGIN = 8
const FOOTPRINT = { width: 10, height: 8 } // collision box around the feet, not the whole sprite

const MOVE_KEYS = {
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  A: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0],
  D: [1, 0],
  ArrowUp: [0, -1],
  w: [0, -1],
  W: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1],
  S: [0, 1],
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

function footprintAt(x, y) {
  return { x: x - FOOTPRINT.width / 2, y: y - FOOTPRINT.height, width: FOOTPRINT.width, height: FOOTPRINT.height }
}

function collides(x, y, solids) {
  const box = footprintAt(x, y)
  return solids.some((solid) => rectsOverlap(box, solid))
}

// Camera top-left corner, in world coordinates, centered on the player and
// clamped so the view never scrolls past the world's edges.
function cameraFor(player) {
  return {
    x: Math.max(0, Math.min(WORLD_WIDTH - VIEWPORT_WIDTH, player.x - VIEWPORT_WIDTH / 2)),
    y: Math.max(0, Math.min(WORLD_HEIGHT - VIEWPORT_HEIGHT, player.y - VIEWPORT_HEIGHT / 2)),
  }
}

function FarmCanvas({
  subjects,
  sessions,
  harvests,
  subjectCrops,
  paused,
  harvestSignal,
  equippedSwordId,
  onInteract,
}) {
  const canvasRef = useRef(null)
  const playerRef = useRef({ x: VIEWPORT_WIDTH / 2, y: VIEWPORT_HEIGHT - 32, facing: 'right' })
  const keysRef = useRef(new Set())
  const pausedRef = useRef(paused)
  const onInteractRef = useRef(onInteract)
  const harvestingRef = useRef(false)
  const harvestClockRef = useRef(0)
  const swingingRef = useRef(false)
  const swingClockRef = useRef(0)
  const equippedSwordIdRef = useRef(equippedSwordId)

  useEffect(() => {
    pausedRef.current = paused
    if (paused) keysRef.current.clear()
  }, [paused])

  useEffect(() => {
    onInteractRef.current = onInteract
  }, [onInteract])

  useEffect(() => {
    equippedSwordIdRef.current = equippedSwordId
  }, [equippedSwordId])

  // Each harvest bumps this counter — kick off the crouch-and-pop animation
  // whenever it changes, regardless of the new value.
  useEffect(() => {
    if (!harvestSignal) return
    harvestingRef.current = true
    harvestClockRef.current = 0
  }, [harvestSignal])

  useEffect(() => {
    function handleKeyDown(e) {
      if (pausedRef.current) return
      if (MOVE_KEYS[e.key]) keysRef.current.add(e.key)
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        const layout = computeLayout(subjects.length)
        const targets = getInteractionTargets(layout, subjects)
        const nearby = findNearbyTarget(targets, playerRef.current.x, playerRef.current.y)
        if (nearby) onInteractRef.current?.(nearby)
      }
    }
    function handleKeyUp(e) {
      keysRef.current.delete(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [subjects])

  // Clicking (or tapping a touchpad) the canvas swings the equipped sword —
  // purely a visual flourish, gated on having one equipped and not being
  // mid-panel so it doesn't fire behind an open popup.
  useEffect(() => {
    const canvas = canvasRef.current
    function handleClick() {
      if (pausedRef.current || !equippedSwordIdRef.current) return
      swingingRef.current = true
      swingClockRef.current = 0
    }
    canvas.addEventListener('mousedown', handleClick)
    return () => canvas.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    let animationFrameId
    let lastTime = performance.now()

    function frame(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const layout = computeLayout(subjects.length)
      const targets = getInteractionTargets(layout, subjects)
      const player = playerRef.current

      let walking = false

      if (!pausedRef.current) {
        const keys = keysRef.current
        let dx = 0
        let dy = 0
        for (const key of keys) {
          const [mx, my] = MOVE_KEYS[key] ?? [0, 0]
          dx += mx
          dy += my
        }
        walking = dx !== 0 || dy !== 0

        if (walking) {
          const len = Math.hypot(dx, dy)
          dx /= len
          dy /= len
          if (dx < 0) player.facing = 'left'
          else if (dx > 0) player.facing = 'right'

          const nx = player.x + dx * PLAYER_SPEED * dt
          if (!collides(nx, player.y, layout.solids)) {
            player.x = Math.max(MARGIN, Math.min(WORLD_WIDTH - MARGIN, nx))
          }
          const ny = player.y + dy * PLAYER_SPEED * dt
          if (!collides(player.x, ny, layout.solids)) {
            player.y = Math.max(MARGIN, Math.min(WORLD_HEIGHT - MARGIN, ny))
          }
        }
      }

      if (!pausedRef.current) {
        const portal = layout.portals.find(
          (p) => Math.hypot(p.x - player.x, p.y - player.y) < PORTAL_RANGE
        )
        if (portal) {
          player.x = portal.to.x
          player.y = portal.to.y
        }
      }

      player.walkClock = walking ? (player.walkClock ?? 0) + dt : 0

      if (harvestingRef.current) {
        harvestClockRef.current += dt
        if (harvestClockRef.current >= HARVEST_ANIM_DURATION) {
          harvestingRef.current = false
          harvestClockRef.current = 0
        }
      }

      if (swingingRef.current) {
        swingClockRef.current += dt
        if (swingClockRef.current >= SWORD_SWING_DURATION) {
          swingingRef.current = false
          swingClockRef.current = 0
        }
      }

      const camera = cameraFor(player)

      ctx.save()
      ctx.translate(-Math.round(camera.x), -Math.round(camera.y))

      drawScene(ctx, { subjects, sessions, harvests, subjectCrops, camera })
      drawSprite(ctx, 'player', player.x, player.y, 0, {
        facing: player.facing,
        walking,
        walkClock: player.walkClock,
        idleClock: now / 1000,
        harvesting: harvestingRef.current,
        harvestClock: harvestClockRef.current,
        equippedSwordId: equippedSwordIdRef.current,
        swinging: swingingRef.current,
        swingClock: swingClockRef.current,
      })

      const nearby = pausedRef.current ? null : findNearbyTarget(targets, player.x, player.y)
      if (nearby) {
        const bob = Math.sin(now / 200) * 1.5
        drawSprite(ctx, 'interactPrompt', nearby.x, nearby.y - 24, 0, { bob })
      }

      ctx.restore()

      animationFrameId = requestAnimationFrame(frame)
    }

    animationFrameId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animationFrameId)
  }, [subjects, sessions, harvests, subjectCrops])

  return (
    <canvas
      ref={canvasRef}
      width={VIEWPORT_WIDTH}
      height={VIEWPORT_HEIGHT}
      className="farm-canvas"
    />
  )
}

export default FarmCanvas
