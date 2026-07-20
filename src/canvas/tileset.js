import { createTileSheet } from './tileSheet'

// Kenney "Tiny Farm" (CC0 1.0) — public/tiles/tiny-farm.png, credited in
// README. A packed 12x11 grid of 16x16 tiles; index = row * 12 + col.
const sheet = createTileSheet('/tiles/tiny-farm.png', 12)

export const onTilesetReady = sheet.onReady
export const drawTile = sheet.drawTile
export const drawTileBlock = sheet.drawTileBlock

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
