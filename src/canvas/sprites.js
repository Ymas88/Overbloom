import { palette } from './palette'
import { drawTile, drawTileBlock, TILE_INDEX } from './tileset'
import { drawPlot } from './growthSprites'

// Virtual (internal) canvas resolution: a top-down field, 20x14 tiles.
// The <canvas> element is scaled up with CSS to fill its container, with
// image smoothing disabled, so every virtual pixel drawn here becomes a
// crisp, chunky block on screen.
export const TILE = 16
export const TILES_X = 20
export const TILES_Y = 14
export const SCENE_WIDTH = TILE * TILES_X
export const SCENE_HEIGHT = TILE * TILES_Y

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

// Grass field with mottled light/mid/dark patches plus scattered tufts and
// tiny flowers, so the ground reads as textured rather than a flat fill.
function drawGround(ctx) {
  for (let ty = 0; ty < TILES_Y; ty++) {
    for (let tx = 0; tx < TILES_X; tx++) {
      const n = hash(tx, ty)
      const shade = n < 0.3 ? palette.grass.dark : n < 0.72 ? palette.grass.mid : palette.grass.light
      px(ctx, tx * TILE, ty * TILE, TILE, TILE, shade)
    }
  }

  for (let ty = 0; ty < TILES_Y; ty++) {
    for (let tx = 0; tx < TILES_X; tx++) {
      const n = hash(tx * 3.7 + 1, ty * 5.3 + 2)
      const px0 = tx * TILE + 4 + Math.floor(n * 8)
      const py0 = ty * TILE + 4 + Math.floor(hash(tx, ty * 1.9) * 8)
      if (n > 0.9) {
        px(ctx, px0, py0, 2, 2, palette.grass.outline)
      } else if (n < 0.04) {
        px(ctx, px0, py0, 2, 2, palette.flower.petal)
        px(ctx, px0, py0, 1, 1, palette.flower.center)
      }
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

function drawTree(ctx, x, y, { small = false } = {}) {
  drawTile(ctx, small ? TILE_INDEX.TREE_SMALL : TILE_INDEX.TREE, x - TILE / 2, y - TILE)
}

function drawBush(ctx, x, y, { berry = false } = {}) {
  drawTile(ctx, berry ? TILE_INDEX.BERRY_BUSH : TILE_INDEX.BUSH, x - TILE / 2, y - TILE)
}

function drawRock(ctx, x, y, { large = false } = {}) {
  drawTile(ctx, large ? TILE_INDEX.ROCKS : TILE_INDEX.ROCKS_SMALL, x - TILE / 2, y - TILE)
}

function drawAnimal(ctx, x, y, { kind = 'sheep' } = {}) {
  const index = { sheep: TILE_INDEX.SHEEP, cow: TILE_INDEX.COW, chicken: TILE_INDEX.CHICKEN }[kind]
  drawTile(ctx, index, x - TILE / 2, y - TILE)
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

// Top-down character from the Tiny Farm tileset. x,y = feet position.
// The pack only has one static pose, so `facing` is accepted but unused
// until a full character sprite sheet is wired up for real movement.
function drawPlayer(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath()
  ctx.ellipse(Math.round(x), Math.round(y) - 1, 5, 2, 0, 0, Math.PI * 2)
  ctx.fill()

  drawTile(ctx, TILE_INDEX.CHARACTER, x - TILE / 2, y - TILE)
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
      return drawGround(ctx)
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
      return drawPlayer(ctx, x, y)
    case 'interactPrompt':
      return drawInteractPrompt(ctx, x, y, opts.bob ?? 0)
    default:
      return undefined
  }
}
