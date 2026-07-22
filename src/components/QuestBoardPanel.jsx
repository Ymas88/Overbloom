import { QUEST_REWARD } from '../game/quests'

function QuestBoardPanel({ quests, onClaim, onClose }) {
  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Quest Board</h2>
      <p>Today&apos;s quests — come back tomorrow for new ones.</p>

      <ul>
        {quests.map((quest) => (
          <li key={quest.id}>
            <span className="seed-name">
              {quest.label} ({Math.min(quest.value, quest.target)}/{quest.target})
            </span>
            {quest.claimed ? (
              <span>Claimed</span>
            ) : quest.complete ? (
              <button onClick={() => onClaim(quest.id)}>Claim {QUEST_REWARD} coins</button>
            ) : (
              <span>In progress</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuestBoardPanel
