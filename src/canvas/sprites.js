import { palette } from './palette'
import { drawTile, drawTileBlock, TILE_INDEX } from './tileset'
import { drawTownTile, TOWN_TILE_INDEX } from './townTileset'
import { drawGrowthIcon, drawWiltedIcon } from './growthSprites'

// Virtual (internal) canvas resolution: a 20x14-tile window onto the world,
// scaled up with CSS to fill its container (image smoothing disabled), so
// every virtual pixel drawn here becomes a crisp, chunky block on screen.
export const TILE = 16
export const VIEWPORT_TILES_X = 20
export const VIEWPORT_TILES_Y = 14
export const VIEWPORT_WIDTH = TILE * VIEWPORT_TILES_X
export const VIEWPORT_HEIGHT = TILE * VIEWPORT_TILES_Y

// The full walkable world is bigger than the viewport — the camera scrolls
// to follow the player, so most of it is off-screen at any given moment.
export const WORLD_TILES_X = 34
export const WORLD_TILES_Y = 22
export const WORLD_WIDTH = TILE * WORLD_TILES_X
export const WORLD_HEIGHT = TILE * WORLD_TILES_Y

// Crisp pixel rect: rounds to whole virtual pixels so edges never
// anti-alias, regardless of how the canvas is scaled by CSS.
function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

// Deterministic pseudo-random 0..1 value per tile, so the ground texture
// looks organic (irregular blotches) instead of a rigid checker, but never
// changes between renders.
function hash(tx, ty) {
  const s = Math.sin(tx * 127.1 + ty * 311.7) * 43758.5453
  return s - Math.floor(s)
}

// Grass field built from the Tiny Town tileset, covering the full world:
// mostly plain grass, with occasional subtly-textured or flowering tiles
// scattered in (deterministic, not random, so it doesn't shimmer between
// renders). Only draws tiles within the camera's view (plus a 1-tile
// margin), since the world is bigger than what's ever on screen at once.
function drawGround(ctx, camera) {
  const startTx = Math.max(0, Math.floor(camera.x / TILE) - 1)
  const endTx = Math.min(WORLD_TILES_X, Math.ceil((camera.x + VIEWPORT_WIDTH) / TILE) + 1)
  const startTy = Math.max(0, Math.floor(camera.y / TILE) - 1)
  const endTy = Math.min(WORLD_TILES_Y, Math.ceil((camera.y + VIEWPORT_HEIGHT) / TILE) + 1)

  for (let ty = startTy; ty < endTy; ty++) {
    for (let tx = startTx; tx < endTx; tx++) {
      const n = hash(tx, ty)
      const index =
        n > 0.94
          ? TOWN_TILE_INDEX.GRASS_FLOWERS
          : n > 0.75
            ? TOWN_TILE_INDEX.GRASS_TEXTURED
            : TOWN_TILE_INDEX.GRASS
      drawTownTile(ctx, index, tx * TILE, ty * TILE)
    }
  }
}

// A horizontal wooden fence run: repeated posts joined by two rails.
// x,y = left end, at ground level; length in virtual px.
function drawFenceLine(ctx, x, y, length) {
  const postGap = 16
  px(ctx, x, y - 9, length, 2, palette.wood.dark)
  px(ctx, x, y - 4, length, 2, palette.wood.dark)
  for (let ox = 0; ox <= length; ox += postGap) {
    px(ctx, x + ox - 1, y - 12, 3, 12, palette.wood.outline)
    px(ctx, x + ox - 1, y - 12, 3, 3, palette.wood.light)
  }
}

// Farmhouse built from the Tiny Farm tileset: a 3x4-tile roof stacked on
// a 3x4-tile wall block (48x128 virtual px). x,y = top-left corner.
function drawFarmhouse(ctx, x, y) {
  drawTileBlock(ctx, TILE_INDEX.BARN_ROOF, x, y)
  drawTileBlock(ctx, TILE_INDEX.BARN_WALL, x, y + TILE * 4)
}

// Draws a single tile scaled up by `scale`, anchored at its bottom-center
// (x, y) — e.g. scale 1.75 on a tree makes it read as taller than one
// ground tile instead of being squeezed flat into exactly 16px.
function drawScaledTile(ctx, index, x, y, scale) {
  const size = TILE * scale
  drawTile(ctx, index, x - size / 2, y - size, size)
}

function drawTree(ctx, x, y, { small = false } = {}) {
  if (small) drawScaledTile(ctx, TILE_INDEX.TREE_SMALL, x, y, 1.3)
  else drawScaledTile(ctx, TILE_INDEX.TREE, x, y, 1.75)
}

function drawBush(ctx, x, y, { berry = false } = {}) {
  drawScaledTile(ctx, berry ? TILE_INDEX.BERRY_BUSH : TILE_INDEX.BUSH, x, y, 1.3)
}

function drawRock(ctx, x, y, { large = false } = {}) {
  drawScaledTile(ctx, large ? TILE_INDEX.ROCKS : TILE_INDEX.ROCKS_SMALL, x, y, large ? 1.3 : 1.15)
}

function drawAnimal(ctx, x, y, { kind = 'sheep' } = {}) {
  const index = { sheep: TILE_INDEX.SHEEP, cow: TILE_INDEX.COW, chicken: TILE_INDEX.CHICKEN }[kind]
  const scale = { sheep: 1.2, cow: 1.4, chicken: 1.1 }[kind]
  drawScaledTile(ctx, index, x, y, scale)
}

// A rocky outcrop with a dark cave mouth, standing in for the future mine.
function drawRockyOutcrop(ctx, x, y) {
  const w = 56
  const h = 48

  px(ctx, x, y, w, h, palette.stone.dark)
  px(ctx, x, y, w, 5, palette.stone.light)
  px(ctx, x, y, 5, h, palette.stone.mid)
  px(ctx, x + w - 5, y, 5, h, palette.stone.mid)
  px(ctx, x, y + h - 4, w, 4, palette.stone.outline)

  // Cave mouth
  const mouthW = w - 24
  const mouthH = h - 16
  px(ctx, x + (w - mouthW) / 2, y + h - mouthH - 6, mouthW, mouthH, palette.mine.dark)
  px(ctx, x + (w - mouthW) / 2 + 3, y + h - mouthH - 3, mouthW - 6, mouthH - 6, palette.mine.mid)
}

// A subject's plot: a fenced-in growing bed with a 3x3 grid of crop icons
// (all sharing the same growth stage), instead of a single big sprite —
// reads as a small planted field rather than one giant flower.
const PLOT_GRID = 3
const PLOT_BORDER = 4
const PLOT_ICON_GAP = 3

function drawPlot(ctx, x, y, size, { stage = 0, isWilting = false } = {}) {
  const icon = (size - PLOT_BORDER * 2 - PLOT_ICON_GAP * (PLOT_GRID - 1)) / PLOT_GRID

  px(ctx, x, y, size, size, palette.wood.outline)
  px(ctx, x + 2, y + 2, size - 4, size - 4, palette.wood.dark)

  // Corner posts, for a "fenced pen" feel.
  px(ctx, x, y, 3, 3, palette.wood.light)
  px(ctx, x + size - 3, y, 3, 3, palette.wood.light)
  px(ctx, x, y + size - 3, 3, 3, palette.wood.light)
  px(ctx, x + size - 3, y + size - 3, 3, 3, palette.wood.light)

  for (let row = 0; row < PLOT_GRID; row++) {
    for (let col = 0; col < PLOT_GRID; col++) {
      const ix = x + PLOT_BORDER + col * (icon + PLOT_ICON_GAP)
      const iy = y + PLOT_BORDER + row * (icon + PLOT_ICON_GAP)
      drawGrowthIcon(ctx, stage, ix, iy, icon)
    }
  }

  if (isWilting) {
    const badge = size * 0.32
    drawWiltedIcon(ctx, x + size - badge, y - badge * 0.4, badge)
  }
}

// Top-down character from the Tiny Farm tileset. x,y = feet position.
// The pack only has one static pose (facing the camera), so left/right
// movement mirrors it horizontally; up/down movement keeps it as-is since
// there's no back-facing pose to swap to.
// No walk-cycle sprite sheet exists for this character (the Tiny Farm pack
// only has one static pose), so movement is conveyed procedurally: a quick
// bounce while walking, and a slow gentle sway while idle. The shadow stays
// fixed on the ground so the bounce reads as a hop, not the whole sprite
// floating.
function drawPlayer(ctx, x, y, { facing = 'right', walking = false, walkClock = 0, idleClock = 0 } = {}) {
  const bob = walking ? Math.abs(Math.sin(walkClock * 9)) * 2 : Math.sin(idleClock * 2) * 1

  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath()
  ctx.ellipse(Math.round(x), Math.round(y) - 1, 5, 2, 0, 0, Math.PI * 2)
  ctx.fill()

  const drawY = y - bob

  if (facing === 'left') {
    ctx.save()
    ctx.translate(Math.round(x), 0)
    ctx.scale(-1, 1)
    drawTile(ctx, TILE_INDEX.CHARACTER, -TILE / 2, drawY - TILE)
    ctx.restore()
  } else {
    drawTile(ctx, TILE_INDEX.CHARACTER, x - TILE / 2, drawY - TILE)
  }
}

// Small bouncing "press E" prompt shown above an interactable when the
// player is close enough. bob varies the y offset for a gentle float.
function drawInteractPrompt(ctx, x, y, bob) {
  const w = 10
  const h = 9
  const px0 = Math.round(x - w / 2)
  const py0 = Math.round(y - h + bob)

  px(ctx, px0, py0, w, h, palette.ui.promptBg)
  px(ctx, px0 + 1, py0 + 1, w - 2, h - 2, palette.ui.prompt)

  ctx.fillStyle = palette.ui.promptBg
  ctx.font = 'bold 7px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('E', px0 + w / 2, py0 + h / 2 + 1)
}

// Central dispatcher. `frame` is accepted now (unused) so animated
// multi-frame sprites can be dropped in later without changing call sites.
export function drawSprite(ctx, name, x, y, _frame = 0, opts = {}) {
  switch (name) {
    case 'ground':
      return drawGround(ctx, opts.camera)
    case 'farmhouse':
      return drawFarmhouse(ctx, x, y)
    case 'plot':
      return drawPlot(ctx, x, y, opts.size ?? TILE * 2, opts)
    case 'rockyOutcrop':
      return drawRockyOutcrop(ctx, x, y)
    case 'bush':
      return drawBush(ctx, x, y, opts)
    case 'rock':
      return drawRock(ctx, x, y, opts)
    case 'tree':
      return drawTree(ctx, x, y, opts)
    case 'animal':
      return drawAnimal(ctx, x, y, opts)
    case 'fenceLine':
      return drawFenceLine(ctx, x, y, opts.length ?? TILE * 4)
    case 'player':
      return drawPlayer(ctx, x, y, opts)
    case 'interactPrompt':
      return drawInteractPrompt(ctx, x, y, opts.bob ?? 0)
    default:
      return undefined
  }
}
