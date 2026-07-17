function subjectName(subjects, subjectId) {
  const subject = subjects.find((s) => s.id === subjectId)
  return subject ? subject.name : 'Unknown subject'
}

function SessionList({ sessions, subjects }) {
  if (sessions.length === 0) {
    return <p>No sessions yet.</p>
  }

  const sorted = [...sessions].sort((a, b) => b.startTime - a.startTime)

  return (
    <ul>
      {sorted.map((session) => (
        <li key={session.id}>
          {subjectName(subjects, session.subjectId)} —{' '}
          {new Date(session.startTime).toLocaleDateString()} —{' '}
          {session.durationMinutes.toFixed(1)} min
        </li>
      ))}
    </ul>
  )
}

export default SessionList
