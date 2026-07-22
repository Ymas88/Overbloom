import { CROPS, RARITIES } from '../game/crops'
import { SWORDS } from '../game/swords'

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
  const ownedCrops = CROPS.filter((crop) => (seeds[crop.id] ?? 0) > 0)
  const ownedSwordList = SWORDS.filter((sword) => (ownedSwords[sword.id] ?? 0) > 0)

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
      {ownedCrops.length === 0 ? (
        <p>No seeds yet — open a seedbox to get some.</p>
      ) : (
        <ul>
          {ownedCrops.map((crop) => (
            <li key={crop.id}>
              <span className="seed-name">
                <img src={`/sprites/crops/${crop.id}.png`} alt="" className="crop-icon" />
                {crop.name} ({RARITIES[crop.rarity].label})
              </span>
              <span>{seeds[crop.id]}</span>
            </li>
          ))}
        </ul>
      )}

      <h3>Unopened swordboxes: {swordBoxes}</h3>
      {swordBoxes > 0 ? (
        <button onClick={onOpenSwordBox}>Open a swordbox</button>
      ) : (
        <p>Buy some at the Trading Post!</p>
      )}

      <h3>Swords</h3>
      {ownedSwordList.length === 0 ? (
        <p>No swords yet — buy or win one at the Trading Post.</p>
      ) : (
        <ul>
          {ownedSwordList.map((sword) => {
            const equipped = equippedSwordId === sword.id
            return (
              <li key={sword.id}>
                <span className="seed-name">
                  <img src={`/sprites/swords/${sword.id}.png`} alt="" className="crop-icon" />
                  {sword.name}
                </span>
                <button onClick={() => onEquipSword(equipped ? null : sword.id)}>
                  {equipped ? 'Equipped' : 'Equip'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default InventoryPanel
