import { useEffect, useState } from 'react'
import { getSubjects, addSubject } from './storage/subjects'
import SubjectForm from './components/SubjectForm'
import SubjectList from './components/SubjectList'

function App() {
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    setSubjects(getSubjects())
  }, [])

  function handleAddSubject(name) {
    setSubjects(addSubject(name))
  }

  return (
    <>
      <h1>overbloom</h1>

      <h2>Subjects</h2>
      <SubjectForm onAdd={handleAddSubject} />
      <SubjectList subjects={subjects} />
    </>
  )
}

export default App
