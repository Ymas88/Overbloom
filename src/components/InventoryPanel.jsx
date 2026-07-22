import { CROPS, RARITIES } from '../game/crops'
import { SWORDS } from '../game/swords'

// A fixed grid of every possible seed/sword, Minecraft/Stardew-style:
// owned items show their icon and count, everything else sits there as
// an empty slot — so the grid reads as "your whole collection," not
// just a list of what you happen to be carrying.
function InventoryPanel({
  currency,
  lootBoxes,
  seeds,
  swordBoxes,
  ownedSwords,
  equippedSwordId,
  onOpenLootBox,
  onOpenSwordBox,
  onEquipSword,
  onClose,
}) {
  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Inventory</h2>
      <p className="currency-display">{currency} coins</p>

      <h3>Unopened seedboxes: {lootBoxes}</h3>
      {lootBoxes > 0 ? (
        <button onClick={onOpenLootBox}>Open a seedbox</button>
      ) : (
        <p>Buy some at the Trading Post!</p>
      )}

      <h3>Seeds</h3>
      <div className="inventory-grid">
        {CROPS.map((crop) => {
          const count = seeds[crop.id] ?? 0
          const label = `${crop.name} (${RARITIES[crop.rarity].label})`
          if (count === 0) {
            return <div key={crop.id} className="inventory-slot empty" title={`${label} — none yet`} />
          }
          return (
            <div key={crop.id} className="inventory-slot" title={`${label} — ${count} owned`}>
              <img src={`/sprites/crops/${crop.id}.png`} alt={label} className="inventory-slot-icon" />
              <span className="inventory-slot-name">{crop.name}</span>
              <span className="inventory-slot-count">{count}</span>
            </div>
          )
        })}
      </div>

      <h3>Unopened swordboxes: {swordBoxes}</h3>
      {swordBoxes > 0 ? (
        <button onClick={onOpenSwordBox}>Open a swordbox</button>
      ) : (
        <p>Buy some at the Trading Post!</p>
      )}

      <h3>Swords</h3>
      <div className="inventory-grid">
        {SWORDS.map((sword) => {
          const owned = (ownedSwords[sword.id] ?? 0) > 0
          const equipped = equippedSwordId === sword.id
          if (!owned) {
            return <div key={sword.id} className="inventory-slot empty" title={`${sword.name} — not owned`} />
          }
          return (
            <button
              key={sword.id}
              className={`inventory-slot${equipped ? ' equipped' : ''}`}
              title={`${sword.name}${equipped ? ' — equipped' : ' — click to equip'}`}
              onClick={() => onEquipSword(equipped ? null : sword.id)}
            >
              <img src={`/sprites/swords/${sword.id}.png`} alt={sword.name} className="inventory-slot-icon" />
              <span className="inventory-slot-name">{sword.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default InventoryPanel
