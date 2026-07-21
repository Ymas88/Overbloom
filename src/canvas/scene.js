import { drawSprite, TILE, WORLD_WIDTH, WORLD_HEIGHT } from './sprites'
import { getGrowthStage } from '../game/growth'

// The original farm layout was designed for a 20x14-tile viewport. The
// world is now bigger than that (the camera scrolls), but the farmhouse,
// plots, and rock stay anchored to this original "core" area — the extra
// space is new field to the right and below it.
const CORE_WIDTH = TILE * 20
const CORE_HEIGHT = TILE * 14

const FARMHOUSE_X = TILE * 1
const FARMHOUSE_Y = TILE * 1
const FARMHOUSE_W = TILE * 3
const FARMHOUSE_H = TILE * 8
const FARMHOUSE_CENTER = { x: FARMHOUSE_X + FARMHOUSE_W / 2, y: FARMHOUSE_Y + FARMHOUSE_H - 10 }

const ROCK_X = CORE_WIDTH - TILE * 4.5
const ROCK_Y = TILE * 1
const ROCK_W = 56
const ROCK_H = 48
const ROCK_CENTER = { x: ROCK_X + 28, y: ROCK_Y + 24 }

const PLOT_SIZE = 56
const PLOT_GAP = 10
const PLOTS_ORIGIN_X = TILE * 6
const PLOTS_ORIGIN_Y = TILE * 3
const PLOTS_PER_ROW = 3

const INTERACT_RANGE = 26

// Pure geometry (not game logic): where each scene element sits, in the
// top-down field. Shared by the renderer and by the movement/interaction
// logic that needs to know what the player is standing near.
export function computeLayout(plotCount) {
  const plots = []
  for (let i = 0; i < plotCount; i++) {
    const col = i % PLOTS_PER_ROW
    const row = Math.floor(i / PLOTS_PER_ROW)
    const x = PLOTS_ORIGIN_X + col * (PLOT_SIZE + PLOT_GAP)
    const y = PLOTS_ORIGIN_Y + row * (PLOT_SIZE + PLOT_GAP)
    plots.push({ x, y, size: PLOT_SIZE })
  }

  const rowWidth = Math.min(plotCount, PLOTS_PER_ROW) * (PLOT_SIZE + PLOT_GAP) - PLOT_GAP
  const fence = plotCount > 0 ? { x: PLOTS_ORIGIN_X - 6, y: PLOTS_ORIGIN_Y - 4, length: rowWidth + 12 } : null

  // Full building footprints (not just the walkable wall portion) so the
  // player sprite — always drawn last, on top — never overlaps the roof art.
  const solids = [
    { x: FARMHOUSE_X, y: FARMHOUSE_Y, width: FARMHOUSE_W, height: FARMHOUSE_H },
    { x: ROCK_X, y: ROCK_Y, width: ROCK_W, height: ROCK_H },
  ]

  return {
    farmhouse: { x: FARMHOUSE_X, y: FARMHOUSE_Y, width: FARMHOUSE_W, height: FARMHOUSE_H, center: FARMHOUSE_CENTER },
    rock: { x: ROCK_X, y: ROCK_Y, width: ROCK_W, height: ROCK_H, center: ROCK_CENTER },
    plots,
    fence,
    solids,
    bushes: [
      { x: FARMHOUSE_X - 4, y: FARMHOUSE_Y + FARMHOUSE_H - 6 },
      { x: FARMHOUSE_X + FARMHOUSE_W + 4, y: FARMHOUSE_Y + FARMHOUSE_H - 6, berry: true },
      { x: CORE_WIDTH + TILE * 7, y: TILE * 6 },
      { x: CORE_WIDTH + TILE * 12, y: TILE * 10, berry: true },
      { x: WORLD_WIDTH - TILE * 4, y: CORE_HEIGHT + TILE * 5 },
    ],
    rocks: [
      { x: ROCK_X - 10, y: ROCK_Y + 54 },
      { x: CORE_WIDTH - TILE * 2, y: TILE * 10 },
      { x: CORE_WIDTH + TILE * 5, y: TILE * 16 },
      { x: WORLD_WIDTH - TILE * 6, y: CORE_HEIGHT + TILE * 2 },
    ],
    trees: [
      { x: TILE * 3, y: TILE * 0.8, small: true },
      { x: TILE * 4.5, y: TILE * 1.2 },
      { x: CORE_WIDTH - TILE * 1, y: TILE * 5 },
      { x: CORE_WIDTH - TILE * 1, y: TILE * 12 },
      { x: TILE * 1, y: CORE_HEIGHT - TILE * 1, small: true },
      { x: TILE * 18, y: CORE_HEIGHT - TILE * 1.5 },
      // Extended field beyond the original viewport-sized core area.
      { x: WORLD_WIDTH - TILE * 1, y: TILE * 2 },
      { x: WORLD_WIDTH - TILE * 1, y: TILE * 8 },
      { x: WORLD_WIDTH - TILE * 1, y: TILE * 14 },
      { x: WORLD_WIDTH - TILE * 1, y: TILE * 20, small: true },
      { x: CORE_WIDTH + TILE * 3, y: WORLD_HEIGHT - TILE * 1 },
      { x: CORE_WIDTH + TILE * 9, y: WORLD_HEIGHT - TILE * 1, small: true },
      { x: CORE_WIDTH + TILE * 15, y: WORLD_HEIGHT - TILE * 1 },
      { x: TILE * 4, y: WORLD_HEIGHT - TILE * 1 },
      { x: TILE * 10, y: WORLD_HEIGHT - TILE * 1, small: true },
    ],
    animals: [
      { x: FARMHOUSE_X + FARMHOUSE_W + 20, y: FARMHOUSE_Y + FARMHOUSE_H + 12, kind: 'sheep' },
      { x: CORE_WIDTH + TILE * 4, y: CORE_HEIGHT - TILE * 3, kind: 'cow' },
    ],
  }
}

// Interactable points the player can walk up to: the farmhouse (manage
// subjects) and one per subject's plot (study that subject).
export function getInteractionTargets(layout, subjects) {
  const targets = [{ type: 'farmhouse', ...layout.farmhouse.center }]

  layout.plots.forEach((plot, i) => {
    const subject = subjects[i]
    if (!subject) return
    targets.push({
      type: 'plot',
      subjectId: subject.id,
      x: plot.x + plot.size / 2,
      y: plot.y + plot.size / 2,
    })
  })

  return targets
}

export function findNearbyTarget(targets, playerX, playerY) {
  return (
    targets.find((t) => Math.hypot(t.x - playerX, t.y - playerY) < INTERACT_RANGE) ?? null
  )
}

export function drawScene(ctx, { subjects, sessions, camera }) {
  const layout = computeLayout(subjects.length)

  drawSprite(ctx, 'ground', 0, 0, 0, { camera })

  if (layout.fence) {
    drawSprite(ctx, 'fenceLine', layout.fence.x, layout.fence.y, 0, { length: layout.fence.length })
  }

  layout.plots.forEach((plot, i) => {
    const subject = subjects[i]
    const subjectSessions = sessions.filter((s) => s.subjectId === subject.id)
    const { stage, isWilting } = getGrowthStage(subjectSessions)
    drawSprite(ctx, 'plot', plot.x, plot.y, 0, { size: plot.size, stage, isWilting })
  })

  for (const rock of layout.rocks) {
    drawSprite(ctx, 'rock', rock.x, rock.y)
  }

  drawSprite(ctx, 'rockyOutcrop', layout.rock.x, layout.rock.y)

  for (const animal of layout.animals) {
    drawSprite(ctx, 'animal', animal.x, animal.y, 0, { kind: animal.kind })
  }

  drawSprite(ctx, 'farmhouse', layout.farmhouse.x, layout.farmhouse.y)

  for (const bush of layout.bushes) {
    drawSprite(ctx, 'bush', bush.x, bush.y, 0, { berry: bush.berry })
  }

  for (const tree of layout.trees) {
    drawSprite(ctx, 'tree', tree.x, tree.y, 0, { small: tree.small })
  }

  return layout
}
