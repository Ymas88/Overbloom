function SubjectList({ subjects }) {
  if (subjects.length === 0) {
    return <p>No subjects yet.</p>
  }

  return (
    <ul>
      {subjects.map((subject) => (
        <li key={subject.id}>{subject.name}</li>
      ))}
    </ul>
  )
}

export default SubjectList
