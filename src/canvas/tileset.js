// Kenney "Tiny Farm" (CC0 1.0) — public/tiles/tiny-farm.png, credited in
// README. A packed 12x11 grid of 16x16 tiles; index = row * 12 + col.
const COLS = 12
const TILE = 16

const image = new Image()
image.src = '/tiles/tiny-farm.png'
let ready = image.complete
const readyListeners = []

image.onload = () => {
  ready = true
  readyListeners.splice(0).forEach((cb) => cb())
}

// Calls back once the tileset image has finished loading (immediately if
// it already has), so callers can trigger a redraw when it becomes ready.
export function onTilesetReady(callback) {
  if (ready) callback()
  else readyListeners.push(callback)
}

export function isTilesetReady() {
  return ready
}

// Draws one 16x16 source tile at (dx, dy) in the destination canvas.
export function drawTile(ctx, index, dx, dy) {
  if (!ready) return
  const col = index % COLS
  const row = Math.floor(index / COLS)
  ctx.drawImage(image, col * TILE, row * TILE, TILE, TILE, Math.round(dx), Math.round(dy), TILE, TILE)
}

// Draws a rectangular block of tiles (grid = 2D array of indices) with its
// top-left corner at (dx, dy).
export function drawTileBlock(ctx, grid, dx, dy) {
  grid.forEach((row, r) => {
    row.forEach((index, c) => {
      drawTile(ctx, index, dx + c * TILE, dy + r * TILE)
    })
  })
}

export const TILE_INDEX = {
  BARN_ROOF: [
    [93, 94, 95],
    [105, 106, 107],
    [117, 118, 119],
    [129, 130, 131],
  ],
  BARN_WALL: [
    [90, 91, 92],
    [102, 103, 104],
    [114, 115, 116],
    [126, 127, 128],
  ],
  TREE_SMALL: 3,
  TREE: 15,
  BUSH: 39,
  BERRY_BUSH: 78,
  ROCKS_SMALL: 77,
  ROCKS: 89,
  SHEEP: 120,
  COW: 121,
  CHICKEN: 122,
  SUNFLOWER: 83,
  CHARACTER: 109,
}
