import Timer from './Timer'

function PlotPanel({ subject, onSessionSaved, onClose }) {
  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{subject.name}</h2>
      <Timer subjectId={subject.id} onSessionSaved={onSessionSaved} />
    </div>
  )
}

export default PlotPanel
