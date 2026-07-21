function InventoryPanel({ currency, onClose }) {
  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Inventory</h2>
      <p className="currency-display">{currency} coins</p>
    </div>
  )
}

export default InventoryPanel
