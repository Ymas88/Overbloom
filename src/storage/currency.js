const CURRENCY_KEY = 'overbloom:currency'

export function getCurrency() {
  const raw = localStorage.getItem(CURRENCY_KEY)
  return raw ? Number(raw) : 0
}

export function addCurrency(amount) {
  const updated = getCurrency() + amount
  localStorage.setItem(CURRENCY_KEY, String(updated))
  return updated
}

export function setCurrency(amount) {
  localStorage.setItem(CURRENCY_KEY, String(amount))
  return amount
}
