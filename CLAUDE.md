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
V1 stores everything in `localStorage` — no accounts, no backend. Project is in early setup; features have not been built yet.

## Folder structure
- `src/components/` — reusable UI pieces
- `src/game/` — game logic only (crop growth, wilting rules) — no UI, no storage code
- `src/storage/` — localStorage read/write helpers, kept isolated so they're swappable later
- `public/` — static files copied as-is into the built site

## Deployment
Hosted on Vercel, auto-deploys from the `main` branch on GitHub (`github.com/Ymas88/Overbloom`) on every push.
