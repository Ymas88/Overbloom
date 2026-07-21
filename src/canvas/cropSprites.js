import { CROPS } from '../game/crops'

// One real icon per crop (no growth-stage frames in this pack), shown once
// a plot reaches full growth and a specific crop has been assigned to it.
const images = {}
const readyListeners = []
let readyCount = 0
const total = CROPS.length

for (const crop of CROPS) {
  const img = new Image()
  img.src = `/sprites/crops/${crop.id}.png`
  img.onload = () => {
    readyCount += 1
    if (readyCount === total) readyListeners.splice(0).forEach((cb) => cb())
  }
  images[crop.id] = img
}

export function onCropSpritesReady(callback) {
  if (readyCount === total) callback()
  else readyListeners.push(callback)
}

export function drawCropIcon(ctx, cropId, x, y, size) {
  const img = images[cropId]
  if (img && img.complete) {
    ctx.drawImage(img, 0, 0, 16, 16, Math.round(x), Math.round(y), size, size)
  }
}
