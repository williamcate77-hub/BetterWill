import { useState, useEffect, useCallback } from 'react'
import { today, weekStart } from '../utils/date'

const KEY = 'betterwill-v1'

const defaults = () => ({
  date: today(),
  weekStart: weekStart(),
  barHangs: { level: 'beginner', taps: 0, days: [] },
  asianSquat: { level: 'beginner', done: false, days: [] },
  worldsStretch: { level: 'beginner', done: false, days: [] },
  kettlebell: { taps: 0, days: [] },
  dumbbell: { taps: 0, days: [] },
  mealWalk: { days: [] },
  intervalWalk: { days: [] },
})

const resetDaily = (s) => ({
  ...s,
  date: today(),
  barHangs: { ...s.barHangs, taps: 0 },
  asianSquat: { ...s.asianSquat, done: false },
  worldsStretch: { ...s.worldsStretch, done: false },
  kettlebell: { ...s.kettlebell, taps: 0 },
  dumbbell: { ...s.dumbbell, taps: 0 },
})

const resetWeekly = (s) => ({
  ...defaults(),
  barHangs: { ...defaults().barHangs, level: s.barHangs?.level ?? 'beginner' },
  asianSquat: { ...defaults().asianSquat, level: s.asianSquat?.level ?? 'beginner' },
  worldsStretch: { ...defaults().worldsStretch, level: s.worldsStretch?.level ?? 'beginner' },
})

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults()
    let s = JSON.parse(raw)
    const ws = weekStart()
    if (s.weekStart !== ws) return resetWeekly(s)
    if (s.date !== today()) return resetDaily({ ...s, weekStart: ws })
    return s
  } catch {
    return defaults()
  }
}

export const useStore = () => {
  const [state, setRaw] = useState(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const update = useCallback((key, patch) => {
    setRaw(s => ({
      ...s,
      [key]: typeof patch === 'function' ? patch(s[key]) : { ...s[key], ...patch },
    }))
  }, [])

  return { state, update }
}
