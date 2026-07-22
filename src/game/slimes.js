// Slimes live only in the cave zone: spawners scattered around it create
// them over time, they hop toward the player, and popping one (by
// touching the player) triggers a math question elsewhere in the app —
// this module only knows about movement and collision, not the quiz.
export const SLIME_SPEED = 28 // virtual px per second — slower than the player, so they're avoidable
export const HIT_RADIUS = 10
export const HOP_CYCLE_DURATION = 0.8
export const POP_DURATION = 0.5
export const SPAWN_INTERVAL = 5 // seconds between spawn attempts, per spawner
export const MAX_SLIMES = 6

let nextId = 0

export function spawnSlime(x, y) {
  nextId += 1
  return { id: nextId, x, y, hopClock: Math.random() * HOP_CYCLE_DURATION, popping: false, popClock: 0 }
}

// Mutates the slime in place (matches the player/harvest ref pattern used
// elsewhere in this codebase, since this runs every animation frame).
export function updateSlime(slime, dt, targetX, targetY) {
  if (slime.popping) {
    slime.popClock += dt
    return
  }

  const dx = targetX - slime.x
  const dy = targetY - slime.y
  const dist = Math.hypot(dx, dy)
  if (dist > 1) {
    slime.x += (dx / dist) * SLIME_SPEED * dt
    slime.y += (dy / dist) * SLIME_SPEED * dt
  }
  slime.hopClock += dt
}

export function hitsTarget(slime, targetX, targetY) {
  return !slime.popping && Math.hypot(slime.x - targetX, slime.y - targetY) < HIT_RADIUS
}

export function isDonePopping(slime) {
  return slime.popping && slime.popClock >= POP_DURATION
}
