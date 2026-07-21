import SubjectForm from './SubjectForm'
import SubjectList from './SubjectList'
import SessionList from './SessionList'
import DevSessionForm from './DevSessionForm'

function FarmhousePanel({
  subjects,
  sessions,
  currency,
  seeds,
  subjectCrops,
  onAddSubject,
  onAssignCrop,
  onSessionSaved,
  onClose,
}) {
  return (
    <div className="game-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>Farmhouse</h2>

      <p className="currency-display">{currency} coins</p>

      <h3>Subjects</h3>
      <SubjectForm onAdd={onAddSubject} />
      <SubjectList
        subjects={subjects}
        seeds={seeds}
        subjectCrops={subjectCrops}
        onAssignCrop={onAssignCrop}
      />

      <h3>Past sessions</h3>
      <SessionList sessions={sessions} subjects={subjects} />

      <h3>Debug: add test session</h3>
      <p>For testing growth stages without waiting real days.</p>
      <DevSessionForm subjects={subjects} onSessionAdded={onSessionSaved} />
    </div>
  )
}

export default FarmhousePanel
