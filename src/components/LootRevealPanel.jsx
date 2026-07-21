import { RARITIES } from '../game/crops'

function LootRevealPanel({ crop, onClose }) {
  return (
    <div className="game-panel reveal-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Seedbox Opened!</h2>

      <div className="reveal-stage">
        <img src="/sprites/ui/chest.png" alt="" className="pixel-icon reveal-chest" />
        <div className="reveal-crop">
          <img src={`/sprites/crops/${crop.id}.png`} alt="" className="pixel-icon reveal-crop-icon" />
          <p className="reveal-crop-name">{crop.name}</p>
          <p className="reveal-crop-rarity">{RARITIES[crop.rarity].label}</p>
        </div>
      </div>

      <button onClick={onClose}>Nice!</button>
    </div>
  )
}

export default LootRevealPanel
