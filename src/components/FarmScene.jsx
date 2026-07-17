function FarmScene({ subjects }) {
  if (subjects.length === 0) {
    return <p>Add a subject below to start your farm.</p>
  }

  return (
    <div className="farm-grid">
      {subjects.map((subject) => (
        <div key={subject.id} className="plot">
          <span className="plot-label">{subject.name}</span>
        </div>
      ))}
    </div>
  )
}

export default FarmScene
