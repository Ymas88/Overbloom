import { createTileSheet } from './tileSheet'

// Kenney "Tiny Dungeon" (CC0 1.0) — public/tiles/tiny-dungeon.png, credited
// in README. Same 12x11 packed grid as Tiny Farm/Tiny Town. Used here for
// the NPC characters this pack doesn't have (Tiny Farm only has one person,
// in a hat/no-hat variant).
const sheet = createTileSheet('/tiles/tiny-dungeon.png', 12)

export const onDungeonTilesetReady = sheet.onReady
export const drawDungeonTile = sheet.drawTile

export const DUNGEON_TILE_INDEX = {
  SHOPKEEPER: 85,
  CAVE_FLOOR: 0,
  CAVE_FLOOR_RUBBLE: 1,
  CAVE_FLOOR_RUBBLE_2: 2,
  CAVE_WALL: 40,
  PORTAL_ARCH: 10,
  BARRIER_GATE: 70,
}
