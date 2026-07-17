export function playSound(path) {
  new Audio(path).play().catch(() => {})
}
