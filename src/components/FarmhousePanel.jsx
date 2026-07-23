import SubjectForm from './SubjectForm'
import SubjectList from './SubjectList'
import SessionList from './SessionList'
import DevSessionForm from './DevSessionForm'
import DevTotalsForm from './DevTotalsForm'

function FarmhousePanel({
  subjects,
  sessions,
  currency,
  seeds,
  subjectCrops,
  onAddSubject,
  onAssignCrop,
  onSessionSaved,
  onTotalsChanged,
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
      <SessionList sessions={sessions.filter((s) => s.subjectId !== null)} subjects={subjects} />

      <h3>Debug: add test session</h3>
      <p>For testing growth stages without waiting real days.</p>
      <DevSessionForm subjects={subjects} onSessionAdded={onSessionSaved} />

      <h3>Debug: set coins &amp; total study minutes</h3>
      <p>For testing shop prices or the Crystal Hollows unlock without earning them for real.</p>
      <DevTotalsForm currency={currency} sessions={sessions} onChanged={onTotalsChanged} />
    </div>
  )
}

export default FarmhousePanel
