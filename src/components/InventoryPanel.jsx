function InventoryPanel({ currency, lootBoxes, onClose }) {
  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Inventory</h2>
      <p className="currency-display">{currency} coins</p>

      <h3>Unopened loot boxes: {lootBoxes}</h3>
      <p>What&apos;s inside is still being figured out — check back later!</p>
    </div>
  )
}

export default InventoryPanel
