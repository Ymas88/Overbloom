// Crop icons from "Pixel Crop Icons" by ElectrikJelli (CC0-equivalent,
// "free for use in commercial projects, no credit needed") — see
// public/sprites/crops/CropIcons-LICENSE.txt.
// weight = drop odds (out of 100) for the tier as a whole; reward = coins
// paid out for harvesting a fully-grown plot of that rarity.
export const RARITIES = {
  common: { label: 'Common', weight: 50, reward: 10 },
  uncommon: { label: 'Uncommon', weight: 30, reward: 20 },
  rare: { label: 'Rare', weight: 13, reward: 35 },
  epic: { label: 'Epic', weight: 5, reward: 50 },
  legendary: { label: 'Legendary', weight: 2, reward: 70 },
}

// What grows when a plot has no seed assigned — not obtainable from a
// seedbox, just the common default every plot starts as.
export const DEFAULT_CROP = { id: null, name: 'Wild Sprout', rarity: 'common' }

export const CROPS = [
  { id: 'potato', name: 'Potato', rarity: 'common' },
  { id: 'carrot', name: 'Carrot', rarity: 'common' },
  { id: 'cabbage', name: 'Cabbage', rarity: 'common' },
  { id: 'turnip', name: 'Turnip', rarity: 'common' },
  { id: 'redonion', name: 'Red Onion', rarity: 'common' },
  { id: 'corn', name: 'Corn', rarity: 'uncommon' },
  { id: 'tomato', name: 'Tomato', rarity: 'uncommon' },
  { id: 'cucumber', name: 'Cucumber', rarity: 'uncommon' },
  { id: 'broccoli', name: 'Broccoli', rarity: 'uncommon' },
  { id: 'eggplant', name: 'Eggplant', rarity: 'rare' },
  { id: 'pepper', name: 'Bell Pepper', rarity: 'rare' },
  { id: 'beet', name: 'Beet', rarity: 'rare' },
  { id: 'grapes', name: 'Grapes', rarity: 'epic' },
  { id: 'pumpkin', name: 'Pumpkin', rarity: 'epic' },
  { id: 'sunflower', name: 'Golden Sunflower', rarity: 'legendary' },
]

// A crop's individual draw chance is its rarity tier's weight split evenly
// across however many crops share that tier (e.g. 50% common / 5 crops =
// 10% each).
export function getDropChance(crop) {
  const tierWeight = RARITIES[crop.rarity].weight
  const tierSize = CROPS.filter((c) => c.rarity === crop.rarity).length
  return tierWeight / tierSize
}

export function getCrop(cropId) {
  return CROPS.find((c) => c.id === cropId) ?? null
}

// Like getCrop, but falls back to the default "Wild Sprout" plant instead
// of null when no seed (or an unrecognized one) is assigned.
export function getCropOrDefault(cropId) {
  return getCrop(cropId) ?? DEFAULT_CROP
}

// Weighted random draw across all crops, using each crop's individual
// drop chance (which already accounts for its rarity tier).
export function drawRandomCrop() {
  const roll = Math.random() * 100
  let cumulative = 0
  for (const crop of CROPS) {
    cumulative += getDropChance(crop)
    if (roll < cumulative) return crop
  }
  return CROPS[CROPS.length - 1]
}
