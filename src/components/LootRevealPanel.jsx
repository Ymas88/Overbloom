function LootRevealPanel({ title = 'Seedbox Opened!', iconSrc, name, rarityLabel, onClose }) {
  return (
    <div className="game-panel reveal-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{title}</h2>

      <div className="reveal-stage">
        <img src="/sprites/ui/chest.png" alt="" className="pixel-icon reveal-chest" />
        <div className="reveal-crop">
          <img src={iconSrc} alt="" className="pixel-icon reveal-crop-icon" />
          <p className="reveal-crop-name">{name}</p>
          <p className="reveal-crop-rarity">{rarityLabel}</p>
        </div>
      </div>

      <button onClick={onClose}>Nice!</button>
    </div>
  )
}

export default LootRevealPanel
