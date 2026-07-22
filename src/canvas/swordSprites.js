import { SWORDS } from '../game/swords'

// One real 32x32 icon per sword, shown wherever a sword needs to render —
// shop/inventory lists, the reveal popup, and held in the player's hand.
const images = {}
const readyListeners = []
let readyCount = 0
const total = SWORDS.length

for (const sword of SWORDS) {
  const img = new Image()
  img.src = `/sprites/swords/${sword.id}.png`
  img.onload = () => {
    readyCount += 1
    if (readyCount === total) readyListeners.splice(0).forEach((cb) => cb())
  }
  images[sword.id] = img
}

export function onSwordSpritesReady(callback) {
  if (readyCount === total) callback()
  else readyListeners.push(callback)
}

export function drawSwordIcon(ctx, swordId, x, y, size) {
  const img = images[swordId]
  if (img && img.complete) {
    ctx.drawImage(img, 0, 0, 32, 32, Math.round(x), Math.round(y), size, size)
  }
}
