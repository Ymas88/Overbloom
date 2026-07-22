// Sword art from "Hedgy's Swordtember 2020" by TheWiseHedgehog (CC-BY 4.0)
// — see public/sprites/swords/Swordtember-LICENSE.txt. 30 swords total:
// the plainer-looking ones are sold directly at the Trading Post, the
// flashier ones only come from a Swordbox.
export const SWORD_RARITIES = {
  common: { label: 'Common', weight: 50 },
  uncommon: { label: 'Uncommon', weight: 30 },
  rare: { label: 'Rare', weight: 13 },
  epic: { label: 'Epic', weight: 5 },
  legendary: { label: 'Legendary', weight: 2 },
}

export const SHOP_SWORDS = [
  { id: 'iron-longsword', name: 'Iron Longsword', price: 35 },
  { id: 'knights-longsword', name: "Knight's Longsword", price: 40 },
  { id: 'bramblethorn-sword', name: 'Bramblethorn Sword', price: 45 },
  { id: 'ironforge-sword', name: 'Ironforge Sword', price: 55 },
  { id: 'duelists-rapier', name: "Duelist's Rapier", price: 60 },
  { id: 'desert-scimitar', name: 'Desert Scimitar', price: 65 },
  { id: 'serpents-edge', name: "Serpent's Edge", price: 70 },
  { id: 'crescent-scimitar', name: 'Crescent Scimitar', price: 75 },
  { id: 'ruby-hilt-sword', name: 'Ruby Hilt Sword', price: 85 },
  { id: 'bloodstone-sword', name: 'Bloodstone Sword', price: 90 },
  { id: 'emerald-hilt-blade', name: 'Emerald Hilt Blade', price: 100 },
  { id: 'twin-strike-blade', name: 'Twin Strike Blade', price: 110 },
]

export const LOOTBOX_SWORDS = [
  { id: 'vinewrath-blade', name: 'Vinewrath Blade', rarity: 'common' },
  { id: 'amethyst-fang', name: 'Amethyst Fang', rarity: 'common' },
  { id: 'royal-saber', name: 'Royal Saber', rarity: 'common' },
  { id: 'feather-edge', name: 'Feather Edge', rarity: 'common' },
  { id: 'shadow-wisp-blade', name: 'Shadow Wisp Blade', rarity: 'common' },
  { id: 'seraph-wing-blade', name: 'Seraph Wing Blade', rarity: 'common' },
  { id: 'sunfire-blade', name: 'Sunfire Blade', rarity: 'uncommon' },
  { id: 'nightfall-cutlass', name: 'Nightfall Cutlass', rarity: 'uncommon' },
  { id: 'crystal-shard-blade', name: 'Crystal Shard Blade', rarity: 'uncommon' },
  { id: 'comet-blade', name: 'Comet Blade', rarity: 'uncommon' },
  { id: 'ancient-blade', name: 'Ancient Blade', rarity: 'uncommon' },
  { id: 'flameheart-blade', name: 'Flameheart Blade', rarity: 'rare' },
  { id: 'glacier-fang', name: 'Glacier Fang', rarity: 'rare' },
  { id: 'venomfang-blade', name: 'Venomfang Blade', rarity: 'rare' },
  { id: 'frost-rapier', name: 'Frost Rapier', rarity: 'rare' },
  { id: 'dragon-slayer', name: 'Dragon Slayer', rarity: 'epic' },
  { id: 'midnight-sovereign', name: 'Midnight Sovereign', rarity: 'epic' },
  { id: 'starlight-prism-blade', name: 'Starlight Prism Blade', rarity: 'legendary' },
]

export const SWORDS = [...SHOP_SWORDS, ...LOOTBOX_SWORDS]

export function getSword(swordId) {
  return SWORDS.find((s) => s.id === swordId) ?? null
}

// A sword's individual draw chance is its rarity tier's weight split evenly
// across however many lootbox swords share that tier.
export function getSwordDropChance(sword) {
  const tierWeight = SWORD_RARITIES[sword.rarity].weight
  const tierSize = LOOTBOX_SWORDS.filter((s) => s.rarity === sword.rarity).length
  return tierWeight / tierSize
}

export function drawRandomSword() {
  const roll = Math.random() * 100
  let cumulative = 0
  for (const sword of LOOTBOX_SWORDS) {
    cumulative += getSwordDropChance(sword)
    if (roll < cumulative) return sword
  }
  return LOOTBOX_SWORDS[LOOTBOX_SWORDS.length - 1]
}
