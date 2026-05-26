export const today = () => new Date().toISOString().split('T')[0]

export const weekStart = () => {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - (day === 0 ? 6 : day - 1)
  return new Date(new Date().setDate(diff)).toISOString().split('T')[0]
}

export const weekDays = () => {
  const start = new Date(weekStart())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

export const countThisWeek = (days = []) => {
  const wd = weekDays()
  return days.filter(d => wd.includes(d)).length
}

export const fmtDate = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
