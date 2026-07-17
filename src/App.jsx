import { useEffect, useState } from 'react'
import { getSubjects, addSubject } from './storage/subjects'
import { getSessions } from './storage/sessions'
import FarmScene from './components/FarmScene'
import SubjectForm from './components/SubjectForm'
import SubjectList from './components/SubjectList'
import Timer from './components/Timer'
import SessionList from './components/SessionList'
import DevSessionForm from './components/DevSessionForm'

function App() {
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    setSubjects(getSubjects())
    setSessions(getSessions())
  }, [])

  function handleAddSubject(name) {
    setSubjects(addSubject(name))
  }

  function handleSessionSaved() {
    setSessions(getSessions())
  }

  return (
    <>
      <h1>overbloom</h1>

      <FarmScene subjects={subjects} sessions={sessions} />

      <h2>Timer</h2>
      <Timer subjects={subjects} onSessionSaved={handleSessionSaved} />

      <h2>Subjects</h2>
      <SubjectForm onAdd={handleAddSubject} />
      <SubjectList subjects={subjects} />

      <h2>Past sessions</h2>
      <SessionList sessions={sessions} subjects={subjects} />

      <h2>Debug: add test session</h2>
      <p>For testing growth stages without waiting real days.</p>
      <DevSessionForm subjects={subjects} onSessionAdded={handleSessionSaved} />
    </>
  )
}

export default App
