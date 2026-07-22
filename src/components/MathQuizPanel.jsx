import { useState } from 'react'

// No close/X button on purpose — a slime got you, so you have to answer
// to fight back instead of freely dismissing it.
function MathQuizPanel({ question, onAnswer }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (value === '') return
    onAnswer(Number(value) === question.answer)
  }

  return (
    <div className="game-panel">
      <h2>A slime got you!</h2>
      <p>Answer fast to fight back — get it wrong and lose a health point.</p>

      <p className="timer-display">{question.text}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          placeholder="Answer"
        />
        <button type="submit">Answer</button>
      </form>
    </div>
  )
}

export default MathQuizPanel
