import { createTileSheet } from './tileSheet'

// Kenney "Tiny Town" (CC0 1.0) — public/tiles/tiny-town.png, credited in
// README. Same 12x11 packed grid as Tiny Farm; used here for ground tiles
// that need to tile seamlessly (Tiny Farm has no plain grass of its own).
const sheet = createTileSheet('/tiles/tiny-town.png', 12)

export const onTownTilesetReady = sheet.onReady
export const drawTownTile = sheet.drawTile

export const TOWN_TILE_INDEX = {
  GRASS: 0,
  GRASS_TEXTURED: 1,
  GRASS_FLOWERS: 2,
  WALL_STONE: 48,
  WALL_STONE_BASE: 60,
  DOOR_STONE: 89,
}
