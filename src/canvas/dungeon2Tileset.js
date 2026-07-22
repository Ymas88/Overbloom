import { createTileSheet } from './tileSheet'

// 0x72 "DungeonTileset II" (CC0) — public/tiles/dungeon2-floor.png, the
// pack's floor atlas. Used for the cave zone: a denser, more detailed
// stone floor and a few decorative props than Tiny Dungeon's plain floor
// tile alone could give.
const sheet = createTileSheet('/tiles/dungeon2-floor.png', 7)

export const onDungeon2TilesetReady = sheet.onReady
export const drawDungeon2Tile = sheet.drawTile

export const DUNGEON2_TILE_INDEX = {
  FLOOR: 0,
  FLOOR_CRACK_1: 1,
  FLOOR_CRACK_2: 2,
  FLOOR_CRACK_3: 7,
  CRYSTAL_SMALL: 23,
  CRYSTAL_LARGE: 24,
  SKULL: 36,
}
