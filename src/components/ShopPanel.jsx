import { CROPS, RARITIES, getDropChance } from '../game/crops'
import { SHOP_SWORDS, LOOTBOX_SWORDS, SWORD_RARITIES, getSwordDropChance } from '../game/swords'
import { LOOT_BOX_PRICE, SWORD_BOX_PRICE } from '../game/shop'

function ShopPanel({ currency, onBuyLootBox, onBuySwordBox, onBuySword, onClose }) {
  const canAffordSeedbox = currency >= LOOT_BOX_PRICE
  const canAffordSwordbox = currency >= SWORD_BOX_PRICE

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

      <button onClick={onBuyLootBox} disabled={!canAffordSeedbox}>
        Buy a Seedbox for {LOOT_BOX_PRICE} coins
      </button>

      <details>
        <summary>Possible seeds</summary>
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
      </details>

      <div className="seedbox-offer">
        <img src="/sprites/ui/chest.png" alt="" className="pixel-icon" />
        <div>
          <h3>Swordbox</h3>
          <p>Contains one random sword — what you get depends on luck!</p>
        </div>
      </div>

      <button onClick={onBuySwordBox} disabled={!canAffordSwordbox}>
        Buy a Swordbox for {SWORD_BOX_PRICE} coins
      </button>

      <details>
        <summary>Possible swords</summary>
        <ul>
          {LOOTBOX_SWORDS.map((sword) => (
            <li key={sword.id}>
              <span className="seed-name">
                <img src={`/sprites/swords/${sword.id}.png`} alt="" className="crop-icon" />
                {sword.name}
              </span>
              <span>
                {SWORD_RARITIES[sword.rarity].label} — {getSwordDropChance(sword).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </details>

      <h3>Swords for sale</h3>
      <ul>
        {SHOP_SWORDS.map((sword) => (
          <li key={sword.id}>
            <span className="seed-name">
              <img src={`/sprites/swords/${sword.id}.png`} alt="" className="crop-icon" />
              {sword.name}
            </span>
            <button onClick={() => onBuySword(sword.id, sword.price)} disabled={currency < sword.price}>
              {sword.price} coins
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ShopPanel
