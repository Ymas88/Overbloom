// Generic loader for a packed Kenney-style tile sheet: 16x16 tiles laid
// out in a grid, index = row * cols + col. Each pack gets its own sheet
// instance since they load as separate images with independent readiness.
const TILE = 16

export function createTileSheet(src, cols) {
  const image = new Image()
  image.src = src
  let ready = image.complete
  const readyListeners = []

  image.onload = () => {
    ready = true
    readyListeners.splice(0).forEach((cb) => cb())
  }

  function onReady(callback) {
    if (ready) callback()
    else readyListeners.push(callback)
  }

  function drawTile(ctx, index, dx, dy) {
    if (!ready) return
    const col = index % cols
    const row = Math.floor(index / cols)
    ctx.drawImage(image, col * TILE, row * TILE, TILE, TILE, Math.round(dx), Math.round(dy), TILE, TILE)
  }

  function drawTileBlock(ctx, grid, dx, dy) {
    grid.forEach((row, r) => {
      row.forEach((index, c) => {
        drawTile(ctx, index, dx + c * TILE, dy + r * TILE)
      })
    })
  }

  return { onReady, drawTile, drawTileBlock }
}
