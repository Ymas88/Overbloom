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
      <p>Loot boxes hold a mystery item — what&apos;s inside is still being figured out.</p>
      <button onClick={onBuyLootBox} disabled={!canAfford}>
        Buy a loot box for {LOOT_BOX_PRICE} coins
      </button>
    </div>
  )
}

export default ShopPanel
