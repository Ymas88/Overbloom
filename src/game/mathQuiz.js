// A quick mental-math check triggered when a slime touches the player —
// answer correctly for a coin, get it wrong and lose a health point.
export function generateQuestion() {
  const a = Math.floor(Math.random() * 100) + 1
  const b = Math.floor(Math.random() * 100) + 1
  const op = Math.random() < 0.5 ? '+' : '-'
  const answer = op === '+' ? a + b : a - b
  return { a, b, op, answer, text: `${a} ${op} ${b}` }
}
