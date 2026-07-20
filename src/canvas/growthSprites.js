// Per-plot crop art, keyed by growth stage (0 = bare soil, 4 = ready to
// harvest) plus a wilting badge. From Kenney "Tiny Farm" (CC0), credited
// in README.
const SOURCES = {
  0: '/sprites/plots/soil.png',
  1: '/sprites/plots/stage1-sprout.png',
  2: '/sprites/plots/stage2-growing.png',
  3: '/sprites/plots/stage3-mature.png',
  4: '/sprites/plots/stage4-harvest.png',
  wilted: '/sprites/plots/wilted.png',
}

const images = {}
const readyListeners = []
let readyCount = 0
const total = Object.keys(SOURCES).length

for (const [key, src] of Object.entries(SOURCES)) {
  const img = new Image()
  img.src = src
  img.onload = () => {
    readyCount += 1
    if (readyCount === total) readyListeners.splice(0).forEach((cb) => cb())
  }
  images[key] = img
}

// Calls back once every growth sprite has finished loading (immediately if
// they already have), so callers can trigger a redraw when ready.
export function onGrowthSpritesReady(callback) {
  if (readyCount === total) callback()
  else readyListeners.push(callback)
}

export function drawPlot(ctx, x, y, size, { stage = 0, isWilting = false } = {}) {
  const base = images[stage] ?? images[0]
  if (base.complete) {
    ctx.drawImage(base, 0, 0, 16, 16, Math.round(x), Math.round(y), size, size)
  }

  if (isWilting && images.wilted.complete) {
    const badgeSize = size * 0.5
    ctx.drawImage(
      images.wilted,
      0,
      0,
      16,
      16,
      Math.round(x + size - badgeSize),
      Math.round(y),
      badgeSize,
      badgeSize
    )
  }
}
