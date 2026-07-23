# overbloom

## About the developer
Kieran is 16 and does not know how to code. Claude implements everything; Kieran directs and reviews. When something involves a concept Kieran might not know, give a two-sentence plain-English explanation before or alongside the change.

## How to work in this repo
- Work on one small thing at a time. Wait for Kieran to confirm it works before moving on to the next thing.
- After every working, confirmed change, make a Git commit with a clear message.
- Never rewrite large parts of the app without explaining why first.
- No unrequested design/styling work — keep things functionally minimal unless asked.

## Project vision
overbloom (working title) is a gamified study timer that grows a pixel-art farm (Stardew Valley style) from logged focus time. Each study subject is its own plot; crops grow from logged minutes and wilt with neglect. A future companion Chrome extension will block distracting sites during study sessions.

## Current status
V1 stores everything in `localStorage` — no accounts, no backend. The farm is a top-down, walkable pixel-art scene (Kenney CC0 "Tiny Farm"/"Tiny Town" tile packs) bigger than the screen, with a scrolling camera that follows the player and collision against the farmhouse/rocky outcrop. Walk up to the farmhouse and press E to add/manage subjects; walk up to a subject's plot and press E to run its study timer. Each plot renders as a bordered pen of 25 crop icons (5x5) whose growth stage reflects real logged study time, and wilts after 3 days without a session. Plots are laid out in a grid that only grows sideways once it's tall enough to reach the cave's edge, so they always stay inside Overbloom Farm. The Crystal Hollows portal is barred by a locked gate (Tiny Dungeon tileset) until the player has logged 10 total study minutes (`src/game/unlocks.js`); walking up to the sealed gate and pressing E shows progress toward that threshold. A fence runs the rest of the farm/cave boundary with a gap only at the portal, so the portal is the only possible crossing point.

## Folder structure
- `src/components/` — reusable UI pieces (panels, forms, the canvas host)
- `src/canvas/` — canvas rendering only: tile-sheet loading, scene layout/composition, sprite drawing. No game logic, no storage code.
- `src/game/` — game logic only (crop growth, wilting rules) — no UI, no storage code
- `src/storage/` — localStorage read/write helpers, kept isolated so they're swappable later
- `public/` — static files copied as-is into the built site (includes `tiles/` and `sprites/` art, each with a `*-LICENSE.txt` next to it)

## Deployment
Hosted on Vercel, auto-deploys from the `main` branch on GitHub (`github.com/Ymas88/Overbloom`) on every push.
