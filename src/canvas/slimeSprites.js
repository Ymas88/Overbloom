import { HOP_CYCLE_DURATION, POP_DURATION } from '../game/slimes'

// slime.png (Mystic Woods, free/non-commercial license — see
// public/sprites/characters/slime-LICENSE.txt) is a 7-column sheet of
// 32x32 frames, not the 16x16 grid the other tile sheets use, so this
// loads it directly instead of going through createTileSheet.
const COLS = 7
const FRAME = 32

const image = new Image()
image.src = '/sprites/characters/slime.png'
let ready = image.complete
const readyListeners = []

image.onload = () => {
  ready = true
  readyListeners.splice(0).forEach((cb) => cb())
}

export function onSlimeSpritesReady(callback) {
  if (ready) callback()
  else readyListeners.push(callback)
}

function drawFrame(ctx, index, x, y, size) {
  if (!ready) return
  const col = index % COLS
  const row = Math.floor(index / COLS)
  ctx.drawImage(image, col * FRAME, row * FRAME, FRAME, FRAME, Math.round(x), Math.round(y), size, size)
}

// A hop cycle (squash, rise with a shrinking shadow, land) picked from the
// sheet's movement rows, and a pop sequence (surprised, then shattering
// into smaller fragments) picked from its "death" row for when a slime
// touches the player.
const HOP_FRAMES = [21, 22, 23, 24, 25, 26]
const POP_FRAMES = [85, 86, 87, 88]

export function drawSlime(ctx, x, y, size, { hopClock = 0, popping = false, popClock = 0 } = {}) {
  if (popping) {
    const t = Math.min(popClock / POP_DURATION, 1)
    const frameIndex = Math.min(Math.floor(t * POP_FRAMES.length), POP_FRAMES.length - 1)
    drawFrame(ctx, POP_FRAMES[frameIndex], x - size / 2, y - size, size)
  } else {
    const t = (hopClock % HOP_CYCLE_DURATION) / HOP_CYCLE_DURATION
    const frameIndex = Math.floor(t * HOP_FRAMES.length) % HOP_FRAMES.length
    drawFrame(ctx, HOP_FRAMES[frameIndex], x - size / 2, y - size, size)
  }
}
