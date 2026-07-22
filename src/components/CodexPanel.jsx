import { CROPS, RARITIES } from '../game/crops'
import { SHOP_SWORDS, LOOTBOX_SWORDS, SWORD_RARITIES, SPEED_MULTIPLIER_BY_RARITY } from '../game/swords'

// Full reference of every item in the game, regardless of what you
// actually own — press C anywhere to check rarities/rewards without
// having to walk to the shop.
function speedBonusLabel(rarity) {
  const percent = Math.round((SPEED_MULTIPLIER_BY_RARITY[rarity] - 1) * 100)
  return `Speed +${percent}%`
}

function CodexPanel({ onClose }) {
  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Codex</h2>
      <p>Every seed and sword in the game, whether you own it yet or not.</p>

      <h3>Seeds</h3>
      <ul>
        {CROPS.map((crop) => (
          <li key={crop.id}>
            <span className="seed-name">
              <img src={`/sprites/crops/${crop.id}.png`} alt="" className="crop-icon" />
              {crop.name}
            </span>
            <span>
              {RARITIES[crop.rarity].label} — Harvest: {RARITIES[crop.rarity].reward} coins
            </span>
          </li>
        ))}
      </ul>

      <h3>Swords — Trading Post</h3>
      <ul>
        {SHOP_SWORDS.map((sword) => (
          <li key={sword.id}>
            <span className="seed-name">
              <img src={`/sprites/swords/${sword.id}.png`} alt="" className="crop-icon" />
              {sword.name}
            </span>
            <span>
              {sword.price} coins — {speedBonusLabel('common')}
            </span>
          </li>
        ))}
      </ul>

      <h3>Swords — Swordbox</h3>
      <ul>
        {LOOTBOX_SWORDS.map((sword) => (
          <li key={sword.id}>
            <span className="seed-name">
              <img src={`/sprites/swords/${sword.id}.png`} alt="" className="crop-icon" />
              {sword.name}
            </span>
            <span>
              {SWORD_RARITIES[sword.rarity].label} — {speedBonusLabel(sword.rarity)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CodexPanel
