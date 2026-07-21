import { CROPS, RARITIES, getDropChance } from '../game/crops'
import { LOOT_BOX_PRICE } from '../game/shop'

function ShopPanel({ currency, onBuyLootBox, onClose }) {
  const canAfford = currency >= LOOT_BOX_PRICE

  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Trading Post</h2>
      <p className="currency-display">{currency} coins</p>

      <div className="seedbox-offer">
        <img src="/sprites/ui/chest.png" alt="" className="pixel-icon" />
        <div>
          <h3>Seedbox</h3>
          <p>Contains one random seed — what you get depends on luck!</p>
        </div>
      </div>

      <button onClick={onBuyLootBox} disabled={!canAfford}>
        Buy a Seedbox for {LOOT_BOX_PRICE} coins
      </button>

      <h3>Possible seeds</h3>
      <ul>
        {CROPS.map((crop) => (
          <li key={crop.id}>
            <span className="seed-name">
              <img src={`/sprites/crops/${crop.id}.png`} alt="" className="crop-icon" />
              {crop.name}
            </span>
            <span>
              {RARITIES[crop.rarity].label} — {getDropChance(crop).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ShopPanel
