import { useState } from 'react'

function SubjectForm({ onAdd }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Subject name"
      />
      <button type="submit">Add Subject</button>
    </form>
  )
}

export default SubjectForm
